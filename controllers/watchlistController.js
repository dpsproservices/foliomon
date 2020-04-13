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
        var status = 500; // default
        var error = err.message;

        if (err instanceof UnauthorizedError) {
            status = 401;
            error = `Invalid Access Token: ${err.message}`;            
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

// Get Watchlists for Single Account
exports.getAccountWatchlists = async (req, res) => {
    let accountId = req.params.accountId;
    try {        
        const watchlists = await WatchlistService.api.getAccountWatchlists(accountId);
        res.status(200).send(watchlists);
    } catch (err) {
        var status = 500; // default
        var error = err.message;

        if (err instanceof UnauthorizedError) {
            status = 401;
            error = `Invalid Access Token: ${err.message}`;
        } else if (err instanceof ForbiddenError) {
            status = 403;
            error = `User does not have permission to access the specified account: ${accountId}`;
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

// Get specific watchlist for a specific account
exports.getWatchlist = async (req, res) => {
    let accountId = req.params.accountId;
    let watchlistId = req.params.watchlistId;    
    try {
        const watchlist = await WatchlistService.api.getWatchlist(accountId, watchlistId);
        res.status(200).send(watchlist);
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
            error = `User does not have permission to access the specified account: ${accountId}`;
        } else if (err instanceof NotFoundError) {
            status = 404;
            error = `Watchlist id ${watchlistId} not found.`;
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

// Create a new watchlist in a specific account
exports.createWatchlist = async (req, res) => {
    let accountId = req.params.accountId;
    let watchlist = req.body;    
    try {
        const data = await WatchlistService.api.createWatchlist(accountId, watchlist);
        res.status(201).send(data);
        const dbResult = await WatchlistService.db.createWatchlist(watchlist);
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
            error = `User does not have permission to access the specified account: ${accountId}`;
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

// Replace an existing watchlist in a specific account
exports.replaceWatchlist = async (req, res) => {
    let accountId = req.params.accountId;
    let watchlistId = req.params.watchlistId;
    let watchlist = req.body;    
    try {
        const data = await WatchlistService.api.replaceWatchlist(accountId, watchlistId, watchlist);
        res.status(204).send(data);
        const dbResult = await WatchlistService.db.replaceWatchlist(accountId, watchlistId, watchlist);
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
            error = `User does not have permission to access the specified account: ${accountId}`;
        } else if (err instanceof NotFoundError) {
            status = 404;
            error = `Watchlist id ${watchlistId} not found.`;
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

// Partially update watchlist of a specific account
exports.updateWatchlist = async (req, res) => {
    let accountId = req.params.accountId;
    let watchlistId = req.params.watchlistId;
    let watchlist = req.body;        
    try {
        const data = await WatchlistService.api.updateWatchlist(accountId, watchlistId, watchlist);
        res.status(204).send(data);
        const dbResult = await WatchlistService.db.updateWatchlist(accountId, watchlistId, watchlist);
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
            error = `User does not have permission to access the specified account: ${accountId}`;
        } else if (err instanceof NotFoundError) {
            status = 404;
            error = `Watchlist id ${watchlistId} not found.`;
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

// Delete specific watchlist of a specific account
exports.deleteWatchlist = async (req, res) => {
    let accountId = req.params.accountId;
    let watchlistId = req.params.watchlistId;   
    try {
        const data = await WatchlistService.api.deleteWatchlist(accountId, watchlistId);
        res.status(204).send(data);
        const dbResult = await WatchlistService.db.deleteWatchlist(accountId, watchlistId);
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
            error = `User does not have permission to access the specified account: ${accountId}`;
        } else if (err instanceof NotFoundError) {
            status = 404;
            error = `Watchlist id ${watchlistId} not found.`;
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

// Refresh all watchlists of all of the user's linked accounts into the database and send them on the response
exports.refreshWatchlists = async (req, res) => {
    try {
        const watchlists = await WatchlistService.api.getWatchlists();
        res.status(200).send(watchlists);
        const dbResult = await WatchlistService.db.refreshWatchlists(watchlists);
    } catch (err) {
        var status = 500; // default
        var error = err.message;

        if (err instanceof UnauthorizedError) {
            status = 401;
            error = `Invalid Access Token: ${err.message}`;
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