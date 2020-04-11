const { UnauthorizedTokenError, NotFoundError, ForbiddenError, ServerError, TemporaryError } = require('../services/ServiceErrors');
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
    } catch (error) {
        //logger.error(`Error occured ${err.stack}`);
        if (error instanceof UnauthorizedTokenError) {
            res.status(401).send({ error: error.message });
        } else if (error instanceof NotFoundError) {
            res.status(404).send({ error: error.message });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
}

// GET /foliomon/accounts/:accountId/watchlists
// Get Watchlists for Single Account
exports.getAccountWatchlists = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const watchlists = await WatchlistService.api.getAccountWatchlists(accountId);
        res.status(200).send(watchlists);
    } catch (error) {
        //logger.error(`Error occured ${err.stack}`);
        if (error instanceof UnauthorizedTokenError) {
            res.status(401).send({ error: error.message });
        } else if (error instanceof ForbiddenError) {
            res.status(403).send({ error: error.message });
        } else if (error instanceof NotFoundError) {
            res.status(404).send({ error: error.message });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
}