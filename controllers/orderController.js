const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const OrderService = require('../services/OrderService');

/*=============================================================================
Foliomon Orders endpoints controller
=============================================================================*/

controller = {
    
    // Get all orders of all of the user's linked accounts from TD API
    // Delete all orders in the database
    // Save orders from TD into the database and send them back on the response to the client
    resetOrders: async (req, res) => {
        try {
            const orders = await OrderService.api.getOrders();
            const dbResult = await OrderService.db.resetOrders(orders);
            res.status(200).send(orders);
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

    // Get Orders for Multiple Accounts
    // Get all orders for all of the user's linked accounts from the TD API
    getOrders: async (req, res) => {
        try {
            const orders = await OrderService.api.getOrders();
            res.status(200).send(orders);
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

    // Get Orders for Single Account
    getAccountOrders: async (req, res) => {
        let accountId = req.params.accountId;
        try {
            const orders = await OrderService.api.getAccountOrders(accountId);
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
    },

    // Get specific order for a specific account
    getOrder: async (req, res) => {
        let accountId = req.params.accountId;
        let orderId = req.params.orderId;
        try {
            const order = await OrderService.api.getOrder(accountId, orderId);
            res.status(200).send(order);
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
                error = `Order id ${orderId} not found.`;
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

    // Place a new order in a specific account
    placeOrder: async (req, res) => {
        let accountId = req.params.accountId;
        let order = req.body;
        let orderId = order.orderId; // unique order id on account
        try {
            // Request TD API to place the new order on the account
            // The service will throw an error on any other status code besides 201 Created
            const response = await OrderService.api.placeOrder(accountId, order);
            // After the order was successfully created at TD        
            // Request TD API to get the orders on the account
            const orders = await OrderService.api.getAccountOrders(accountId);
            // Match the id of the newly created order
            let foundMatch = false;
            for (let i = 0; i < orders.length; i++) {
                let orderFromAPI = orders[i];
                if (orderId === orderFromAPI.orderId) {
                    foundMatch = true;
                    order = orderFromAPI;
                    break;
                }
            }
            if (foundMatch) {
                // Create the matched order from TD API into the database
                const dbResult = await OrderService.db.createOrder(order);
                res.status(200).send(order);
            } else {
                throw new InternalServerError(`No order created on account at TD with matching orderId.`);
            }
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

    // Replace an existing order in a specific account
    replaceOrder: async (req, res) => {
        let accountId = req.params.accountId;
        let orderId = req.params.orderId;
        let order = req.body;
        try {
            // Request TD API to replace the order on the account
            // Note that sending accountId and sequenceId(s) in the order object will receive and throw a Bad Request
            // The service will throw an error on any other status code besides 204 No Content
            const response = await OrderService.api.replaceOrder(accountId, orderId, order);
            // After the order was successfully replaced at TD
            // Request TD API to get the orders on the account
            const orders = await OrderService.api.getAccountOrders(accountId);
            // Match the id of the newly created order
            let foundMatch = false;
            for (let i = 0; i < orders.length; i++) {
                let orderFromAPI = orders[i];
                if (orderId === orderFromAPI.orderId) {
                    foundMatch = true;
                    order = orderFromAPI;
                    break;
                }
            }
            if (foundMatch) {
                // Replace the matched order from TD API into the database
                const dbResult = await OrderService.db.replaceOrder(accountId, orderId, order);
                res.status(200).send(order);
            } else {
                throw new InternalServerError(`No order replaced on account at TD with matching orderId.`);
            }
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
                error = `Order id ${orderId} not found.`;
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

    // Delete specific order of a specific account
    deleteOrder: async (req, res) => {
        let accountId = req.params.accountId;
        let orderId = req.params.orderId;
        try {
            const response = await OrderService.api.deleteOrder(accountId, orderId);
            const dbResult = await OrderService.db.deleteOrder(accountId, orderId);
            res.status(204).send();
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
                error = `Order id ${orderId} not found.`;
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

    initializeOrdersData: async () => {

        var isOrdersDataAvailable = false;
        var orders = null;

        // Verify the orders are stored otherwise get them and store them
        try {
            orders = await OrderService.db.getOrders();
            isOrdersDataAvailable = true;
        } catch (err) {
            isOrdersDataAvailable = false;
        }

        if (!isOrdersDataAvailable) {
            console.log('initializeOrdersData No orders data available. Getting from TD...');

            try {
                const orders = await OrderService.api.getOrders();
                const dbResult = await OrderService.db.resetOrders(orders);
            } catch (err) {
                console.log(`Error in initializeOrdersData ${err}`);
            }

        }
    }
    
};
module.exports = controller;