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
    // Accounts may be in nested format.
    let formattedAccounts = accounts;
    if (accounts && accounts[0] && accounts[0].securitiesAccount) {
        formattedAccounts = accounts.map(a => a.securitiesAccount);
    }
    return Account.create(formattedAccounts)
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

const getApiAccountPositions = async (accountId) => {

    const token = await TokenService.getAccessToken();

    const options = {
        method: 'GET',
        url: `${config.auth.apiUrl}/accounts/${accountId}`,
        headers: { 'Authorization': `Bearer ${token.accessToken}` },
        params: { fields: 'positions' }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (err) {
        const message = response.message;
        console.log(`Error in getApiAccountPositions: ${message}`);
        throw new Error(`Error in getApiAccountPositions: ${message}`);
    }
}

const getApiAccountOrders = async (accountId) => {

    const token = await TokenService.getAccessToken();

    const options = {
        method: 'GET',
        url: `${config.auth.apiUrl}/accounts/${accountId}`,
        headers: { 'Authorization': `Bearer ${token.accessToken}` },
        params: { fields: 'orders' }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (err) {
        const message = response.message;
        console.log(`Error in getApiAccountOrders: ${message}`);
        throw new Error(`Error in getApiAccountOrders: ${message}`);
    }
}

exports.getDbAccounts = getDbAccounts;
exports.getApiAccounts = getApiAccounts;
exports.saveDbAccounts = saveDbAccounts;
exports.getApiAccountPositions = getApiAccountPositions;
exports.getApiAccountOrders = getApiAccountOrders;