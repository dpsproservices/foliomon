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
    getTransactions: async (accountId) => {
        try {
            const token = await AuthService.getAccessToken();
            var currentDate = moment();
            var todayDate = currentDate.format('YYYY-MM-DD');
            var oneYearAgo = currentDate.subtract(1, 'years').format('YYYY-MM-DD');
            // const validTypes = ['ALL','TRADE','BUY_ONLY','SELL_ONLY','CASH_IN_OR_CASH_OUT','CHECKING','DIVIDEND','INTEREST','OTHER','ADVISOR_FEES'];
            const params = {
                type: 'ALL', // UI will search through all transaction types
                //symbol: symbol,  // UI will search through all transaction symbols
                startDate: oneYearAgo, // yyyy-MM-dd. Date must be within 1 yaer from today's date.
                endDate: todayDate //, // yyyy-MM-dd
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}/transactions`, // Get Transactions for a specific account
                params: params,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
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
    getTransaction: async (accountId, transactionId) => {
        try {
            const token = await AuthService.getAccessToken();
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}/transactions/${transactionId}`, // Get Transaction for a specific account
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
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

};
module.exports.api = api;
module.exports.db = db;