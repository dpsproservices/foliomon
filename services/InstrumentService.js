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
    }
}

module.exports = api;