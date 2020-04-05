const config = require('../config/config.js');
const axios = require('axios');
const qs = require('querystring')
const AccessToken = require('../models/auth/AccessToken');
const RefreshToken = require('../models/auth/RefreshToken');

const getAccessToken = function () {
    return AccessToken.findOne().exec()
        .then(function (foundToken) {
            if (foundToken) {
                return foundToken;
            } else {
                throw new Error('No access token found in database.');
            }
        })
        .catch(function (err) {
            throw new Error(`Error fetching access token from database: ${err}`);
        });
};

const getRefreshToken = function () {
    return RefreshToken.findOne().exec()
        .then(function (foundToken) {
            if (foundToken) {
                return foundToken;
            } else {
                throw new Error('No refresh token found in database.');
            }
        })
        .catch(function (err) {
            throw new Error(`Error fetching refresh token from database: ${err}`);
        });
};

const reauthorize = async function () {
    var tokenType = null;
    var accessToken = null;
    var accessTokenExpiresIn = null;
    var refreshToken = null;
    var refreshTokenExpiresIn = null;

    try {
        refreshToken = await getRefreshToken();

        if (!refreshToken) {
            throw new Error('No valid refresh token found in database.');
        }
    } catch(err) {
        console.log(`Error fetching access token from database: ${err}`)
        throw new Error('Error fetching refresh token from database.');
    }

    var options = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    };
    var url = `${config.auth.apiUrl}/oauth2/token`;
    var body = {
        'grant_type': 'refresh_token', // The grant type of the oAuth scheme. Possible values are authorization_code, refresh_token 
        'refresh_token': refreshToken.refreshToken, // Required only if using refresh token grant 
        'access_type': 'offline', // Set to offline to also receive a refresh token 
        'client_id': config.auth.clientId // OAuth User ID of the application 
    };

    // do Post Access Token request to TD
    return axios.post(url, qs.stringify(body), options)
    .then(async function(response) { // reply body parsed with implied status code 200 from TD
        // see Post Access Token response summary
        //var authReply = JSON.parse(body);
        const authReply = response.data;

        if (!authReply.token_type) {
            console.log('reauthorize Error invalid token_type in response body.');
            throw new Error('Error invalid token_type in response body.');
        }

        if (!authReply.access_token) {
            console.log('reauthorize Error invalid access_token in response body.');
            throw new Error('Error invalid access_token in response body.');
        }

        if (!authReply.expires_in) {
            console.log('reauthorize Error invalid expires_in in response body.');
            throw new Error('Error invalid expires_in in response body.' );
        }

        if (!authReply.refresh_token) {
            console.log('reauthorize Error invalid refresh_token in response body.');
            throw new Error('Error invalid refresh_token in response body.' );
        }

        if (!authReply.refresh_token_expires_in) {
            console.log('reauthorize Error invalid refresh_token_expires_in in response body.');
            throw new Error('Error invalid refresh_token_expires_in in response body.' );
        }

        tokenType = authReply.token_type; // "Bearer";
        accessToken = authReply.access_token;
        accessTokenExpiresIn = authReply.expires_in; // 1800;
        refreshToken = authReply.refresh_token;
        refreshTokenExpiresIn = authReply.refresh_token_expires_in; // 7776000;

        var grantedDate = new Date(); // date time now it was just granted
        var accessTokenExpirationDate = new Date();
        accessTokenExpirationDate.setTime(grantedDate.getTime() + (accessTokenExpiresIn * 1000));

        var refreshTokenExpirationDate = new Date();
        refreshTokenExpirationDate.setTime(grantedDate.getTime() + (refreshTokenExpiresIn * 1000));

        var conditions = {}; // no filter just replace first one found

        let options = {
            new: true,
            upsert: true
        };

        var accessTokenUpdate = {
            tokenType: tokenType, // "Bearer"
            accessToken: accessToken,
            accessTokenExpiresInSeconds: accessTokenExpiresIn, // seconds to expire from now
            accessTokenGrantedDate: grantedDate, // date time access token was granted
            accessTokenExpirationDate: accessTokenExpirationDate // date time access token will expire (granted date + expires in)
        };

        var refreshTokenUpdate = {
            tokenType: tokenType, // "Bearer"
            refreshToken: refreshToken,
            refreshTokenExpiresInSeconds: refreshTokenExpiresIn, // seconds to expire from now
            refreshTokenGrantedDate: grantedDate, // date time refresh token was granted
            refreshTokenExpirationDate: refreshTokenExpirationDate // date time refresh token will expire (granted_date + expires_in)
        };

        try {
            const savedAccessToken = await AccessToken.findOneAndUpdate(conditions, accessTokenUpdate, options).exec();
            console.log(`reauthorize Saved access token: ${savedAccessToken}`)
        } catch(err) {
            console.log(`Error: in reauthorize unable to save access token to database: ${err}`);
            throw new Error('Unable to save access token.');
        }

        try {
            const savedRefreshToken = await RefreshToken.findOneAndUpdate(conditions, refreshTokenUpdate, options).exec();
            console.log(`reauthorize Saved refresh token: ${savedRefreshToken}`);
        } catch(err) {
            console.log(`Error in authController.reauthorize Unable to save refresh token to database: ${err}`)
            throw new Error('Unable to save refresh token.');
        }

        var responseObject = {
            tokenType: tokenType,
            accessToken: accessToken,
            accessTokenExpiresInSeconds: accessTokenExpiresIn,
            accessTokenGrantedDate: grantedDate,
            accessTokenExpirationDate: accessTokenExpirationDate,
            refreshToken: refreshToken,
            refreshTokenExpiresInSeconds: refreshTokenExpiresIn,
            refreshTokenGrantedDate: grantedDate,
            refreshTokenExpirationDate: refreshTokenExpirationDate
        };

        console.log(`Received. access token expires: ${accessTokenExpirationDate} refresh token expires: ${refreshTokenExpirationDate}`);
        return responseObject;
    })
    .catch(function(err) { // handle all response status code other than OK 200
        console.log(err.response);
        const message = err.response.message;
        console.log(`Error in reauthorize error received from Post Access Token request: ${message}`);
        throw new Error(`Error response received from Post Access Token request: ${message}`);
    });
};

exports.getAccessToken = getAccessToken;
exports.getRefreshToken = getRefreshToken;
exports.reauthorize = reauthorize;