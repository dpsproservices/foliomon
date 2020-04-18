const config = require('../config/config.js');
const axios = require('axios');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('./errors/ServiceErrors');
const Order = require('../models/Order');
const AuthService = require('./AuthService');
const moment = require('moment');

/*=============================================================================
TD API Orders endpoint wrappers service methods

https://developer.tdameritrade.com/account-access/apis
=============================================================================*/

const api = {

    // Get all orders for a specific account or, if account ID isn't specified, 
    // orders will be returned for all linked accounts from the TD API
    // https://developer.tdameritrade.com/account-access/apis/get/orders-0
    getOrders: async () => {
        try {
            const token = await AuthService.getAccessToken();
            var currentDate = moment();
            var todayDate = currentDate.format('YYYY-MM-DD');
            var sixtyDaysAgo = currentDate.subtract(60, 'days').format('YYYY-MM-DD');
            const params = {
                //accountId: '12345678', // Account number.
                //maxResults: 100, // The maximum number of orders to retrieve.
                fromEnteredTime: sixtyDaysAgo, // yyyy-MM-dd. Date must be within 60 days from today's date.
                toEnteredTime: todayDate //, // yyyy-MM-dd
                //status: // Specifies that only orders of this status should be returned.
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/orders`, // Get Orders By Query
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
            } else if(status === 400) {
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

    // Get Orders for a specific account from the TD API
    // https://developer.tdameritrade.com/account-access/apis/get/accounts/%7BaccountId%7D/orders-0
    getAccountOrders: async (accountId) => {
        try {
            const token = await AuthService.getAccessToken();
            var currentDate = moment();
            var todayDate = currentDate.format('YYYY-MM-DD');
            var sixtyDaysAgo = currentDate.subtract(60, 'days').format('YYYY-MM-DD');
            const params = {
                //accountId: accountId, // '12345678' Account number for use with TD API Get Orders By Query
                //maxResults: 100, // The maximum number of orders to retrieve.
                fromEnteredTime: sixtyDaysAgo, // yyyy-MM-dd. Date must be within 60 days from today's date.
                toEnteredTime: todayDate //, // yyyy-MM-dd
                //status: // Specifies that only orders of this status should be returned.
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}/orders`, // Get Orders By Path
                //url: `${config.auth.apiUrl}/orders`, // Get Orders By Query
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
        } catch(err) {
            throw err;
        } 
    },

    // Get a specific order for a specific account from the TD API
    // https://developer.tdameritrade.com/account-access/apis/get/accounts/%7BaccountId%7D/orders/%7BorderId%7D-0
    getOrder: async (accountId,orderId) => {
        try {
            const token = await AuthService.getAccessToken();
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}/orders/${orderId}`, // Get Order
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
    },

    // Place an order for a specific account with the TD API
    // https://developer.tdameritrade.com/account-access/apis/post/accounts/%7BaccountId%7D/orders-0
    placeOrder: async (accountId, order) => {
        try {
            const token = await AuthService.getAccessToken();
            const options = {
                method: 'POST',
                url: `${config.auth.apiUrl}/accounts/${accountId}/orders`,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                data: order,
                validateStatus: function (status) {
                    return status === 201 || status === 400 || status === 401 || status === 403 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const message = response.data.error;
            if (status === 201) {
                return response;
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

    // Replace an existing order for an account with the TD API
    // The existing order will be replaced by the new order. 
    // Once replaced, the old order will be canceled and a new order will be created.
    // https://developer.tdameritrade.com/account-access/apis/put/accounts/%7BaccountId%7D/orders/%7BorderId%7D-0
    replaceOrder: async (accountId, orderId, order) => {
        try {
            const token = await AuthService.getAccessToken();
            const options = {
                method: 'PUT',
                url: `${config.auth.apiUrl}/accounts/${accountId}/orders/${orderId}`,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                data: order,
                validateStatus: function (status) {
                    return status === 204 || status === 400 || status === 401 || status === 403 || status === 404 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const message = response.data.error;
            if (status === 204) {
                return response;
            } else if (status === 400) {
                throw new BadRequestError(message);
            } else if (status === 401) {
                throw new UnauthorizedError(message);
            } else if (status === 403) {
                throw new ForbiddenError(message);
            } else if (status === 404) {
                throw new NotFoundError(message);
            } else if (status === 503) {
                throw new ServiceUnavailableError(message);
            } else {
                throw new InternalServerError(message);
            }
        } catch (err) {
            throw err;
        }
    },

    // Cancel a specific order for a specific account with the TD API
    // https://developer.tdameritrade.com/account-access/apis/delete/accounts/%7BaccountId%7D/orders/%7BorderId%7D-0
    cancelOrder: async (accountId, orderId) => {
        try {
            const token = await AuthService.getAccessToken();
            const options = {
                method: 'DELETE',
                url: `${config.auth.apiUrl}/accounts/${accountId}/orders/${orderId}`,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                validateStatus: function (status) {
                    return status === 204 || status === 400 || status === 401 || status === 403 || status === 404 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const message = response.data.error;
            if (status === 204) {
                return response;
            } else if (status === 400) {
                throw new BadRequestError(message);
            } else if (status === 401) {
                throw new UnauthorizedError(message);
            } else if (status === 403) {
                throw new ForbiddenError(message);
            } else if (status === 404) {
                throw new NotFoundError(message);
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
Order database service methods
=============================================================================*/

const db = {

    // Controller will Get all orders of all of the user's linked accounts from TD API
    // This reset function is intended to delete all orders in the database
    // then save the lastest orders from TD into the database 
    resetOrders: async (orders) => {
        try {
            let deleteManyResult = await Order.deleteMany();
            let createResult = await Order.create(orders);
        } catch (err) {
            throw err;
        }
    },

    // Fetch all orders of all accounts from the database
    getOrders: async () => {
        try {
            const foundOrders = await Order.find();

            if (foundOrders && (foundOrders.length > 0)) {
                return foundOrders;
            } else {
                return [];
            }
        } catch (err) {
            throw new InternalServerError(`Error fetching all orders from database: ${err.message}`);
        }
    },

    // Fetch orders of one account from the database
    getAccountOrders: async (accountId) => {
        let foundOrders = null;
        try {
            if (!accountId) {
                throw new BadRequestError(`Error fetching orders from database for account`);
            }
            try {
                foundOrders = await Order.find({ accountId: accountId });
                if (foundOrders && (foundOrders.length > 0)) {
                    return foundOrders;
                } else {
                    return []; // no orders on account
                }
            } catch (err) {
                throw new InternalServerError(`Error fetching orders from database for account and orderId: ${err.message}`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Fetch specific order of one account from the database
    getOrder: async (accountId, orderId) => {
        let foundOrder = null;
        try {
            if (accountId && orderId) {
                try {
                    foundOrder = await Order.findOne({ accountId: accountId, orderId: orderId });
                } catch (err) {
                    throw new InternalServerError(`Error fetching order from database for account and orderId: ${err.message}`);
                }
                if (foundOrder) {
                    return foundOrder;
                } else {
                    throw new NotFoundError(`Error order Not Found in database for account and orderId.`);
                }
            } else {
                throw new BadRequestError(`Error getting order from database for accountId and orderId.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Create one order on one account in the database
    createOrder: async (order) => {
        try {
            let result = null;
            return result = await Order.create(order);
        } catch (err) {
            if (err.name === 'ValidationError') {
                throw new BadRequestError(`Error creating order in database validation: ${err.message}`);
            } else {
                throw new InternalServerError(`Error creating order in database: ${err.message}`);
            }
        }
    },

    // Replace Specific order for a specific account in the database
    // does not verify that the symbol or asset type are valid.
    replaceOrder: async (accountId, orderId, order) => {
        try {
            if (accountId && orderId && order) {
                let filter = { accountId: accountId, orderId: orderId };
                let replacement = order;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await Order.replaceOne(filter, replacement, options);
                    // matched and replaced only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('Order for account with orderId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error replacing order in database for accountId and orderId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error replacing order in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error replacing order in database for accountId and orderId.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Partially update order for a specific account in the database
    updateOrder: async (accountId, orderId, order) => {
        try {
            if (accountId && orderId && order) {
                let filter = { accountId: accountId, orderId: orderId };
                let update = order;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await Order.updateOne(filter, update, options);
                    // matched and updated only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('Order for account with orderId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error updatng order in database for accountId and orderId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error updatng order in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error updatng order in database invalid accountId or orderId or order object.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Delete all orders from the database
    deleteOrders: async () => {
        let result = null;
        try {
            result = await Order.deleteMany();
            return result;
        } catch (err) {
            throw new InternalServerError(`Error deleting all orders from database: ${err.message}`);
        }
    },

    // Delete all orders of a specific account from the database
    deleteAccountOrders: async (accountId) => {
        let result = null;
        try {
            if (accountId) {
                try {
                    result = await Order.deleteMany({ accountId: accountId });
                    return result;
                } catch (err) {
                    throw new InternalServerError(`Error deleting account orders from database: ${err.message}`);
                }
            } else {
                throw new BadRequestError(`Error deleting account orders from database invalid accountId.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Delete order for a specific account from the database
    deleteOrder: async (accountId, orderId) => {
        try {
            if (accountId && orderId) {
                let result = await Order.deleteOne({ accountId: accountId, orderId: orderId });
                if (result.n === 1 && result.nModified === 1) {
                    return result;
                } else {
                    throw new NotFoundError(`Error deleting order Not Found in database for accountId and orderId.`);
                }
            } else {
                throw new BadRequestError(`Error deleting order from database invalid accountId or orderId.`);
            }
        } catch (err) {
            throw err;
        }
    }

};

module.exports.api = api;
module.exports.db = db;