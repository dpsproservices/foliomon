const config = require('../config/config.js');
const axios = require('axios');
const UserPrincipals = require('../models/user/UserPrincipals');
const AuthService = require('./AuthService');

/*=============================================================================
TD API User Info and Preferences endpoint wrappers service methods

https://developer.tdameritrade.com/user-principal/apis
=============================================================================*/

const api = {

    // Get User Principals details from TD API
    // https://developer.tdameritrade.com/user-principal/apis/get/userprincipals-0
    getUserPrincipals: async () => {
        try {
            const token = await AuthService.getAccessToken();
            const params = {
                fields: 'streamerSubscriptionKeys,streamerConnectionInfo,preferences,surrogateIds'
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/userprincipals`,
                params: params,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 400 || status === 401 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const data = response.data;
            const message = response.data.error;
            if (status === 200) {
                return data;
            } else if (status === 400) {
                throw new BadRequestError(message);
            } else if (status === 401) {
                throw new UnauthorizedError(message);
            } else if (status === 503) {
                throw new ServiceUnavailableError(message);
            } else {
                throw new InternalServerError(message);
            }
        } catch(err) {
            throw err;
        } 
    },

    // Get Streamer Subscription Keys
    // https://developer.tdameritrade.com/user-principal/apis/get/userprincipals/streamersubscriptionkeys-0
    getStreamerSubscriptionKeys: async (accountIds) => {
        try {
            const token = await AuthService.getAccessToken();
            const params = {
                accountIds: accountIds // comma separated string of account IDs, to fetch subscription keys for each of them
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/userprincipals/streamersubscriptionkeys`,
                params: params,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 400 || status === 401 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const data = response.data;
            const message = response.data.error;
            if (status === 200) {
                return data;
            } else if (status === 400) {
                throw new BadRequestError(message);
            } else if (status === 401) {
                throw new UnauthorizedError(message);
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
User Info and Preferences database service methods
=============================================================================*/

const db = {

    // Get User Principals details from database
    getUserPrincipals: async () => {
        try {
            const foundUserPrincipals = await UserPrincipals.find();
            if (foundUserPrincipals) {
                return foundUserPrincipals;
            } else {
                throw new NotFoundError(`Error user principals Not Found in database.`);
            }
        } catch (err) {
            if(err.name === 'NotFoundError') {
                throw err;
            } else {
                throw new InternalServerError(`Error fetching user principals from database: ${err.message}`);
            }
        }
    },

    // Create one userPrincipals on one account in the database
    createUserPrincipals: async (userPrincipals) => {
        try {
            let result = null;
            return result = await UserPrincipals.create(userPrincipals);
        } catch (err) {
            if (err.name === 'ValidationError') {
                throw new BadRequestError(`Error creating userPrincipals in database validation: ${err.message}`);
            } else {
                throw new InternalServerError(`Error creating userPrincipals in database: ${err.message}`);
            }
        }
    },

    // Replace Specific userPrincipals for a specific account in the database
    // does not verify that the symbol or asset type are valid.
    replaceUserPrincipals: async (accountId, userPrincipalsId, userPrincipals) => {
        try {
            if (accountId && userPrincipalsId && userPrincipals) {
                let filter = { accountId: accountId, userPrincipalsId: userPrincipalsId };
                let replacement = userPrincipals;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await UserPrincipals.replaceOne(filter, replacement, options);
                    // matched and replaced only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('UserPrincipals for account with userPrincipalsId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error replacing userPrincipals in database for accountId and userPrincipalsId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error replacing userPrincipals in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error replacing userPrincipals in database for accountId and userPrincipalsId.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Partially update userPrincipals for a specific account in the database
    updateUserPrincipals: async (accountId, userPrincipalsId, userPrincipals) => {
        try {
            if (accountId && userPrincipalsId && userPrincipals) {
                let filter = { accountId: accountId, userPrincipalsId: userPrincipalsId };
                let update = userPrincipals;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await UserPrincipals.updateOne(filter, update, options);
                    // matched and updated only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('UserPrincipals for account with userPrincipalsId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error updatng userPrincipals in database for accountId and userPrincipalsId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error updatng userPrincipals in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error updatng userPrincipals in database invalid accountId or userPrincipalsId or userPrincipals object.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Delete all userPrincipals from the database
    deleteUserPrincipals: async () => {
        let result = null;
        try {
            result = await UserPrincipals.deleteMany();
            return result;
        } catch (err) {
            throw new InternalServerError(`Error deleting all userPrincipals from database: ${err.message}`);
        }
    }

};
module.exports.api = api;
module.exports.db = db;