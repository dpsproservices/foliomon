const config = require('../config/config.js');
const axios = require('axios');
const UserPrincipals = require('../models/user/UserPrincipals');
const TokenService = require('./TokenService');

/*=============================================================================
TD API User Info and Preferences endpoint wrappers service methods

https://developer.tdameritrade.com/user-principal/apis
=============================================================================*/

const api = {

    // Get User Principals details from TD API
    // https://developer.tdameritrade.com/user-principal/apis/get/userprincipals-0
    getUserPrincipals: async () => {
        try {
            const token = await TokenService.getAccessToken();
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
            const token = await TokenService.getAccessToken();
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
    }
};
module.exports.api = api;
module.exports.db = db;