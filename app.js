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
const AuthService = require('./services/AuthService');
const AccountService = require('./services/AccountService');
const OrderService = require('./services/OrderService');
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
            runMainEventLoop();
        } else {
            // send email to notify to login and refresh the tokens to continue
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

Requests can be made by authenticating your application and a user in combination, 
or only authenticating your application (referred to as unauthenticated requests). 
Without user authentication and authorization, public resources like delayed data may be available.

Unauthenticated Requests

Right now, APIs offering this generally only require the OAuth User ID passed in to a parameter. 
In the future, we will move toward only supporting the OAuth 2.0 Client Credentials flow 
described in section 1.3.4 of RFC 6749 for this type of request.
Authenticated Requests

To authenticate a user, we use the OAuth 2.0 Authorization Code flow described in section 1.3.1 of RFC 6749. 
The best way to see this in action is to follow the steps on the simple auth guide

Invoke the authentication window in the browser with the URL 
https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=Redirect URI&client_id=OAuth User ID@AMER.OAUTHAP.
When the user has authenticated, a GET request will be made to your redirect URI with the authorization code passed as a parameter.
This authorization code can then be passed as the code parameter to the Authentication API's Post Access Token method 
using the authorization_code grant type. 
To receive a refresh token which allows you to receive a new access token after the access token's expiration of 30 minutes, 
set the access type to offline.
When you have POSTed details to the token endpoint and received your access token and refresh token, 
you can pass the access token as a bearer token by setting the Authorization header on all requests to "Bearer Access Token"

*/

async function authorizeApp() {
    var timeNow = new Date();
    console.log(`authorizeApp START ${timeNow}`);    

    var dateNow = new Date();
    var isAccessTokenExpired = false;
    var isRefreshTokenExpired = false;
    var accessTokenExpirationDate = null;
    var refreshTokenExpirationDate = null;
    var authorized = false;

    // Fetch the access token from the db and check its expiration date time
    try {
        accessToken = await AuthService.getAccessToken();
        accessTokenExpirationDate = new Date(accessToken.accessTokenExpirationDate);

        if (accessTokenExpirationDate <= new Date()) {
            console.log(`Access token has expired.`);
            isAccessTokenExpired = true;
        }
    } catch(err) {
        console.log(`Error in authorizeApp ${err}`);
        isAccessTokenExpired = true;
    }    

    // Fetch the refresh token from the db and check its expiration date time
    try {
        refreshToken = await AuthService.getRefreshToken();
        refreshTokenExpirationDate = new Date(refreshToken.refreshTokenExpirationDate);

        if (refreshTokenExpirationDate <= new Date()) {
            console.log(`Refresh token has expired.`);
            isRefreshTokenExpired = true;
        }
    } catch(err) {
        console.log(`Error in authorizeApp ${err}`);
        isRefreshTokenExpired = true;
    }

    // if the access token exists and it isnt expired continue 
    // otherwise if access token is expired but the refresh token is not expired yet
    // use it to request a new access token and refresh token and save them
    if(!isAccessTokenExpired) {
        authorized = true;
    } else if (isAccessTokenExpired && !isRefreshTokenExpired) {

        try {
            const responseObject = await AuthService.reauthorize();
            if (responseObject) {
                console.log('authorizeApp got new tokens.');
                authorized = true;
            }
        } catch(err) { // handle all response status code other than OK 200
            console.log(`Error in authorizeApp ${err}`);
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
    try {
        accounts = await AccountService.getDbAccounts();
        isAccountsDataAvailable = true;
    } catch(err) {
        console.log(`Error in initializeAccountsData ${err}`);
        isAccountsDataAvailable = false;
    }

    if (!isAccountsDataAvailable) {
        console.log('initializeAccountsData No accounts data available. Getting from TD...');

        try {
            accounts = await AccountService.getApiAccounts();
            if (accounts && accounts.length > 0)
                await AccountService.saveDbAccounts(accounts);
        } catch(err) {
            console.log(`Error in initializeAccountsData ${err}`);
        }
       
    }
}

async function initializeOrdersData() {

    var isOrdersDataAvailable = false;
    var orders = null;

    // Verify the orders are stored otherwise get them and store them
    try {
        orders = await OrderService.db.getOrders();
        isOrdersDataAvailable = true;
    } catch (err) {
        isOrdersDataAvailable = false;
    }

    if (!isOrdersDataAvailable) {
        console.log('initializeOrdersData No orders data available. Getting from TD...');

        try {
            const orders = await OrderService.api.getOrders();
            const dbResult = await OrderService.db.resetOrders(orders);
        } catch (err) {
            console.log(`Error in initializeOrdersData ${err}`);
        }

    }
}

function initializeApp() {

    initializeAccountsData();
    //initializeOrdersData();
}

function runMarketOpenEvents() {
    var timeNow = new Date();
    console.log(`runMarketOpenEvents START ${timeNow}`);
};

function runMarketCloseEvents() {
    var timeNow = new Date();
    console.log(`runMarketCloseEvents START ${timeNow}`);
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
        // var authorizeRecurrenceRule = { rule: '*/20 8-17 * * 1-5' };

        var authorizeRecurrenceRule = { rule: '*/1 * * * *' };

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