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

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Moved authorization to routes.js
app.use('/', routes);

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
    } finally {
        console.log("login() Selenium webDriver quitting...");
        await webDriver.quit();
    }
};

function startServer() {
    try {
        //console.log('startServer begin');

        // Connect MongoDB
        mongoose.connect(config.mongodb.url, { useNewUrlParser: true })
            .then(() => console.log('MongoDB connected…'))
            .catch(err => console.log(err));

        const httpServer = http.createServer(app);
        const httpsServer = https.createServer(config.webServer.sslKeyCert, app);

        // Set to 8080, but can be any port, code will only come over https, 
        // even if you specified http in your Redirect URI
        httpServer.listen(config.webServer.httpPort, () => {
            console.log(`httpServer running at http://${config.webServer.hostname}:${config.webServer.httpPort}/`)
        });

        httpsServer.listen(config.webServer.httpsPort, () => {
            console.log(`httpsServer running at https://${config.webServer.hostname}:${config.webServer.httpsPort}/`)
        });

        //console.log('startServer end');
    } catch (err) {
        //console.log("entering catch block");
        console.log(err);
        //console.log("leaving catch block");
        process.exit(1)
    }
};

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


async function runMainEventLoop() {
    try {

        // Fetch the access token from the db and check its expiration date time
        // GET /foliomon/getAccessToken

        // If the refresh token expired then do login to request a new access token 
        // which the response will also include a refresh token and save both to db 

        // login to the TD Ameritrade page with Selenium
        // which will then redirect to GET the foliomon redirect_uri 
        //await login();

        // otherwise if the refresh token is not expired yet
        // use it to request a new access token and save it
        // GET /foliomon/reauthorize

    } catch (err) {
        console.log(err);
        process.exit(1)
    }
};

startServer();
//runMainEventLoop();