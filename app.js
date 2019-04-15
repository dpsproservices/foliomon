const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const request = require('request');
//const axios = require("axios");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const { Builder, By, Key, until } = require('selenium-webdriver');
const config = require('./config/config.js');
//const routes = require('./routes/routes.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var access_token = null;
var expires_in = null; //1800;
var refresh_token_expires_in = null; //7776000;
var token_type = null; //"Bearer";

// TD Ameritrade will redirect to GET https://localhost:7777/foliomon if login() was successful
// This will POST to the TD auth token URL to get the authorization code
// On success, store the timestamp, auth code, and expiration for the app to refer to 
app.get('/foliomon', function(req, res) {

    console.log('app get foliomon begin')

    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    var options = {
        // see the Authentication API's Post Access Token method for more information
        url: config.auth.tokenUrl,
        method: 'POST',
        headers: headers,
        // POST Body params
        form: {
            'grant_type': 'authorization_code',
            'access_type': 'offline',
            'code': req.query.code, // get the code
            'client_id': config.auth.clientId, // OAuth User UD
            'redirect_uri': config.auth.redirectUrl
        }
    }

    // Post Access Token request
    request(options, function(error, response, body) {

        console.log('app get foliomon request begin')

        if (!error && response.statusCode == 200) {

            // see Post Access Token response summary for what authReply contains
            authReply = JSON.parse(body);

            access_token = authReply.access_token;

            expires_in = authReply.expires_in;
            refresh_token_expires_in = authReply.refresh_token_expires_in;
            token_type = authReply.token_type;

            // the line below is for convenience to test that it's working after authenticating
            res.send(authReply);

        }
        /*else if (response.statusCode == 400) {
	
			// An error message indicating the validation problem with the request.

		} else if (response.statusCode == 401) {
		
			// An error message indicating the caller must pass valid credentials in the request body.
		
		} else if (response.statusCode == 500) {

			// An error message indicating there was an unexpected server error.
		
		} else if (response.statusCode == 403) {
	
			// An error message indicating the caller doesn't have access to the account in the request.

		} else if (response.statusCode == 503) {

			// An error message indicating there is a temporary problem responding.
		}*/
    })

    function errorHandler(err, req, res, next) {
        console.log(`app get foliomon errorHandler error: ${err}`)

        res.status(500)
        res.render('error', { error: err })
    }

    console.log('app get foliomon end')
});

/*

Go to a browser and enter your app's authentication URL in the format below. Remember to URLEncode the variables before adding them to the URL

https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=Redirect URI&client_id=OAuth User ID


https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A7777%2Ffoliomon&client_id=FOLIOMON%40AMER.OAUTHAP

If the app is working, you should see the Post Access Token response in the browser

*/

/**
 * login()
 * 
 * Login and authorize the app to use the TD account using Selenium WebDriver for Firefox named geckodriver
 * 1 Selenium opens Firefox to the TD auth URL containing the redirect_uri and client_id
 * 2 enters the username and password for the TD account into the login form and submits it
 * 3 after submitting the form the TD site forwards to the page with the Allow button and Selenium clicks it
 * 4 TD auth site will redirect to GET the URL registered for the FOLIOMON app
 */
const login = async() => {

    let webDriver = await new Builder().forBrowser('firefox').build();
    try {
        console.log(`Attempt to login at authentication url: ${config.auth.authUrl}`);
        await webDriver.get(config.auth.authUrl);
        await webDriver.findElement(By.id('username')).sendKeys(config.auth.userName);
        await webDriver.findElement(By.id('password')).sendKeys(config.auth.password);
        await webDriver.findElement(By.id('accept')).click()
            .then(() => console.log('Submitted login form, TD should now redirect to Allow page...'));
        await webDriver.wait(until.elementLocated(By.id('allow')), 5000);
        await webDriver.findElement(By.id('allow')).click()
            .then(() => console.log(`Allowed access, TD should now redirect to GET foliomon url: ${config.auth.redirectUrl}`));
        await webDriver.wait(until.urlIs(config.auth.redirectUrl), 10000)
            .then(() => console.log('Logged into TD...'));
    } catch (err) {
        console.log(err);
    } finally {
        console.log("login() webDriver quitting...");
        await webDriver.quit();
    }
};

const startServer = async() => {
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

        // login to the TD Ameritrade page with Selenium
        // which will then redirect to GET the redirect_uri
        //   
        //await login();

        //console.log('startServer end');
    } catch (err) {
        //console.log("entering catch block");
        console.log(err);
        //console.log("leaving catch block");
        process.exit(1)
    }
};

startServer();