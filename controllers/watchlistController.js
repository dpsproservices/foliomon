const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const WatchlistService = require('../services/WatchlistService');

/*=============================================================================
Foliomon Watchlist endpoints controller
=============================================================================*/

// Get Watchlists for Multiple Accounts
// Get all watchlists for all of the user's linked accounts from the TD API
exports.getWatchlists = async (req, res) => {
    try {
        const watchlists = await WatchlistService.api.getWatchlists();
        res.status(200).send(watchlists);
    } catch (err) {
        //logger.error(`Error occured ${err.stack}`);
        if (err instanceof UnauthorizedError) {
            res.status(401).send({ error: err.message });
        } else if (error instanceof NotFoundError) {
            res.status(404).send({ error: err.message });
        } else {
            res.status(500).send({ error: err.message });
        }
    }
}

// Get Watchlists for Single Account
exports.getAccountWatchlists = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const watchlists = await WatchlistService.api.getAccountWatchlists(accountId);
        res.status(200).send(watchlists);
    } catch (err) {
        if (err instanceof UnauthorizedError) {
            res.status(401).send({ error: err.message });
        } else if (err instanceof ForbiddenError) {
            res.status(403).send({ error: err.message });
        } else if (err instanceof NotFoundError) {
            res.status(404).send({ error: err.message });
        } else {
            res.status(500).send({ error: err.message });
        }
    }
}

// Get specific watchlist for a specific account
exports.getWatchlist = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const watchlistId = req.params.watchlistId;
        const watchlist = await WatchlistService.api.getWatchlist(accountId, watchlistId);
        res.status(200).send(watchlist);
    } catch (err) {
        console.log({err});
        if (err instanceof BadRequestError) {
            res.status(400).send({ error: err.message });
        } else if (err instanceof UnauthorizedError) {
            res.status(401).send({ error: err.message });
        } else if (err instanceof ForbiddenError) {
            res.status(403).send({ error: err.message });
        } else if (err instanceof NotFoundError) {
            res.status(404).send({ error: err.message });
        } else {
            res.status(500).send({ error: err.message });
        }
    }
}