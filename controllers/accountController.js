const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const AccountService = require('../services/AccountService');

const controller = {
        
    // Get all accounts of all of the user's linked accounts from TD API
    // Delete all accounts in the database
    // Save accounts from TD into the database and send them back on the response to the client
    resetAccounts: async (req, res) => {
        try {
            const accounts = await AccountService.api.getAccounts();
            const dbResult = await AccountService.db.resetAccounts(accounts);
            res.status(200).send(accounts);
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

    // Same as resetAccounts but for use during internal web server bootloading only.
    initializeAccounts: async () => {
        try {
            const accounts = await AccountService.api.getAccounts();
            const dbResult = await AccountService.db.resetAccounts(accounts);
        } catch (err) {
            var error = err.message;
            if (err instanceof UnauthorizedError) {
                error = `Invalid Access Token: ${err.message}`;
            } else if (err instanceof InternalServerError) {
                error = `Internal Server Error: ${err.message}`;
            } else if (err instanceof ServiceUnavailableError) {
                error = `Service Unavailable: ${err.message}`;
            }
            console.log({error});
        }
    },    

    // GET /foliomon/accounts
    // Get all accounts for all of the user's linked accounts from the TD API
    getAccounts: async (req, res) => {
        try {
            const accounts = await AccountService.api.getAccounts();
            res.status(200).send(accounts);
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

    // GET /foliomon/accounts/:accountId
    // Get specific account
    getAccount: async (req, res) => {
        let accountId = req.params.accountId;
        try {
            const account = await AccountService.api.getAccount(accountId);
            res.status(200).send(account);
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
                error = `Account not found.`;
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
 
    // GET /foliomon/accounts/:accountId/positions
    // Get the positions of one account
    getAccountPositions: async(req, res) => {
        let accountId = req.params.accountId;
        try {
            const positions = await AccountService.api.getAccountPositions(accountId);
            res.status(200).send(positions);
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

    // GET /foliomon/accounts/:accountId/orders
    // Get the orders of one account
    getAccountOrders: async (req, res) => {
        let accountId = req.params.accountId;
        try {
            const orders = await AccountService.api.getAccountOrders(accountId);
            res.status(200).send(orders);
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
    }

};
module.exports = controller;