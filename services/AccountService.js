const config = require('../config/config.js');
const axios = require('axios');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const Account = require('../models/securitiesAccount/Account');
const AuthService = require('./AuthService');

/*=============================================================================
TD API Accounts endpoint wrappers service methods

https://developer.tdameritrade.com/account-access/apis
=============================================================================*/

const api = {

    // Get all accounts for all of the user's linked accounts from the TD API
    // https://developer.tdameritrade.com/account-access/apis/get/accounts-0
    getAccounts: async () => {
        try {
            const accessToken = await AuthService.db.getAccessToken();
            const params = {
                fields: 'positions,orders' // Balances displayed by default
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts`, // Get Accounts
                params: params,
                headers: { 'Authorization': `Bearer ${accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 207 || status === 400 || status === 401 || status === 403 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const data = response.data;
            const message = response.data.error;
            /* 
                Status code 207 Indicates there was a problem getting account data for one or more linked accounts, 
                but the accounts who's data returned successfully is in the response. 
                Do not aggregate balances and positions for this case. 
            */
            if (status === 200 || status === 207) { 
                return data;
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

    // Get Account balances, positions, and orders for a specific account.
    // https://developer.tdameritrade.com/account-access/apis/get/accounts/%7BaccountId%7D-0
    getAccount: async (accountId) => {
        try {
            const accessToken = await AuthService.db.getAccessToken();
            const params = {
                fields: 'positions,orders' // Balances displayed by default
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}`, // Get Account
                params: params,
                headers: { 'Authorization': `Bearer ${accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 207 || status === 400 || status === 401 || status === 403 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const data = response.data;
            const message = response.data.error;
            /* 
                Status code 207 Indicates there was a problem getting account data for one or more linked accounts, 
                but the accounts who's data returned successfully is in the response. 
                Do not aggregate balances and positions for this case. 
            */
            if (status === 200 || status === 207) {
                return data;
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

    // Get Account positions for a specific account.
    // https://developer.tdameritrade.com/account-access/apis/get/accounts/%7BaccountId%7D-0
    getAccountPositions: async (accountId) => {
        try {
            const accessToken = await AuthService.db.getAccessToken();
            const params = {
                fields: 'positions' // Balances displayed by default
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}`, // Get Account
                params: params,
                headers: { 'Authorization': `Bearer ${accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 207 || status === 400 || status === 401 || status === 403 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const data = response.data;
            const message = response.data.error;
            /* 
                Status code 207 Indicates there was a problem getting account data for one or more linked accounts, 
                but the accounts who's data returned successfully is in the response. 
                Do not aggregate balances and positions for this case. 
            */
            if (status === 200 || status === 207) {
                return data;
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

    // Get Account orders for a specific account.
    // https://developer.tdameritrade.com/account-access/apis/get/accounts/%7BaccountId%7D-0
    getAccountOrders: async (accountId) => {
        try {
            const accessToken = await AuthService.db.getAccessToken();
            const params = {
                fields: 'orders' // Balances displayed by default
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}`, // Get Account
                params: params,
                headers: { 'Authorization': `Bearer ${accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 207 || status === 400 || status === 401 || status === 403 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const data = response.data;
            const message = response.data.error;
            /* 
                Status code 207 Indicates there was a problem getting account data for one or more linked accounts, 
                but the accounts who's data returned successfully is in the response. 
                Do not aggregate balances and positions for this case. 
            */
            if (status === 200 || status === 207) {
                return data;
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

const db = {

    // Controller will Get all accounts of all of the user's linked accounts from TD API
    // This reset function is intended to delete all accounts in the database
    // then save the lastest accounts data from TD into the database 
    resetAccounts: async (accounts) => {
        try {
            let deleteManyResult = await Account.deleteMany();
            let createResult = await Account.create(accounts);
        } catch (err) {
            throw err;
        }
    },

    // Get all accounts from the database
    getAccounts: async () => {
        try {
            const foundAccounts = await Account.find();

            if (foundAccounts && (foundAccounts.length > 0)) {
                return foundAccounts;
            } else {
                return [];
            }
        } catch (err) {
            throw new InternalServerError(`Error fetching all accounts from database: ${err.message}`);
        }
    },
    
    // Get one account by accountId from the database
    getAccount: async (accountId) => {
        let foundAccount = null;
        try {
            if (accountId ) {
                try {
                    foundAccount = await Account.findOne({ accountId: accountId });
                } catch (err) {
                    throw new InternalServerError(`Error fetching account from database for accountId: ${err.message}`);
                }
                if (foundAccount) {
                    return foundAccount;
                } else {
                    throw new NotFoundError(`Error account Not Found in database for accountId.`);
                }
            } else {
                throw new BadRequestError(`Error getting account from database for accountId.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Create one or more accounts in the database
    createAccounts: async (accounts) => {
        try {
            // Accounts may be in nested format.
            let formattedAccounts = accounts;
            if (accounts && accounts[0] && accounts[0].securitiesAccount) {
                formattedAccounts = accounts.map(a => a.securitiesAccount);
            }
            let result = null;
            return result = await Account.create(formattedAccounts);
        } catch(err) {
            if (err.name === 'ValidationError') {
                throw new BadRequestError(`Error creating account(s) in database validation: ${err.message}`);
            } else {
                throw new InternalServerError(`Error creating account(s) in database: ${err.message}`);
            }
        }
    },    

    // Replace one account in the database
    replaceAccount: async (accountId, account) => {
        try {
            if (accountId && account && (account.accountId === accountId) ) {
                let filter = { accountId: accountId };
                let replacement = account;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await Account.replaceOne(filter, replacement, options);
                    // matched and replaced only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('Error updating account with accountId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error replacing account in database for accountId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error replacing account in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error replacing account in database for accountId.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Update one account in the database
    updateAccount: async (accountId, account) => {
        try {
            if (accountId && account && (account.accountId === accountId) ) {
                let filter = { accountId: accountId };
                let update = account;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await Account.updateOne(filter, update, options);
                    // matched and updated only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('Error updatng account with accountId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error updatng account in database for accountId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error updatng account in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error updatng order in database invalid accountId or account object.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Delete all accounts from the database
    deleteAccounts: async () => {
        let result = null;
        try {
            result = await Account.deleteMany();
            return result;
        } catch (err) {
            throw new InternalServerError(`Error deleting all accounts from database: ${err.message}`);
        }
    },

    // Delete one account from the database
    deleteAccount: async (accountId) => {
        try {
            if (accountId) {
                let result = await Account.deleteOne({ accountId: accountId });
                if (result.n === 1 && result.nModified === 1) {
                    return result;
                } else {
                    throw new NotFoundError(`Error deleting account Not Found in database for accountId.`);
                }
            } else {
                throw new BadRequestError(`Error deleting account from database invalid accountId.`);
            }
        } catch (err) {
            throw err;
        }

    }

};
module.exports.api = api;
module.exports.db = db;