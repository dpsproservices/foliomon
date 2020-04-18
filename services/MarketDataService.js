const config = require('../config/config.js');
const axios = require('axios');
const moment = require('moment');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, NotAcceptableError, InternalServerError, ServiceUnavailableError } = require('./errors/ServiceErrors');
const TokenService = require('./TokenService');
const MarketHours = require('../models/MarketHours');

const api = {

/*=============================================================================
TD API Market Hours endpoint wrappers service methods

Operating hours of markets

https://developer.tdameritrade.com/market-hours/apis
=============================================================================*/

    // Get Hours for Multiple Markets
    // Retrieve market hours for specified markets
    getMarketsHours: async (markets) => {
        try {
            if (!markets) {
                markets = config.app.defaults.markets;
            }
            //const token = await TokenService.getAccessToken();
            var currentDate = moment();
            var todayDate = currentDate.format('YYYY-MM-DD');
            const params = {
                apiKey: config.auth.clientId, // (Optional) Pass your Client ID if making an unauthenticated request
                markets: markets, // The markets for which you're requesting market hours, comma-separated. EQUITY, OPTION, FUTURE, BOND, or FOREX.
                date: todayDate // date for which market hours are requested. Valid ISO-8601 formats are : yyyy-MM-dd and yyyy-MM-dd'T'HH:mm:ssz
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/marketdata/hours`, // Get Hours for Multiple Markets
                params: params,
                // headers: { 'Authorization': `Bearer ${token.accessToken}` },
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
    
    // Get Hours for a Single Market
    // Retrieve market hours for specified single market
    getMarketHours: async(market) => {
        try {
            //const token = await TokenService.getAccessToken();
            var currentDate = moment();
            var todayDate = currentDate.format('YYYY-MM-DD');
            // The market for which you're requesting market hours EQUITY, OPTION, FUTURE, BOND, or FOREX.
            const validMarkets = ['EQUITY', 'OPTION', 'FUTURE', 'BOND', 'FOREX'];
            if (!market || !validMarkets.includes(market) ) {
                throw new BadRequestError('Market name not recognized.');
            }
            const params = {
                apiKey: config.auth.clientId, // (Optional) Pass your Client ID if making an unauthenticated request
                date: todayDate // date for which market hours are requested. Valid ISO-8601 formats are : yyyy-MM-dd and yyyy-MM-dd'T'HH:mm:ssz
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/marketdata/${market}/hours`, // Get Hours for a Single Market
                params: params,
                // headers: { 'Authorization': `Bearer ${token.accessToken}` },
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
                throw new InternalServerError(message);
            }
        } catch (err) {
            throw err;
        }
    },

/*=============================================================================
TD API Instrument endpoint wrappers service methods

https://developer.tdameritrade.com/instruments/apis
=============================================================================*/

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
                symbol: symbol,
                projection: projection
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
        } catch (err) {
            throw err;
        }
    },

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

/*======================================================================
TD API Price History endpoint wrappers service methods

Historical price data for charts
https://developer.tdameritrade.com/price-history/apis
======================================================================*/

    // Get price history for a symbol 
    // https://developer.tdameritrade.com/price-history/apis/get/marketdata/%7Bsymbol%7D/pricehistory
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
                period: period,
                periodType: periodType, // day, month, year, ytd
                frequency: frequency,
                frequencyType: frequencyType,
                startDate: startDate, // End date as milliseconds since epoch. If startDate and endDate are provided, period should not be provided. Default is previous trading day.
                endDate: endDate // Start date as milliseconds since epoch. If startDate and endDate are provided, period should not be provided.
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
        } catch (err) {
            throw err;
        }
    },

/*======================================================================
TD API Movers endpoint wrapper methods

Retrieve mover information by index symbol, direction type and change
https://developer.tdameritrade.com/movers/apis
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
                //apiKey: config.auth.clientId, // (Optional) Pass your Client ID if making an unauthenticated request
                direction: direction, // 'up' or  'down'
                change: change // 'percent' or 'value'
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
        } catch (err) {
            throw err;
        }
    },

/*======================================================================
TD API Quotes endpoint wrapper methods

Request real-time and delayed top level quote data
https://developer.tdameritrade.com/quotes/apis
======================================================================*/

    // Get realtime quote for one or more symbols
    // https://developer.tdameritrade.com/quotes/apis/get/marketdata/quotes
    getQuotes: async (symbols) => {
        try {
            const token = await TokenService.getAccessToken();
            const params = {
                symbols: symbols
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/marketdata/quotes`,
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
        } catch (err) {
            throw err;
        }
    },

    // Get realtime quote for a symbol
    // https://developer.tdameritrade.com/quotes/apis/get/marketdata/%7Bsymbol%7D/quotes
    getQuote: async (symbol) => {
        try {
            const token = await TokenService.getAccessToken();
            const params = {
                symbol: symbol
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/marketdata/${symbol}/quotes`,
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
        } catch (err) {
            throw err;
        }
    },

    // Get delayed quote for one or more symbols - with api key client id instead of access token
    // https://developer.tdameritrade.com/quotes/apis/get/marketdata/quotes
    getDelayedQuotes: async (symbols) => {
        try {
            const params = {
                apikey: config.auth.clientId, // (Optional) Pass your Client ID if making an unauthenticated request
                symbols: symbols
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/marketdata/quotes`,
                params: params,
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
        } catch (err) {
            throw err;
        }
    },

    // Get delayed quote for a symbol - with api key client id instead of access token
    // https://developer.tdameritrade.com/quotes/apis/get/marketdata/%7Bsymbol%7D/quotes
    getDelayedQuote: async (symbol) => {
        try {
            const params = {
                apikey: config.auth.clientId, // (Optional) Pass your Client ID if making an unauthenticated request
                symbol: symbol
            };
            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/marketdata/${symbol}/quotes`,
                params: params,
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
            } else if (status === 503) {
                throw new ServiceUnavailableError(message);
            } else {
                throw new InternalServerError(message); // 500
            }
        } catch (err) {
            throw err;
        }
    }

};

/*=============================================================================
Market Data database service methods
=============================================================================*/

const db = {

    // Fetch all markets hours from the database
    getMarketsHours: async () => {
        try {
            const foundMarketHours = await marketHours.find();

            if (foundMarketHours) {
                return foundMarketHours;
            } else {
                throw new NotFoundError('Markets Hours Not Found in database.');
            }
        } catch (err) {
            if (err.name === 'NotFoundError') {
                throw err;
            } else {
                throw new InternalServerError(`Error fetching all markets hours from database: ${err.message}`);
            }
        }
    },

    // Fetch all market hours from the database for a specific market and date
    getMarketHours: async (market, date) => {
        try {
            const validMarkets = ['equity','bond','option','forex','future'];
            if (!validMarkets.includes(market)) {
                throw new BadRequestError('market must one of: equity,bond,option,forex,future.');
            }
            const foundMarketHours = await marketHours.find({ market: market, date: date });

            if (foundMarketHours) {
                return foundMarketHours;
            } else {
                throw new NotFoundError('Markets Hours Not Found in database for market.');
            }
        } catch (err) {
            if (err.name === 'BadRequestError' || err.name === 'NotFoundError') {
                throw err;
            } else {
                throw new InternalServerError(`Error fetching market hours from database: ${err.message}`);
            }
        }
    },

    // Create one marketHours for a date in the database
    createMarketHours: async (marketHours) => {
        try {
            let result = null;
            return result = await MarketHours.create(marketHours);
        } catch (err) {
            if (err.name === 'ValidationError') {
                throw new BadRequestError(`Error creating marketHours in database validation: ${err.message}`);
            } else {
                throw new InternalServerError(`Error creating marketHours in database: ${err.message}`);
            }
        }
    },

    // Replace Specific marketHours for a specific market and date in the database
    // does not verify that the symbol or asset type are valid.
    replaceMarketHours: async (market, date, marketHours) => {
        try {
            if (market && date && marketHours && (market === marketHours.market) && (date === marketHours.date)) {
                let filter = { market: market, date: date };
                let replacement = marketHours;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await MarketHours.replaceOne(filter, replacement, options);
                    // matched and replaced only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError(`Market hours for market: ${market} and date ${date} specified Not Found in database.`);
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error replacing market hours in database for market: ${market} and date ${date}: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error replacing marketHours in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error replacing market hours in database for market: ${market} and date ${date}.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Partially update marketHours for a specific account in the database, change marketHours name,
    // add to the beginning/end of a marketHours, update or delete items in a marketHours.
    // This method does not verify that the symbol or asset type are valid.
    updateMarketHours: async (market, date, marketHours) => {
        try {
            if (market && date && marketHours && (market === marketHours.market) && (date === marketHours.date)) {
                let filter = { market: market, date: date };
                let update = marketHours;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await MarketHours.updateOne(filter, update, options);
                    // matched and replaced only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError(`Market hours for market: ${market} and date ${date} specified Not Found in database.`);
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error updating market hours in database for market: ${market} and date ${date}: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error updating marketHours in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error updating market hours in database for market: ${market} and date ${date}.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Delete all markets hours from the database
    deleteMarketsHours: async () => {
        let result = null;
        try {
            result = await MarketHours.deleteMany();
            return result;
        } catch (err) {
            throw new InternalServerError(`Error deleting all market hours from database: ${err.message}`);
        }
    },

      // Delete market hours for a specific market and date from the database
    deleteMarketHours: async (market, date) => {
        try {
            if (market && date) {
                let result = await MarketHours.deleteOne({ market: market, date: date });
                if (result.n === 1 && result.nModified === 1) {
                    return result;
                } else {
                    throw new NotFoundError(`Error deleting market hours Not Found in database for for market: ${market} and date ${date}.`);
                }
            } else {
                throw new BadRequestError(`Error deleting market hours from database invalid for market: ${market} and date ${date}.`);
            }
        } catch (err) {
            throw err;
        }
    }    

};

module.exports.api = api;
module.exports.db = db;