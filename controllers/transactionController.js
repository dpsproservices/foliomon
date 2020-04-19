const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const TransactionService = require('../services/TransactionService');

/*=============================================================================
Foliomon Transaction endpoints controller
=============================================================================*/

const controller = {

    // Get all transactions of all of the user's linked accounts from TD API
    // Delete all transactions in the database
    // Save transactions from TD into the database and send them back on the response to the client
    resetTransactions: async (req, res) => {
        try {
            const transactions = await TransactionService.api.getTransactions();
            const dbResult = await TransactionService.db.resetTransactions(transactions);
            res.status(200).send(transactions);
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof UnauthorizedError) {
                status = 401;
                error = `Invalid Access Token: ${err.message}`;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            } else if (err instanceof ServiceUnavailableError) {
                status = 503;
                error = `Service Unavailable: ${err.message}`;
            }
            res.status(status).send({ error: error });
        }
    },

    // Get Transactions for Single Account
    getAccountTransactions: async (req, res) => {
        let accountId = req.params.accountId;
        try {        
            const transactions = await TransactionService.api.getAccountTransactions(accountId);
            res.status(200).send(transactions);
        } catch (err) {
            var status = 500; // default
            var error = err.message;

            if (err instanceof UnauthorizedError) {
                status = 401;
                error = `Invalid Access Token: ${err.message}`;
            } else if (err instanceof ForbiddenError) {
                status = 403;
                error = `User does not have permission to access the specified account.`;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            } else if (err instanceof ServiceUnavailableError) {
                status = 503;
                error = `Service Unavailable: ${err.message}`;
            }
            res.status(status).send({ error: error });        
        }
    },

    // Get specific transaction for a specific account
    getTransaction: async (req, res) => {
        let accountId = req.params.accountId;
        let transactionId = req.params.transactionId;    
        try {
            const transaction = await TransactionService.api.getTransaction(accountId, transactionId);
            res.status(200).send(transaction);
        } catch (err) {
            var status = 500; // default
            var error = err.message;

            if (err instanceof BadRequestError) {
                status = 400;
                error = `Bad Request ${err.message}`;
            } else if (err instanceof UnauthorizedError) {
                status = 401;
                error = `Invalid Access Token: ${err.message}`;
            } else if (err instanceof ForbiddenError) {
                status = 403;
                error = `User does not have permission to access the specified account.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Transaction not found.`;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            } else if (err instanceof ServiceUnavailableError) {
                status = 503;
                error = `Service Unavailable: ${err.message}`;
            }
            res.status(status).send({ error: error });                
        }
    }

};
module.exports = controller;