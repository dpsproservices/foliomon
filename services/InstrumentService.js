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

        try {
            const response = await axios(options);
            return response.data;
        } catch (err) {
            const message = response.message;
            console.log(`Error in getInstrument: ${message}`);
            throw new Error(`Error in getInstrument: ${message}`);
        }
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

        try {
            const response = await axios(options);
            return response.data;
        } catch (err) {
            const message = response.message;
            console.log(`Error in getPriceHistory: ${message}`);
            throw new Error(`Error in getPriceHistory: ${message}`);
        }
    }
}

module.exports = api;