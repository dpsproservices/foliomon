const config = require('../config/config.js');
//const request = require('request');
//const request = require('request-promise');
const request = require('request-promise-native');
request.debug = true;
const AccessToken = require('../models/AccessToken');
const RefreshToken = require('../models/RefreshToken');

// GET /foliomon/getAccessToken
// get the Access Token from the db
exports.getAccessToken = function(req, res) {
    AccessToken.findOne().exec()
        .then(function(foundToken) {
            if (foundToken) {
                console.log(`Found access token: ${foundToken}`)
                res.status(200).send(`Found access token: ${foundToken}`)
            } else {
                console.log('No access token found in database.')
                res.status(404).send('No access token found in database.')
            }
        })
        .catch(function(err) {
            console.log(`Error fetching access token from database: ${err}`)
            res.status(500).send(`Error fetching access token from database: ${err}`)
        });
};

// GET /foliomon/getRefreshToken
// get the Refresh Token from the db
exports.getRefreshToken = function(req, res) {
    RefreshToken.findOne().exec()
        .then(function(foundToken) {
            if (foundToken) {
                console.log(`Found refresh token: ${foundToken}`)
                res.status(200).send(`Found refresh token: ${foundToken}`)
            } else {
                console.log('No refresh token found in database.')
                res.status(404).send('No refresh token found in database.')
            }
        })
        .catch(function(err) {
            console.log(`Error fetching refresh token from database: ${err}`)
            res.status(500).send(`Error fetching refresh token from database: ${err}`)
        });
};

// PUT /foliomon/saveAccessToken
// Save the access token UPSERT
exports.saveAccessToken = function(req, res) {
    try {
        if (!req.body.access_token) {
            console.log('authController.saveAccessToken Error invalid access_token in request body.');
            res.status(400).send('Error invalid access_token in request body.');
        }

        if (!req.body.token_type) {
            console.log('authController.saveAccessToken Error invalid token_type in request body.');
            res.status(400).send('Error invalid token_type in request body.');
        }

        if (!req.body.expires_in) {
            console.log('authController.saveAccessToken Error invalid expires_in in request body.');
            res.status(400).send('Error invalid expires_in in request body.');
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
                res.status(200).send(`Saved access token: ${savedToken}`)
            })
            .catch(function(err) {
                console.log(`Unable to save access token to database: ${err}`)
                res.status(500).send(`Unable to save access token to database: ${err}`)
            });

    } catch (err) {
        console.log(`Error in authController.saveAccessToken ${err}`);
        res.status(500).send(`Unable to save access token to database: ${err}`);
    }
};

// PUT /foliomon/saveRefreshToken
// Save the refresh token UPSERT
exports.saveRefreshToken = function(req, res) {
    try {
        var grantedDate = new Date(); // date time now it was just granted

        if (!req.body.refresh_token) {
            console.log('authController.saveAccessToken Error invalid refresh_token in request body.');
            res.status(400).send('Error invalid refresh_token in request body.');
        }

        if (!req.body.token_type) {
            console.log('authController.saveAccessToken Error invalid token_type in request body.');
            res.status(400).send('Error invalid token_type in request body.');
        }

        if (!req.body.refresh_token_expires_in) {
            console.log('authController.saveAccessToken Error invalid refresh_token_expires_in in request body.');
            res.status(400).send('Error invalid refresh_token_expires_in in request body.');
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
                res.status(200).send(`Saved refresh token: ${savedToken}`)
            })
            .catch(function(err) {
                console.log(`Unable to save refresh token to database: ${err}`)
                res.status(500).send(`Unable to save refresh token to database: ${err}`)
            });

    } catch (err) {
        console.log(`Error in authController.saveRefreshToken ${err}`);
        res.status(500).send(`Unable to save refresh token to database: ${err}`);
    }
};

// GET /foliomon
// Authorize the foliomon app to use the TD account

// See the Authentication API's Post Access Token method for more information
// https://developer.tdameritrade.com/authentication/apis/post/token-0

// 
// https://developer.tdameritrade.com/content/simple-auth-local-apps

exports.authorize = function(req, res) {
    try {
        console.log('authController.authorize begin');

        var tokenType = null;
        var accessToken = null;
        var accessTokenExpiresIn = null;
        var refreshToken = null;
        var refreshTokenExpiresIn = null;

        var options = {
            method: 'POST',
            url: config.auth.tokenUrl,
            headers: {
                /* 'Content-Type': 'application/x-www-form-urlencoded' */ // Is set automatically
            },
            // POST Body params
            form: {
                'grant_type': 'authorization_code', // The grant type of the oAuth scheme. Possible values are authorization_code, refresh_token 
                //'refresh_token': refreshToken, // Required only if using refresh token grant 
                'access_type': 'offline', // Set to offline to receive a refresh token 
                'code': req.query.code, // Required if trying to use authorization code grant 
                'client_id': config.auth.clientId, // OAuth User ID of the application 
                'redirect_uri': config.auth.redirectUrl // Required if trying to use authorization code grant 
            }
        };

        // do Post Access Token request to TD
        request(options)
            .then(function(body) { // reply body parsed with implied status code 200 from TD
                // see Post Access Token response summary
                console.log(`authController.authorize Post Access Token response body: ${body}`);

                if (!body.token_type) {
                    console.log('authController.authorize Error invalid token_type in response body.');
                    res.status(400).send('Error invalid token_type in response body.');
                }

                if (!body.access_token) {
                    console.log('authController.authorize Error invalid access_token in response body.');
                    res.status(400).send('Error invalid access_token in response body.');
                }

                if (!body.expires_in) {
                    console.log('authController.authorize Error invalid expires_in in response body.');
                    res.status(400).send('Error invalid expires_in in response body.');
                }

                if (!body.refresh_token) {
                    console.log('authController.authorize Error invalid refresh_token in response body.');
                    res.status(400).send('Error invalid refresh_token in response body.');
                }

                if (!body.refresh_token_expires_in) {
                    console.log('authController.authorize Error invalid refresh_token_expires_in in response body.');
                    res.status(400).send('Error invalid refresh_token_expires_in in response body.');
                }

                tokenType = body.token_type; // "Bearer";
                console.log(`authController.authorize Post Access Token response tokenType: ${tokenType}`);

                accessToken = body.access_token;
                console.log(`authController.authorize Post Access Token response accessToken: ${accessToken}`);

                accessTokenExpiresIn = body.expires_in; // 1800;
                console.log(`authController.authorize Post Access Token response accessTokenExpiresIn: ${accessTokenExpiresIn}`);

                refreshToken = body.refresh_token;
                console.log(`authController.authorize Post Access Token response refreshToken: ${refreshToken}`);

                refreshTokenExpiresIn = body.refresh_token_expires_in; // 7776000;
                console.log(`authController.authorize Post Access Token response refreshTokenExpiresIn: ${refreshTokenExpiresIn}`);

                var grantedDate = new Date(); // date time now it was just granted
                var accessTokenExpirationDate = new Date();
                accessTokenExpirationDate.setTime(grantedDate.getTime() + (accessTokenExpiresIn * 1000));

                var refreshTokenExpirationDate = new Date();
                refreshTokenExpirationDate.setTime(grantedDate.getTime() + (refreshTokenExpiresIn * 1000));

                var conditions = {}; // no filter just replace first one found

                let accessTokenUpdate = {
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

                AccessToken.findOneAndUpdate(conditions, accessTokenUpdate, options).exec()
                    .then(function(savedAccessToken) {
                        console.log(`authController.authorize Saved access token: ${savedAccessToken}`)
                            //res.status(200).send(`Saved access token: ${savedToken}`)
                    })
                    .catch(function(err) {
                        console.log(`Error: unable to save access token to database: ${err}`)
                        res.status(500).send(`Error: Unable to save access token to database: ${err}`)
                    });

                var refreshTokenUpdate = {
                    tokenType: tokenType, // "Bearer"
                    refreshToken: refreshToken,
                    refreshTokenExpiresInSeconds: expiresInSeconds, // seconds to expire from now
                    refreshTokenGrantedDate: grantedDate, // date time refresh token was granted
                    refreshTokenExpirationDate: expirationDate // date time refresh token will expire (granted_date + expires_in)
                };

                RefreshToken.findOneAndUpdate(conditions, refreshTokenUpdate, options).exec()
                    .then(function(savedRefreshToken) {
                        console.log(`authController.authorize Saved refresh token: ${savedRefreshToken}`)
                            //res.status(200).send(`Saved refresh token: ${savedRefreshToken}`)
                    })
                    .catch(function(err) {
                        console.log(`Error in authController.authorize Unable to save refresh token to database: ${err}`)
                        res.status(500).send(`Error: Unable to save refresh token to database: ${err}`)
                    });

                res.status(200).send(`Received access token expires: ${accessTokenExpirationDate} refresh token expires: ${refreshTokenExpirationDate}`)
            })
            .catch(function(err) { // response status code other than OK 200
                console.log(`Error in authController.authorize error received from Post Access Token request: ${err}`)
                res.status(500).send(`Error response received from Post Access Token request: ${err}`)
            });

        console.log('authController.authorize end');
    } catch (err) {
        console.log(`Error in authController.authorize: ${err}`);
        res.status(500).send(`Internal Server Error during Post Access Token request ${err}`);
    }
}