const config = require('../config/config.js');
const axios = require('axios');
const Account = require('../models/securitiesAccount/Account');
const TokenService = require('./TokenService');

const getDbAccounts = function() {
    return Account.find().exec()
        .then(function(foundAccounts) {
            if (foundAccounts && (foundAccounts.length > 0)) {
                return foundAccounts;
            } else {
                console.log('Error in accountController.getAllAccounts No accounts found in database.')
                throw new Error('No accounts found in database.');
            }
        })
        .catch(function(err) {
            throw new Error('Error fetching all accounts from database.');
        });
};

const saveDbAccounts = function(accounts) {
    return Account.create(accounts)
        .then(function(result) {
            return result;
        })
        .catch(function(err) {
            throw new Error('Error saving all accounts to database.');
        });
};

const getApiAccounts = async () => {

    const token = await TokenService.getAccessToken();

    const options = {
        method: 'GET',
        url: `${config.auth.apiUrl}/accounts`,
        headers: { 'Authorization': `Bearer ${token.accessToken}` }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (err) {
        const message = response.message;
        console.log(`Error in getApiAccounts: ${message}`);
        throw new Error(`Error in getApiAccounts: ${message}`);
    }
}

exports.getDbAccounts = getDbAccounts;
exports.getApiAccounts = getApiAccounts;
exports.saveDbAccounts = saveDbAccounts;