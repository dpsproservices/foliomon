const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const request = require('request-promise-native');
request.debug = true;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require("body-parser");
const config = require('./config/config');
const routes = require('./routes/routes');
const { Builder, By, Key, until } = require('selenium-webdriver');
const schedule = require('node-schedule');
const util = require('util');
//const setTimeoutPromise = util.promisify(setTimeout);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Moved authorization to routes.js
app.use('/', routes);

//const httpServer = http.createServer(app);
const httpsServer = https.createServer(config.webServer.sslKeyCert, app);

/**
 * login()
 * 
 * Login and authorize the app to use the TD account using Selenium WebDriver for Firefox named geckodriver
 * 1 Selenium opens Firefox to the TD auth URL containing the redirect_uri and client_id
 * 2 enters the username and password for the TD account into the login form and submits it
 * 3 after submitting the form the TD site forwards to the page with the Allow button and Selenium clicks it
 * 4 TD auth site will redirect to GET the URL registered for the FOLIOMON app
 */
async function login() {
    let webDriver = await new Builder().forBrowser('firefox').build();
    try {
        console.log(`Attempt to login at authentication url: ${config.auth.authUrl}`);
        await webDriver.get(config.auth.authUrl);
        await webDriver.wait(until.elementLocated(By.id('accept')), 5000);
        await webDriver.findElement(By.id('username')).sendKeys(config.auth.username);
        await webDriver.findElement(By.id('password')).sendKeys(config.auth.password);
        await webDriver.findElement(By.id('accept')).click() //Log In button
            .then(() => console.log('Submitted login form, TD should now redirect to Allow page...'));

        await webDriver.wait(until.elementLocated(By.name('authorize')), 5000);
        await webDriver.findElement(By.name('authorize')).click()
            .then(() => console.log(`Allowed access, TD should now redirect to GET foliomon url: ${config.auth.redirectUrl}`));

        await webDriver.wait(until.urlIs(config.auth.redirectUrl), 5000)
            .then(() => console.log('Logged into TD...'));
    } catch (err) {
        console.log(err);
        // should cause process to exit
        process.exit(1)
    } finally {
        console.log("login() Selenium webDriver quitting...");
        await webDriver.quit();
    }
};

async function startServer() {
    try {
        // Connect MongoDB
        await mongoose.connect(config.mongodb.url, { useNewUrlParser: true })
            .then(() => console.log('MongoDB connected…'))
            .catch(err => console.log(err));

        // Set to 8080, but can be any port, code will only come over https, 
        // even if you specified http in your Redirect URI
        /*
        httpServer.listen(config.webServer.httpPort, () => {
            console.log(`httpServer running at http://${config.webServer.hostname}:${config.webServer.httpPort}/`)
        });
        */

        await httpsServer.listen(config.webServer.httpsPort, () => {
            console.log(`httpsServer running at https://${config.webServer.hostname}:${config.webServer.httpsPort}/`)
        });

        var isAppAuthorized = await authorizeApp();

        if (isAppAuthorized) {
            // Initialize the app data
            await initializeApp();

            // run the app scheduled jobs
            runMainEventLoop();
        } else {
            //await login();
            //process.exit(0);
        }
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

// Gracefully stop the app server close db connection and exit
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    httpsServer.close(() => {
        console.log('Https server closed.');
        // boolean means [force], see in mongoose doc
        mongoose.connection.close(false, () => {
            console.log('MongoDb connection closed.');
            process.exit(0);
        });
    });
});

/*

Requests can be made by authenticating your application and a user in combination, or only authenticating your application (referred to as unauthenticated requests). Without user authentication and authorization, public resources like delayed data may be available.
Unauthenticated Requests

Right now, APIs offering this generally only require the OAuth User ID passed in to a parameter. In the future, we will move toward only supporting the OAuth 2.0 Client Credentials flow described in section 1.3.4 of RFC 6749 for this type of request.
Authenticated Requests

To authenticate a user, we use the OAuth 2.0 Authorization Code flow described in section 1.3.1 of RFC 6749. The best way to see this in action is to follow the steps on the simple auth guide

Invoke the authentication window in the browser with the URL https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=Redirect URI&client_id=OAuth User ID@AMER.OAUTHAP.
When the user has authenticated, a GET request will be made to your redirect URI with the authorization code passed as a parameter.
This authorization code can then be passed as the code parameter to the Authentication API's Post Access Token method using the authorization_code grant type. To receive a refresh token which allows you to receive a new access token after the access token's expiration of 30 minutes, set the access type to offline.
When you have POSTed details to the token endpoint and received your access token and refresh token, you can pass the access token as a bearer token by setting the Authorization header on all requests to "Bearer Access Token"

*/

async function authorizeApp() {

    var dateNow = new Date();
    var isAccessTokenExpired = false;
    var isRefreshTokenExpired = false;
    var accessTokenExpirationDate = null;
    var refreshTokenExpirationDate = null;
    var accessTokenReply = null;
    var refreshTokenReply = null;
    var authorized = false;

    // Fetch the access token from the db and check its expiration date time
    // GET /foliomon/getAccessToken
    await request({
            method: 'GET',
            url: `${config.webServer.baseUrl}/accesstoken`,
            rejectUnauthorized: false
        })
        .then(function(body) { // reply body parsed with implied status code 200
            accessTokenReply = JSON.parse(body);
            accessTokenExpirationDate = accessTokenReply.accessTokenExpirationDate;
            if (accessTokenExpirationDate <= dateNow) {
                isAccessTokenExpired = true;
            }
        })
        .catch(function(err) { // handle all response status code other than OK 200
            console.log(`Error in authorizeApp from /foliomon/accesstoken ${err}`);
            isAccessTokenExpired = true;
        });

    // Fetch the refresh token from the db and check its expiration date time
    // GET /foliomon/getRefreshToken
    await request({
            method: 'GET',
            url: `${config.webServer.baseUrl}/refreshtoken`,
            rejectUnauthorized: false
        })
        .then(function(body) { // reply body parsed with implied status code 200
            refreshTokenReply = JSON.parse(body);
            refreshTokenExpirationDate = refreshTokenReply.refreshTokenExpirationDate;
            if (refreshTokenExpirationDate <= dateNow) {
                isRefreshTokenExpired = true;
            }
        })
        .catch(function(err) { // handle all response status code other than OK 200
            console.log(`Error in authorizeApp from /foliomon/refreshtoken ${err}`);
            isRefreshTokenExpired = true;
        });

    if (!isAccessTokenExpired && !isRefreshTokenExpired) {
        authorized = true;
        console.log('authorizeApp Tokens are valid...');
        return authorized;
    }

    // if access token is expired but the refresh token is not expired yet
    // use it to request a new access token and refresh token and save them
    if (isAccessTokenExpired && !isRefreshTokenExpired) {
        // GET /foliomon/reauthorize
        await request({
                method: 'GET',
                url: `${config.webServer.baseUrl}/reauthorize`,
                rejectUnauthorized: false
            })
            .then(function(body) { // reply body parsed with implied status code 200
                //reauthTokenReply = JSON.parse(body);
                console.log('authorizeApp got new tokens from /foliomon/reauthorize.');
                authorized = true;
            })
            .catch(function(err) { // handle all response status code other than OK 200
                console.log(`Error in authorizeApp from /foliomon/reauthorize ${err}`);
            });
        return authorized;
    }

    // when both access token and refresh token are expired
    // or neither are available in the db then
    // login to the TD Ameritrade page with Selenium
    // which will then redirect to GET the foliomon redirect_uri 
    // which will request a new access token 
    // and the response will also include a refresh token and save both to db
    if (isAccessTokenExpired && isRefreshTokenExpired) {
        authorized = false;
        console.log('authorizeApp Need to login to TD to get new tokens...');
        return authorized;
    }
}

async function initializeAccountsData() {

    var isAccountsDataAvailable = false;
    var accounts = null;

    // Verify the accounts are stored otherwise get them and store them
    // GET /foliomon/accounts
    await request({
            method: 'GET',
            url: `${config.webServer.baseUrl}/accounts`,
            rejectUnauthorized: false
        })
        .then(function(body) { // reply body parsed with implied status code 200
            accountsReply = JSON.parse(body);
            accounts = accountsReply.accounts; // array of accounts
            isAccountsDataAvailable = true;
        })
        .catch(function(err) { // handle all response status code other than OK 200
            console.log(`Error in initializeAccountsData from /foliomon/accounts ${err}`);
            isAccountsDataAvailable = false;
        });

    if (!isAccountsDataAvailable) {
        console.log('initializeAccountsData No accounts data available. Getting from TD...');
        // Verify the accounts are stored otherwise get them and store them
        // GET /foliomon/accounts
        await request({
                method: 'GET',
                url: `${config.webServer.baseUrl}/accounts/init`,
                rejectUnauthorized: false
            })
            .then(function(body) { // reply body parsed with implied status code 200
                accountsReply = JSON.parse(body);
                accounts = accountsReply.accounts; // array of accounts
                isAccountsDataAvailable = true;
            })
            .catch(function(err) { // handle all response status code other than OK 200
                console.log(`Error in initializeAccountsData from /foliomon/accounts/init ${err}`);
                isAccountsDataAvailable = false;
            });
    }
}

function initializeApp() {

    initializeAccountsData();

}

function runMarketOpenEvents() {

};

function runMarketCloseEvents() {

};

// Precondition: Run after web server starts and db is running and connected.
function runMainEventLoop() {
    try {
        /*
        RecurrenceRule properties
        second(0 - 59)
        minute(0 - 59)
        hour(0 - 23)
        date(1 - 31)
        month(0 - 11) Jan = 0 , Dec = 11
        year YYYY
        dayOfWeek(0 - 6) Starting with Sunday = 0 , Saturday = 6
        */

        // Run authorize job every weekday M T W TH F every 20 minutes between 8:00 AM and 5:00 PM EST
        var authorizeRecurrenceRule = { rule: '*/20 8-17 * * 1-5' };
        var authorizeScheduleJob = schedule.scheduleJob(authorizeRecurrenceRule, function(jobRunAtDate) {
            console.log('authorizeRecurrenceRule is scheduled to run at ' + jobRunAtDate + ', date time now: ' + new Date());
            authorizeApp();
        });

        // Run market pre-open job every weekday M T W TH F at 8:15 AM EST
        var marketOpenRecurrenceRule = new schedule.RecurrenceRule();
        marketOpenRecurrenceRule.dayOfWeek = [new schedule.Range(1, 5)];
        marketOpenRecurrenceRule.hour = 8;
        marketOpenRecurrenceRule.minute = 15;
        var marketOpenScheduleJob = schedule.scheduleJob(marketOpenRecurrenceRule, function(jobRunAtDate) {
            console.log('marketOpenRecurrenceRule is scheduled to run at ' + jobRunAtDate + ', date time now: ' + new Date());
            runMarketOpenEvents();
        });

        // Run market close job every weekday M T W TH F at 5:00 PM EST
        var marketCloseRecurrenceRule = new schedule.RecurrenceRule();
        marketCloseRecurrenceRule.dayOfWeek = [new schedule.Range(1, 5)];
        marketCloseRecurrenceRule.hour = 17;
        marketCloseRecurrenceRule.minute = 0;
        var marketCloseScheduleJob = schedule.scheduleJob(marketCloseRecurrenceRule, function(jobRunAtDate) {
            console.log('marketCloseRecurrenceRule is scheduled to run at ' + jobRunAtDate + ', date time now: ' + new Date());
            runMarketCloseEvents();
        });

    } catch (err) {
        console.log(err);
        process.exit(1)
    }
};

startServer();