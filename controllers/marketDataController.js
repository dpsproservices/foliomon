const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, NotAcceptableError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const MarketDataService = require('../services/MarketDataService');

/*=============================================================================
Foliomon MarketData endpoints controller
=============================================================================*/

const controller = {

    // Get Hours for Multiple Markets
    getMarketsHours: async(req, res) => {
        try {
            const { markets } = req.body; // will be a POST from client route
            const marketHours = await MarketDataService.api.getMarketsHours(markets);
            res.status(200).send(marketHours);
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
                error = `User does not have permission to access.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Market(s) or markets hours not found.: ${err.message}`;
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

    // Get Hours for a Single Market
    getMarketHours: async (req, res) => {
        try {
            const { market } = req.params;
            const marketHours = await MarketDataService.api.getMarketHours(market);
            res.status(200).send(marketHours);
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
                error = `User does not have permission to access.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Market(s) or market hours not found: ${err.message}`;
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

    // Search or retrieve instrument data, including fundamental data
    getInstruments: async (req, res) => {
        try {
            const { symbol, projection } = req.body; // will be a POST from client route
            const instruments = await MarketDataService.api.getInstruments(symbol, projection);
            res.status(200).send(instruments);
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
                error = `User does not have permission to access.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Symbols or instruments not found: ${err.message}`;
            } else if (err instanceof NotAcceptableError) {
                status = 406;
                error = `Issue in the symbol regex, or number of symbols searched is over the maximum: ${err.message}`;
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

    // Get an instrument by CUSIP
    getInstrument: async (req, res) => {
        try {
            const cusip = req.params.cusip;
            const instrument = await MarketDataService.api.getInstrument(cusip);
            res.status(200).send(instrument);
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof UnauthorizedError) {
                status = 401;
                error = `Invalid Access Token: ${err.message}`;
            } else if (err instanceof ForbiddenError) {
                status = 403;
                error = `User does not have permission to access.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Symbol or instrument not found: ${err.message}`;
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

    // Get price history for a symbol
    getPriceHistory: async (req, res) => {
        try { // will be a POST request on the client route
            const { symbol, period, periodType, frequency, frequencyType, startDate, endDate } = req.body;
            const priceHistory = await MarketDataService.api.getPriceHistory(symbol, period, periodType, frequency, frequencyType, startDate, endDate);
            res.status(200).send(priceHistory);
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
                error = `User does not have permission to access.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Symbol or price history not found: ${err.message}`;
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

    // Get Top 10 (up or down) movers by value or percent for a particular market 
    getMovers: async (req, res) => {
        try {
            const { index, direction, change } = req.body;
            const movers = await MarketDataService.api.getMovers(index, direction, change);
            res.status(200).send(movers);
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
                error = `User does not have permission to access.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Movers not found: ${err.message}`;
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

    // Get realtime quote for one or more symbols
    getQuotes: async (req, res) => {
        try {
            const symbols = req.body.symbols; // client route will be POST
            const quotes = await MarketDataService.api.getQuotes(symbols);
            res.status(200).send(quotes);
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
                error = `User does not have permission to access.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Symbol or instruemnt not found: ${err.message}`;
            } else if (err instanceof NotAcceptableError) {
                status = 406;
                error = `Issue in the symbol regex, or number of symbols searched is over the maximum: ${err.message}`;
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

    // Get realtime quote for one symbol
    getQuote: async (req, res) => {
        try {
            const symbol  = req.params.symbol;
            const quote = await MarketDataService.api.getQuote(symbol);
            res.status(200).send(quote);
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
                error = `User does not have permission to access.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Symbol or instrument not found: ${err.message}`;
            } else if (err instanceof NotAcceptableError) {
                status = 406;
                error = `Issue in the symbol regex, or number of symbols searched is over the maximum: ${err.message}`;
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

    // Get delayed quotes for one or more symbols - with api key client id instead of access token
    getDelayedQuotes: async (req, res) => {
        try {
            const symbols = req.body.symbols; // client route will be POST
            const delayedQuotes = await MarketDataService.api.getDelayedQuotes(symbols);
            res.status(200).send(delayedQuotes);
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
                error = `User does not have permission to access.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Symbol or instrument not found: ${err.message}`;
            } else if (err instanceof NotAcceptableError) {
                status = 406;
                error = `Issue in the symbol regex, or number of symbols searched is over the maximum: ${err.message}`;
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

    // Get delayed quote for one symbol - with api key client id instead of access token
    getDelayedQuote: async (req, res) => {
        try {
            const symbol = req.params.symbol;
            const delayedQuote = await MarketDataService.api.getDelayedQuote(symbol);
            res.status(200).send(delayedQuote);
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
                error = `User does not have permission to access.`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Symbol or instrument not found: ${err.message}`;
            } else if (err instanceof NotAcceptableError) {
                status = 406;
                error = `Issue in the symbol regex, or number of symbols searched is over the maximum: ${err.message}`;
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