const config = require('../config/config.js');
const axios = require('axios');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('./errors/ServiceErrors');
const UserPrincipals = require('../models/user/UserPrincipals');
const AuthService = require('./AuthService');

/*=============================================================================
TD API User Info and Preferences endpoint wrappers service methods

https://developer.tdameritrade.com/user-principal/apis
=============================================================================*/

const api = {

    // Get User Principals details of currently authenticated user from TD API
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

    // Get Streamer Subscription Keys of currently authenticated user from TD API
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

    // Get all User Principals details of all users from the database
    getAllUserPrincipals: async () => {
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

    // Get User Principals details of one userId from the database
    getUserPrincipals: async (userId) => {
        try {
            const foundUserPrincipals = await UserPrincipals.findOne({ userId: userId });
            if (foundUserPrincipals) {
                return foundUserPrincipals;
            } else {
                throw new NotFoundError(`Error user principals Not Found in database.`);
            }
        } catch (err) {
            if (err.name === 'NotFoundError') {
                throw err;
            } else {
                throw new InternalServerError(`Error fetching user principals from database: ${err.message}`);
            }
        }
    },

    // Create userPrincipals for one user in the database
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

    // Replace userPrincipals for a specific userId in the database
    replaceUserPrincipals: async (userId, userPrincipals) => {
        try {
            if (userId && userPrincipals && (userPrincipals.userId === userId) ) {
                let filter = { userId: userId };
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
                        throw new NotFoundError('UserPrincipals with userId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error replacing userPrincipals in database for userId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error replacing userPrincipals in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error replacing userPrincipals in database invalid userId or UserPrincipals object.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Partially update userPrincipals of specific userId in the database
    updateUserPrincipals: async (userId, userPrincipals) => {
        try {
            if (userId && userPrincipals && (userPrincipals.userId === userId) ) {
                let filter = { userId: userId };
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
                        throw new NotFoundError('UserPrincipals with userId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error updatng userPrincipals in database for userId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error updatng userPrincipals in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error updatng userPrincipals in database invalid userId or userPrincipals object.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Delete all userPrincipals of all users from the database
    deleteAllUserPrincipals: async () => {
        let result = null;
        try {
            result = await UserPrincipals.deleteMany();
            return result;
        } catch (err) {
            throw new InternalServerError(`Error deleting all userPrincipals from database: ${err.message}`);
        }
    },

    // Delete userPrincipals for a specific userId from the database
    deleteUserPrincipals: async (userId) => {
        try {
            if (userId) {
                let result = await UserPrincipals.deleteOne({ userId: userId });
                if (result.n === 1 && result.nModified === 1) {
                    return result;
                } else {
                    throw new NotFoundError(`Error deleting UserPrincipals Not Found in database for userId.`);
                }
            } else {
                throw new BadRequestError(`Error deleting UserPrincipals from database invalid userId.`);
            }
        } catch (err) {
            throw err;
        }
    }    

};
module.exports.api = api;
module.exports.db = db;