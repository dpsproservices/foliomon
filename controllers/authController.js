const config = require('../config/config.js');
//const request = require('request-promise-native');
const axios = require('axios');
//request.debug = true;
const AccessToken = require('../models/auth/AccessToken');
const RefreshToken = require('../models/auth/RefreshToken');
const AuthService = require('../services/AuthService');

// GET /foliomon/getAccessToken
// get the Access Token from the db
exports.getAccessToken = function(req, res) {
    AuthService.getAccessToken()
    .then(function(foundToken) {
        if (foundToken) {
            console.log(`Found access token: ${foundToken}`)
            res.status(200).send({ accessToken: foundToken })
            return foundToken;
        } else {
            console.log('No access token found in database.')
            res.status(404).send({ error: 'No access token found in database.' })
        }
    })
    .catch(function(err) {
        console.log(`Error fetching access token from database: ${err}`)
        res.status(500).send({ error: 'Error fetching access token from database.' })
    });
};

// GET /foliomon/getRefreshToken
// get the Refresh Token from the db
exports.getRefreshToken = function(req, res) {
    AuthService.getRefreshToken()
    .then(function(foundToken) {
        if (foundToken) {
            console.log(`Found refresh token: ${foundToken}`)
            res.status(200).send({ refreshToken: foundToken })
        } else {
            console.log('No refresh token found in database.')
            res.status(404).send({ error: 'No refresh token found in database.' })
        }
    })
    .catch(function(err) {
        console.log(`Error fetching refresh token from database: ${err}`)
        res.status(500).send({ error: 'Error fetching refresh token from database.' })
    });
};

// PUT /foliomon/saveAccessToken
// Save the access token UPSERT
exports.saveAccessToken = function(req, res) {
    try {
        if (!req.body.access_token) {
            console.log('authController.saveAccessToken Error invalid access_token in request body.');
            res.status(400).send({ error: 'Error invalid access_token in request body.' });
        }

        if (!req.body.token_type) {
            console.log('authController.saveAccessToken Error invalid token_type in request body.');
            res.status(400).send({ error: 'Error invalid token_type in request body.' });
        }

        if (!req.body.expires_in) {
            console.log('authController.saveAccessToken Error invalid expires_in in request body.');
            res.status(400).send({ error: 'Error invalid expires_in in request body.' });
        }

        var grantedDate = new Date(); // date time now it was just granted
        var tokenType = req.body.token_type;
        var accessToken = req.body.access_token;
        var expiresInSeconds = req.body.expires_in;

        var expirationDate = new Date();
        expirationDate.setTime(grantedDate.getTime() + (expiresInSeconds * 1000));

        var conditions = {}; // no filter just replace first one found

        let update = {
            tokenType: tokenType, // "Bearer"
            accessToken: accessToken,
            accessTokenExpiresInSeconds: expiresInSeconds, // seconds to expire from now
            accessTokenGrantedDate: grantedDate, // date time access token was granted
            accessTokenExpirationDate: expirationDate // date time access token will expire (granted date + expires in)
        };

        let options = {
            new: true,
            upsert: true
        };

        AccessToken.findOneAndUpdate(conditions, update, options).exec()
            .then(function(savedToken) {
                console.log(`Saved access token: ${savedToken}`)
                res.status(200).send({ accessToken: savedToken })
            })
            .catch(function(err) {
                console.log(`Unable to save access token to database: ${err}`)
                res.status(500).send({ error: 'Unable to save access token to database.' })
            });

    } catch (err) {
        console.log(`Error in authController.saveAccessToken ${err}`);
        res.status(500).send({ error: 'Unable to save access token to database.' });
    }
};

// PUT /foliomon/saveRefreshToken
// Save the refresh token UPSERT
exports.saveRefreshToken = function(req, res) {
    try {
        var grantedDate = new Date(); // date time now it was just granted

        if (!req.body.refresh_token) {
            console.log('authController.saveAccessToken Error invalid refresh_token in request body.');
            res.status(400).send({ error: 'Error invalid refresh_token in request body.' });
        }

        if (!req.body.token_type) {
            console.log('authController.saveAccessToken Error invalid token_type in request body.');
            res.status(400).send({ error: 'Error invalid token_type in request body.' });
        }

        if (!req.body.refresh_token_expires_in) {
            console.log('authController.saveAccessToken Error invalid refresh_token_expires_in in request body.');
            res.status(400).send({ error: 'Error invalid refresh_token_expires_in in request body.' });
        }

        var tokenType = req.body.token_type;
        var refreshToken = req.body.refresh_token;
        var expiresInSeconds = req.body.refresh_token_expires_in;
        var expirationDate = new Date();
        expirationDate.setTime(grantedDate.getTime() + (expiresInSeconds * 1000));

        var conditions = {}; // no filter just replace first one found

        let update = {
            tokenType: tokenType, // "Bearer"
            refreshToken: refreshToken,
            refreshTokenExpiresInSeconds: expiresInSeconds, // seconds to expire from now
            refreshTokenGrantedDate: grantedDate, // date time refresh token was granted
            refreshTokenExpirationDate: expirationDate // date time refresh token will expire (granted_date + expires_in)
        };

        let options = {
            new: true,
            upsert: true
        };

        RefreshToken.findOneAndUpdate(conditions, update, options).exec()
            .then(function(savedToken) {
                console.log(`Saved refresh token: ${savedToken}`)
                res.status(200).send({ refreshToken: savedToken })
            })
            .catch(function(err) {
                console.log(`Unable to save refresh token to database: ${err}`)
                res.status(500).send({ error: 'Unable to save refresh token to database.' })
            });

    } catch (err) {
        console.log(`Error in authController.saveRefreshToken ${err}`);
        res.status(500).send({ error: 'Unable to save refresh token to database.' });
    }
};

// GET /foliomon
// Authorize the foliomon app to use the TD account

// See the Authentication API's Post Access Token method for more information
// https://developer.tdameritrade.com/authentication/apis/post/token-0

// https://developer.tdameritrade.com/content/simple-auth-local-apps

// request a new Access Token and new Refresh Token from TD
// using the authorization code grant
// and store them into the db together with their expiration date times
// After the app is Approve to use the account TD redirects here
exports.authorize = async (req, res) => {
    try {
        console.log('authController.authorize begin');

        const responseObject = await AuthService.authorize(req.query.code);

        res.status(200).send(responseObject);

        console.log('authController.authorize end');
    } catch (err) {
        console.log(`Error in authController.authorize: ${err}`);
        res.status(404).send(err);
    }
}

// GET /foliomon/reauthorize
// request a new Access Token and also new Refresh Token from TD 
// before access token expires every 30 minutes
// using current refresh token from db which expires every 90 days
exports.reauthorize = async (req, res) => {
    try {
        console.log('authController.reauthorize begin');

        const responseObject = await AuthService.reauthorize();

        res.status(200).send(responseObject);

        console.log('authController.reauthorize end');
    } catch(err) {
        console.log(`Error in authController.reauthorize: ${err}`);
        res.status(404).send(err);
    }
}