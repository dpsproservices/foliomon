const config = require('../config/config.js');
const axios = require('axios');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('./errors/ServiceErrors');
const UserPrincipal = require('../models/user/UserPrincipal');
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
            const accessToken = await AuthService.db.getAccessToken();
            const params = {
                fields: 'streamerSubscriptionKeys,streamerConnectionInfo,preferences,surrogateIds'
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/userprincipals`,
                params: params,
                headers: { 'Authorization': `Bearer ${accessToken}` },
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
            const accessToken = await AuthService.db.getAccessToken();
            const params = {
                accountIds: accountIds // comma separated string of account IDs, to fetch subscription keys for each of them
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/userprincipals/streamersubscriptionkeys`,
                params: params,
                headers: { 'Authorization': `Bearer ${accessToken}` },
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
            const foundUserPrincipals = await UserPrincipal.find();
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

    // Create one userPrincipal on one account in the database
    createUserPrincipal: async (userPrincipal) => {
        try {
            let result = null;
            return result = await UserPrincipal.create(userPrincipal);
        } catch (err) {
            if (err.name === 'ValidationError') {
                throw new BadRequestError(`Error creating userPrincipal in database validation: ${err.message}`);
            } else {
                throw new InternalServerError(`Error creating userPrincipal in database: ${err.message}`);
            }
        }
    },

    // Replace Specific userPrincipal for a specific userId in the database
    replaceUserPrincipal: async (userId, userPrincipal) => {
        try {
            if (userId && userPrincipal && (userPrincipal.userId === userId) ) {
                let filter = { userId: userId };
                let replacement = userPrincipal;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await UserPrincipal.replaceOne(filter, replacement, options);
                    // matched and replaced only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('UserPrincipal with userId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error replacing userPrincipal in database for userId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error replacing userPrincipal in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error replacing userPrincipal in database invalid userId or UserPrincipal object.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Partially update userPrincipal for a specific account in the database
    updateUserPrincipal: async (userId, userPrincipal) => {
        try {
            if (userId && userPrincipal && (userPrincipal.userId === userId) ) {
                let filter = { userId: userId };
                let update = userPrincipal;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await UserPrincipal.updateOne(filter, update, options);
                    // matched and updated only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('UserPrincipal with userId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error updatng userPrincipal in database for userId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error updatng userPrincipal in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error updatng userPrincipal in database invalid userId or userPrincipal object.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Delete all userPrincipals from the database
    deleteUserPrincipals: async () => {
        let result = null;
        try {
            result = await UserPrincipal.deleteMany();
            return result;
        } catch (err) {
            throw new InternalServerError(`Error deleting all userPrincipals from database: ${err.message}`);
        }
    },

    // Delete order for a specific userId from the database
    deleteUserPrincipal: async (userId) => {
        try {
            if (userId) {
                let result = await UserPrincipal.deleteOne({ userId: userId });
                if (result.n === 1 && result.nModified === 1) {
                    return result;
                } else {
                    throw new NotFoundError(`Error deleting UserPrincipal Not Found in database for userId.`);
                }
            } else {
                throw new BadRequestError(`Error deleting UserPrincipal from database invalid userId.`);
            }
        } catch (err) {
            throw err;
        }
    }    

};
module.exports.api = api;
module.exports.db = db;