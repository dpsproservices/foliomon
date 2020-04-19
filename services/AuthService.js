const config = require('../config/config.js');
const axios = require('axios');
const qs = require('querystring')
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('./errors/ServiceErrors');
const AuthToken = require('../models/AuthToken');

/*=============================================================================
TD API Authentication endpoint wrappers service methods

https://developer.tdameritrade.com/authentication/apis
=============================================================================*/

const api = {

    // Post Access Token
    // The token endpoint returns an access token along with an optional refresh token. 
    // https://developer.tdameritrade.com/authentication/apis/post/token-0
    // POST the auth code url query parameter after the TD API login page redirect
    postAuthCode: async (code) => {
        try {
            var options = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                validateStatus: function (status) {
                    return status === 200 || status === 201 || status === 400 || status === 401 || status === 403 || status === 503;
                }
            };
            var url = `${config.auth.apiUrl}/oauth2/token`;
            var body = {
                'grant_type': 'authorization_code', // The grant type of the oAuth scheme. Possible values are authorization_code, refresh_token 
                'access_type': 'offline', // Set to offline to also receive a refresh token 
                'code': code, // Required if trying to use authorization code grant 
                'client_id': config.auth.clientId, // OAuth User ID of the application 
                'redirect_uri': config.auth.redirectUrl // Required if trying to use authorization code grant
            };
            const response = await axios.post(url, qs.stringify(body), options);
            const status = response.status;
            const message = response.data.error;
            if (status === 200 || status === 201) {
                return response;
            } else if (status === 400) {
                throw new BadRequestError(message);
            } else if (status === 401) {
                throw new UnauthorizedError(message);
            } else if (status === 403) {
                throw new ForbiddenError(message);
            } else if (status === 503) {
                throw new ServiceUnavailableError(message);
            } else {
                throw new InternalServerError(message);
            }
        } catch (err) {
            throw err;
        }
    },

    // Post the refresh token to get a new access token and a new refresh token
    postRefreshToken: async (refreshToken) => {
        try {
            var options = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                validateStatus: function (status) {
                    return status === 200 || status === 201 || status === 400 || status === 401 || status === 403 || status === 503;
                }
            };
            var url = `${config.auth.apiUrl}/oauth2/token`;
            var body = {
                'grant_type': 'refresh_token', // The grant type of the oAuth scheme. Possible values are authorization_code, refresh_token 
                'refresh_token': refreshToken, // Required only if using refresh token grant 
                'access_type': 'offline', // Set to offline to also receive a refresh token 
                'client_id': config.auth.clientId // OAuth User ID of the application 
            };
            const response = await axios.post(url, qs.stringify(body), options);
            const status = response.status;
            const message = response.data.error;
            if (status === 200 || status === 201) {
                return response;
            } else if (status === 400) {
                throw new BadRequestError(message);
            } else if (status === 401) {
                throw new UnauthorizedError(message);
            } else if (status === 403) {
                throw new ForbiddenError(message);
            } else if (status === 503) {
                throw new ServiceUnavailableError(message);
            } else {
                throw new InternalServerError(message);
            }
        } catch (err) {
            throw err;
        }        
    }
    
};

/*=============================================================================
Auth database service methods
=============================================================================*/

db = {

    // Get the auth token from the database
    // throw a Not Found Error if none exists.
    getToken: async () => {
        let foundToken = null;
        try {
            try {
                foundToken = await AuthToken.findOne();
            } catch (err) {
                throw new InternalServerError(`Error fetching auth token from database: ${err.message}`);
            }
            if (foundToken) {
                return foundToken;
            } else {
                throw new NotFoundError(`Error auth token Not Found in database.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Get the access token from the database
    // throw a Not Found Error if none exists.
    getAccessToken: async () => {
        let foundToken = null;
        try {
            try {
                foundToken = await AuthToken.findOne();
            } catch (err) {
                throw new InternalServerError(`Error fetching access token from database: ${err.message}`);
            }
            if (foundToken.accessToken) {
                return foundToken.accessToken;
            } else {
                throw new NotFoundError(`Error access token Not Found in database.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Get the refresh token from the database
    // throw a Not Found Error if none exists.
    getRefreshToken: async () => {
        let foundToken = null;
        try {
            try {
                foundToken = await AuthToken.findOne();
            } catch (err) {
                throw new InternalServerError(`Error fetching refresh token from database: ${err.message}`);
            }
            if (foundToken.refreshToken) {
                return foundToken.refreshToken;
            } else {
                throw new NotFoundError(`Error refresh token Not Found in database.`);
            }
        } catch (err) {
            throw err;
        }
    },    

    // Update the auth token in the database
    // creates one if none exists (upsert)
    updateToken: async (authToken) => {
        try {
            if (authToken) {
                let filter = {};
                let update = authToken;
                let options = {
                    new: true,
                    upsert: true,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await AuthToken.updateOne(filter, update, options);
                    // matched and updated only 1 document
                    //if (result.n === 1 || result.nModified === 1) {
                        return result;
                    //} else {
                    //    throw new NotFoundError('Auth token Not Found in database.');
                    //}
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error updatng auth token in database: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error updatng auth token in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error updatng auth token in database invalid  or order object.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Delete auth token from the database
    // throw a Not Found Error if none exists.
    deleteToken: async () => {
        try {
            let result = await AuthToken.deleteOne();
            if (result.n === 1 && result.nModified === 1) {
                return result;
            } else {
                throw new NotFoundError(`Error deleting auth token Not Found in database.`);
            }
        } catch (err) {
            throw err;
        }
    }  

};
module.exports.api = api;
module.exports.db = db;