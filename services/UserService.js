const config = require('../config/config.js');
const axios = require('axios');
const UserPrincipals = require('../models/user/UserPrincipals');
const TokenService = require('./TokenService');

const getDbUserPrincipals = function() {
    return UserPrincipals.find().exec()
        .then(function(foundUserPrincipals) {
            if (foundUserPrincipals && (foundUserPrincipals.length > 0)) {
                return foundUserPrincipals;
            } else {
                console.log('Error in getDbUserPrincipals No user found in database.')
                throw new Error('No user found in database.');
            }
        })
        .catch(function(err) {
            throw new Error('Error fetching user from database.');
        });
};

const getApiUserPrincipals = async () => {
    const token = await TokenService.getAccessToken();

    const params = {
        fields: 'streamerSubscriptionKeys,streamerConnectionInfo,preferences,surrogateIds'
    };

    const options = {
        method: 'GET',
        url: `${config.auth.apiUrl}/userprincipals`,
        params: params,          
        headers: { 'Authorization': `Bearer ${token.accessToken}` }      
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (err) {
        const message = response.message;
        console.log(`Error in getApiUserPrincipals: ${message}`);
        throw new Error(`Error in getApiUserPrincipals: ${message}`);
    }
};

exports.getDbUserPrincipals = getDbUserPrincipals;
exports.getApiUserPrincipals = getApiUserPrincipals;