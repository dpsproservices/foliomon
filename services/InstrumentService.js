const config = require('../config/config.js');
const axios = require('axios');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, NotAcceptableError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const TokenService = require('./TokenService');

/*=============================================================================
TD API Instrument endpoint wrappers service methods

https://developer.tdameritrade.com/instruments/apis
=============================================================================*/
const api = {

    // Get an instrument by CUSIP
    // https://developer.tdameritrade.com/instruments/apis/get/instruments/%7Bcusip%7D
    getInstrument: async (cusip) => {
        try {
            const token = await TokenService.getAccessToken();
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/instruments/${cusip}`,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 401 || status === 403 || status === 404 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const data = response.data;
            const message = response.data.error;
            if (status === 200) {
                return data;
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

    /* 
        Search or retrieve instrument data, including fundamental data
        https://developer.tdameritrade.com/instruments/apis/get/instruments
    
    projection:
        The type of request:

        symbol-search: Retrieve instrument data of a specific symbol or cusip

        symbol-regex: Retrieve instrument data for all symbols matching regex. 
            Example: symbol=XYZ.* will return all symbols beginning with XYZ

        desc-search: Retrieve instrument data for instruments whose description contains the word supplied. 
            Example: symbol=FakeCompany will return all instruments with FakeCompany in the description.

        desc-regex: Search description with full regex support. 
            Example: symbol=XYZ.[A-C] returns all instruments whose descriptions 
            contain a word beginning with XYZ followed by a character A through C.

        fundamental: Returns fundamental data for a single instrument specified by exact symbol.
    */
    getInstruments: async (symbol, projection) => {
        try {        
            const validProjectionTypes = ['symbol-search', 'symbol-regex', 'desc-search', 'desc-regex', 'fundamental'];
            if (!validProjectionTypes.includes(projection)) {
                throw new BadRequestError(`Invalid projection type: ${projection}`);
            }            
            const token = await TokenService.getAccessToken();            
            const params = {
                symbol,
                projection
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/instruments`,
                params: params,          
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 400 || status === 401 || status === 403 || status === 404 || status === 406 || status === 503;
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
            } else if (status === 404) {
                throw new NotFoundError(message);
            } else if (status === 406) { // issue in the symbol regex, or number of symbols searched is over the maximum
                throw new NotAcceptableError(message);
            } else if (status === 503) {
                throw new ServiceUnavailableError(message);
            } else {
                throw new InternalServerError(message); // 500
            }
        } catch(err) {
            throw err;
        }    
    },

    /*======================================================================
    Price History

    Historical price data for charts
    ======================================================================*/

    // Get price history for a symbol 
    // https://developer.tdameritrade.com/price-history/apis
    /*
    periodType: 
        The type of period to show. Valid values are day, month, year, or ytd (year to date). Default is day.
    period:
        The number of periods to show.
        Example: For a 2 day / 1 min chart, the values would be:
            period: 2
            periodType: day
            frequency: 1
            frequencyType: min

        Valid periods by periodType
            day: 1, 2, 3, 4, 5, 10 (default)
            month: 1 (default), 2, 3, 6
            year: 1, 2, 3, 5, 10, 15, 20
            ytd: 1 (default)

    frequencyType:
        The type of frequency with which a new candle is formed.
        Valid frequencyTypes by periodType (defaults marked with an asterisk):
            day: minute (default)
            month: daily, weekly (default)
            year: daily, weekly, monthly (default)
            ytd: daily, weekly (default)

    frequency:
        The number of the frequencyType to be included in each candle.
        Valid frequencies by frequencyType
            minute: 1 (default), 5, 10, 15, 30
            daily: 1 (default)
            weekly: 1 (default)
            monthly: 1 (default)
    */
    getPriceHistory: async (symbol, period, periodType, frequency, frequencyType, startDate, endDate) => {
        try {
            const token = await TokenService.getAccessToken();
            const params = {
                period,
                periodType, // day, month, year, ytd
                frequency,
                frequencyType,
                startDate, // End date as milliseconds since epoch. If startDate and endDate are provided, period should not be provided. Default is previous trading day.
                endDate // Start date as milliseconds since epoch. If startDate and endDate are provided, period should not be provided.
                //needExtendedHoursData // true to return extended hours data, false for regular market hours only. Default true
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/marketdata/${symbol}/pricehistory`,
                params: params,          
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 401 || status === 403 || status === 404 || status === 503;
                }
            };
            const response = await axios(options);
            const status = response.status;
            const data = response.data;
            const message = response.data.error;
            if (status === 200) {
                return data;
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
        } catch(err) {
            throw err;
        }
    },

    /*======================================================================
    Movers

    Retrieve mover information by index symbol, direction type and change
    ======================================================================*/

    // Get Movers
    // Top 10 (up or down) movers by value or percent for a particular market 
    // https://developer.tdameritrade.com/movers/apis
    getMovers: async (index, direction, change) => {
        try {
            const validDirection = ['up', 'down'];
            if (!validDirection.includes(direction)) {
                throw new BadRequestError(`Invalid direction: ${direction}`);
            }       
            const validChange = ['percent', 'value'];
            if (!validChange.includes(change)) {
                throw new BadRequestError(`Invalid change: ${change}`);
            }                      
            const token = await TokenService.getAccessToken();
            const params = {
                direction, // 'up' or  'down'
                change // 'percent' or 'value'
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/marketdata/${index}/movers`,
                params: params,          
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
            } else if (status === 404) {
                throw new NotFoundError(message);
            } else if (status === 503) {
                throw new ServiceUnavailableError(message);
            } else {
                throw new InternalServerError(message); // 500
            }
        } catch(err) {
            throw err;
        }   
    }
}

module.exports.api = api;