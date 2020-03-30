const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const request = require('request-promise-native');
//request.debug = true;
const axios = require('axios');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require("body-parser");
const config = require('./config/config');
const routes = require('./routes/routes');
const schedule = require('node-schedule');
const util = require('util');
//const setTimeoutPromise = util.promisify(setTimeout);
const path = require('path');
require("dotenv").config();

const app = express();
if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Moved authorization to routes.js
app.use('/', routes);

app.use(express.static("front-end/build"));

//const httpServer = http.createServer(app);
const httpsServer = https.createServer(config.webServer.sslKeyCert, app);

async function startServer() {
    try {

        console.log("Starting server...");
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
            //runMainEventLoop();
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
    var baseUrl = `https://${config.webServer.hostname}:${config.webServer.httpsPort}`;

    // Fetch the access token from the db and check its expiration date time
    // GET /foliomon/getAccessToken
    try {
        accessTokenReply = await axios({
            method: 'GET',
            url: `${baseUrl}/foliomon/accesstoken`//,
            //rejectUnauthorized: false // REMOVE before DEPLOYMENT
        });

        // reply body parsed with implied status code 200
        const parsed = JSON.parse(accessTokenReply);
        accessTokenExpirationDate = new Date(parsed.accessToken.accessTokenExpirationDate);

        if (accessTokenExpirationDate <= dateNow) {
            isAccessTokenExpired = true;
        }
    } catch(err) { // handle all response status code other than OK 200
        console.log(`Error in authorizeApp from /foliomon/accesstoken ${err}`);
        isAccessTokenExpired = true;
    }    

    // Fetch the refresh token from the db and check its expiration date time
    // GET /foliomon/getRefreshToken
    try {
        refreshTokenReply = await axios({
            method: 'GET',
            url: `${baseUrl}/foliomon/refreshtoken`//,
            //rejectUnauthorized: false
        });

        // reply body parsed with implied status code 200
        const parsed = JSON.parse(refreshTokenReply);
        refreshTokenExpirationDate = new Date(parsed.refreshToken.refreshTokenExpirationDate);

        if (refreshTokenExpirationDate <= dateNow) {
            console.log(`Refresh token has expired.`);
            isRefreshTokenExpired = true;
        }
    } catch(err) { // handle all response status code other than OK 200
        console.log(`Error in authorizeApp from /foliomon/refreshtoken ${err}`);
        isRefreshTokenExpired = true;
    }

    // if the access token exists and it isnt expired continue 
    // otherwise if access token is expired but the refresh token is not expired yet
    // use it to request a new access token and refresh token and save them
    if(!isAccessTokenExpired) {
        authorized = true;
    } else if (isAccessTokenExpired && !isRefreshTokenExpired) {
        // GET /foliomon/reauthorize
        let body = {};
        try {
            body = await axios({
                method: 'GET',
                url: `${baseUrl}/foliomon/reauthorize`//,
                //rejectUnauthorized: false
            });
            // reply body parsed with implied status code 200
            //reauthTokenReply = JSON.parse(body);
            console.log('authorizeApp got new tokens from /foliomon/reauthorize.');
            authorized = true;
        } catch(err) { // handle all response status code other than OK 200
            console.log(`Error in authorizeApp from /foliomon/reauthorize ${err}`);
        };
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
    }

    console.log({ isAccessTokenExpired, isRefreshTokenExpired });

    return authorized;
}

async function initializeAccountsData() {

    var isAccountsDataAvailable = false;
    var accounts = null;

    // Verify the accounts are stored otherwise get them and store them
    // GET /foliomon/accounts
    await axios({
            method: 'GET',
            url: `${config.webServer.baseUrl}/accounts`//,
            //rejectUnauthorized: false
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
        await axios({
                method: 'GET',
                url: `${config.webServer.baseUrl}/accounts/init`//,
                //rejectUnauthorized: false
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