const config = require('../config/config.js');
const axios = require('axios');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('./errors/ServiceErrors');
const Transaction = require('../models/Transaction');
const AuthService = require('./AuthService');
const moment = require('moment');

/*=============================================================================
TD API Transaction History endpoint wrappers service methods

https://developer.tdameritrade.com/transaction-history/apis
=============================================================================*/

const api = {

    // Get all Transactions for a specific account. 
    // https://developer.tdameritrade.com/transaction-history/apis/get/accounts/%7BaccountId%7D/transactions-0
    getAccountTransactions: async (accountId, months) => {
        try {
            const accessToken = await AuthService.db.getAccessToken();
            const numberOfMonths = months ? months : 12;
            var currentDate = moment();
            var endDate = currentDate.format('YYYY-MM-DD'); // today
            var startDate = currentDate.subtract(numberOfMonths, 'months').format('YYYY-MM-DD');
            // const validTypes = ['ALL','TRADE','BUY_ONLY','SELL_ONLY','CASH_IN_OR_CASH_OUT','CHECKING','DIVIDEND','INTEREST','OTHER','ADVISOR_FEES'];
            const params = {
                type: 'ALL', // UI will search through all transaction types
                //symbol: symbol,  // UI will search through all transaction symbols
                startDate, // yyyy-MM-dd. Date must be within 1 yaer from today's date.
                endDate   // yyyy-MM-dd
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}/transactions`, // Get Transactions for a specific account
                params: params,
                headers: { 'Authorization': `Bearer ${accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 400 || status === 401 || status === 403 || status === 503;
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

    // Get one Transaction for a specific account.
    // https://developer.tdameritrade.com/transaction-history/apis/get/accounts/%7BaccountId%7D/transactions/%7BtransactionId%7D-0
    getTransaction: async (accountId, transactionId) => {
        try {
            const accessToken = await AuthService.db.getAccessToken();
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}/transactions/${transactionId}`, // Get Transaction for a specific account
                headers: { 'Authorization': `Bearer ${accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 400 || status === 401 || status === 403 || status === 404 || status === 503;
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
    // Controller will Get all Transactions of all of the user's linked accounts from TD API
    // This reset function is intended to delete all transactions in the database
    // then save the lastest transactions from TD into the database 
    resetTransactions: async (transactions) => {
        try {
            let deleteManyResult = await Transaction.deleteMany();
            let createResult = await Transaction.create(transactions);
        } catch (err) {
            throw err;
        }
    },

    // Fetch all transactions of all accounts from the database
    getTransactions: async () => {
        try {
            const foundTransactions = await Transaction.find();

            if (foundTransactions && (foundTransactions.length > 0)) {
                return foundTransactions;
            } else {
                return [];
            }
        } catch (err) {
            throw new InternalServerError(`Error fetching all transactions from database: ${err.message}`);
        }
    },

    // Fetch transactions of one account from the database
    getAccountTransactions: async (accountId) => {
        let foundTransactions = null;
        try {
            if (!accountId) {
                throw new BadRequestError(`Error fetching transactions from database for account`);
            }
            try {
                foundTransactions = await Transaction.find({ accountId: accountId });
                if (foundTransactions && (foundTransactions.length > 0)) {
                    return foundTransactions;
                } else {
                    return []; // no transactions on account
                }
            } catch (err) {
                throw new InternalServerError(`Error fetching transactions from database for account and transactionId: ${err.message}`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Fetch specific transaction of one account from the database
    getTransaction: async (accountId, transactionId) => {
        let foundTransaction = null;
        try {
            if (accountId && transactionId) {
                try {
                    foundTransaction = await Transaction.findOne({ accountId: accountId, transactionId: transactionId });
                } catch (err) {
                    throw new InternalServerError(`Error fetching transaction from database for account and transactionId: ${err.message}`);
                }
                if (foundTransaction) {
                    return foundTransaction;
                } else {
                    throw new NotFoundError(`Error transaction Not Found in database for account and transactionId.`);
                }
            } else {
                throw new BadRequestError(`Error getting transaction from database for accountId and transactionId.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Create one transaction on one account in the database
    createTransaction: async (transaction) => {
        try {
            let result = null;
            return result = await Transaction.create(transaction);
        } catch (err) {
            if (err.name === 'ValidationError') {
                throw new BadRequestError(`Error creating transaction in database validation: ${err.message}`);
            } else {
                throw new InternalServerError(`Error creating transaction in database: ${err.message}`);
            }
        }
    },

    // Replace Specific transaction for a specific account
    replaceTransaction: async (accountId, transactionId, transaction) => {
        try {
            if (accountId && transactionId && transaction) {
                let filter = { accountId: accountId, transactionId: transactionId };
                let replacement = transaction;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await Transaction.replaceOne(filter, replacement, options);
                    // matched and replaced only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('Transaction for account with transactionId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error replacing transaction in database for accountId and transactionId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error replacing transaction in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error replacing transaction in database for accountId and transactionId.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Partially update transaction for a specific account in the database
    updateTransaction: async (accountId, transactionId, transaction) => {
        try {
            if (accountId && transactionId && transaction) {
                let filter = { accountId: accountId, transactionId: transactionId };
                let update = transaction;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await Transaction.updateOne(filter, update, options);
                    // matched and updated only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('Transaction for account with transactionId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error updatng transaction in database for accountId and transactionId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error updatng transaction in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error updatng transaction in database invalid accountId or transactionId or transaction object.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Delete all transactions from the database
    deleteTransactions: async () => {
        let result = null;
        try {
            result = await Transaction.deleteMany();
            return result;
        } catch (err) {
            throw new InternalServerError(`Error deleting all transactions from database: ${err.message}`);
        }
    },

    // Delete all transactions of a specific account from the database
    deleteAccountTransactions: async (accountId) => {
        let result = null;
        try {
            if (accountId) {
                try {
                    result = await Transaction.deleteMany({ accountId: accountId });
                    return result;
                } catch (err) {
                    throw new InternalServerError(`Error deleting account transactions from database: ${err.message}`);
                }
            } else {
                throw new BadRequestError(`Error deleting account transactions from database invalid accountId.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Delete transaction for a specific account from the database
    deleteTransaction: async (accountId, transactionId) => {
        try {
            if (accountId && transactionId) {
                let result = await Transaction.deleteOne({ accountId: accountId, transactionId: transactionId });
                if (result.n === 1 && result.nModified === 1) {
                    return result;
                } else {
                    throw new NotFoundError(`Error deleting transaction Not Found in database for accountId and transactionId.`);
                }
            } else {
                throw new BadRequestError(`Error deleting transaction from database invalid accountId or transactionId.`);
            }
        } catch (err) {
            throw err;
        }
    }

};
module.exports.api = api;
module.exports.db = db;