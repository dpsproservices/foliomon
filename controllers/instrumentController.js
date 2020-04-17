const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, NotAcceptableError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const InstrumentService = require('../services/InstrumentService');

/*=============================================================================
Foliomon Instrument endpoints controller
=============================================================================*/

const controller = {

  // Get an instrument by CUSIP
  getInstrument: async (req, res) => {
    try {
      const cusip = req.params.cusip;
      const instrument = await InstrumentService.api.getInstrument(cusip);
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
        error = `Symbol or instruemnt not found.`;
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
      const { symbol, projection } = req.body;
      const instruments = await InstrumentService.api.getInstruments(symbol, projection);
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
        error = `Symbol or instruemnt not found.`;
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

  // Get price history for a symbol
  getPriceHistory: async (req, res) => {
    try {
      const { symbol, period, periodType, frequency, frequencyType } = req.body;
      const priceHistory = await InstrumentService.api.getPriceHistory(symbol, period, periodType, frequency, frequencyType);
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
        error = `Watchlist not found.`;
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
      const movers = await InstrumentService.api.getMovers(index, direction, change);
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
        error = `Watchlist not found.`;
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