const config = require('../config/config.js');
const axios = require('axios');
const Order = require('../models/Order').default;
const TokenService = require('./TokenService');
const moment = require('moment');

const getDbOrders = function() {
    return Order.find().exec()
        .then(function(foundOrders) {
            if (foundOrders && (foundOrders.length > 0)) {
                return foundOrders;
            } else {
                console.log('Error in orderController.getAllOrders No orders found in database.')
                throw new Error('No orders found in database.');
            }
        })
        .catch(function(err) {
            throw new Error('Error fetching all orders from database.');
        });
};

const saveDbOrders = function(orders) {
    return Order.create(orders)
        .then(function(result) {
            return result;
        })
        .catch(function(err) {
            throw new Error('Error saving all orders to database.');
        });
};

const getApiOrders = async () => {
    const token = await TokenService.getAccessToken();
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
        headers: { 'Authorization': `Bearer ${token.accessToken}` }      
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (err) {
        const message = response.message;
        console.log(`Error in getApiOrders: ${message}`);
        throw new Error(`Error in getApiOrders: ${message}`);
    }
}

const getApiOrdersByAccountId = async (accountId) => {
    const token = await TokenService.getAccessToken();
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
        headers: { 'Authorization': `Bearer ${token.accessToken}` }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (err) {
        const message = response.message;
        console.log(`Error in getApiOrders: ${message}`);
        throw new Error(`Error in getApiOrders: ${message}`);
    }
}

const getApiOrderByAccountIdOrderId = async (accountId,orderId) => {
    const token = await TokenService.getAccessToken();

    const options = {
        method: 'GET',
        url: `${config.auth.apiUrl}/accounts/${accountId}/orders/${orderId}`, // Get Orders By Path
        headers: { 'Authorization': `Bearer ${token.accessToken}` }
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (err) {
        const message = response.message;
        console.log(`Error in getApiOrderByAccountIdOrderId: ${message}`);
        throw new Error(`Error in getApiOrderByAccountIdOrderId: ${message}`);
    }
}

exports.getDbOrders = getDbOrders;
exports.saveDbOrders = saveDbOrders;
exports.getApiOrders = getApiOrders;
exports.getApiOrdersByAccountId = getApiOrdersByAccountId;
exports.getApigetApiOrderByAccountIdOrderIdOrder = getApiOrderByAccountIdOrderId;