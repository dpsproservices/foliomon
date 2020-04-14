const config = require('../config/config.js');
const axios = require('axios');
const TokenService = require('./TokenService');

const api = {
    getInstruments: async (symbol, projection) => {
        const token = await TokenService.getAccessToken();

        const validProjectionTypes = ['symbol-search', 'symbol-regex', 'desc-search', 'desc-regex', 'fundamental'];
        if (!validProjectionTypes.includes(projection)) {
            throw new Error(`Invalid projection type: ${projection}`);
        }

        const params = {
            symbol,
            projection
        };

        const options = {
            method: 'GET',
            url: `${config.auth.apiUrl}/instruments`,
            params: params,          
            headers: { 'Authorization': `Bearer ${token.accessToken}` }      
        };

        const response = await axios(options);
        return response.data;
    },
    getPriceHistory: async (symbol, period, periodType, frequency, frequencyType, startDate, endDate) => {
        const token = await TokenService.getAccessToken();

        const params = {
            period,
            periodType,
            frequency,
            frequencyType,
            startDate,
            endDate,
            //needExtendedHoursData
        };

        const options = {
            method: 'GET',
            url: `${config.auth.apiUrl}/marketdata/${symbol}/pricehistory`,
            params: params,          
            headers: { 'Authorization': `Bearer ${token.accessToken}` }      
        };

        const response = await axios(options);
        return response.data;
    },
    getMovers: async (index, direction, change) => {
        const token = await TokenService.getAccessToken();

        const params = {
            direction,
            change
        };

        const options = {
            method: 'GET',
            url: `${config.auth.apiUrl}/marketdata/${index}/movers`,
            params: params,          
            headers: { 'Authorization': `Bearer ${token.accessToken}` }      
        };

        const response = await axios(options);
        return response.data;
    }
}

module.exports = api;