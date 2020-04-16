const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const WatchlistService = require('../services/WatchlistService');


/*=============================================================================
Foliomon Watchlist endpoints controller
=============================================================================*/

// Get all watchlists of all of the user's linked accounts from TD API
// Delete all watchlists in the database
// Save watchlists from TD into the database and send them back on the response to the client
exports.resetWatchlists = async (req, res) => {
    try {
        const watchlists = await WatchlistService.api.getWatchlists();
        const dbResult = await WatchlistService.db.resetWatchlists(watchlists);
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
    let watchlistName = watchlist.name; // unique watchlist name on account
    try {
        // Request TD API to create the new watchlist on the account
        // The service will throw an error on any other status code besides 201 Created
        const response = await WatchlistService.api.createWatchlist(accountId, watchlist);
        
        // After the watchlist was successfully created at TD        
        // Request TD API to get the watchlists on the account
        const watchlists = await WatchlistService.api.getAccountWatchlists(accountId);
        // Match the name of the newly created watchlist
        let foundMatch = false;
        for (let i = 0; i < watchlists.length; i++) {
            let watchlistFromAPI = watchlists[i];
            if (watchlistName === watchlistFromAPI.name) {
                foundMatch = true;
                watchlist = watchlistFromAPI;                    
                break;
            }
        }
        if (foundMatch) {
            // Create the matched watchlist from TD API into the database
            const dbResult = await WatchlistService.db.createWatchlist(watchlist);
            res.status(200).send(watchlist);
        } else {
            throw new InternalServerError(`No watchlist created on account at TD with matching name ${watchlistName}`); 
        }                               
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
    let watchlistName = watchlist.name; // unique watchlist name on account   
    try {
        // Request TD API to replace the watchlist on the account
        // Note that sending accountId and sequenceId(s) in the watchlist object will receive and throw a Bad Request
        // The service will throw an error on any other status code besides 204 No Content
        const response = await WatchlistService.api.replaceWatchlist(accountId, watchlistId, watchlist);

        // After the watchlist was successfully replaced at TD
        // Request TD API to get the watchlists on the account
        const watchlists = await WatchlistService.api.getAccountWatchlists(accountId);
        // Match the name of the newly created watchlist
        let foundMatch = false;
        for (let i = 0; i < watchlists.length; i++) {
            let watchlistFromAPI = watchlists[i];
            if (watchlistName === watchlistFromAPI.name) {
                foundMatch = true;
                watchlist = watchlistFromAPI;                
                break;
            }
        }
        if (foundMatch) {
            // Replace the matched watchlist from TD API into the database
            const dbResult = await WatchlistService.db.replaceWatchlist(accountId, watchlistId, watchlist);
            res.status(200).send(watchlist);
        } else {
            throw new InternalServerError(`No watchlist replaced on account at TD with matching name ${watchlistName}`);
        } 
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
    let watchlistName = watchlist.name; // unique watchlist name on account         
    try {
        // Request TD API to update the watchlist on the account
        // Note that sending accountId in the watchlist object will receive and throw a Bad Request
        // however omitting sequenceId(s) in the watchlistItems array are required
        // and will receive and throw a Bad Request
        // The service will throw an error on any other status code besides 204 No Content
        const data = await WatchlistService.api.updateWatchlist(accountId, watchlistId, watchlist);

        // After the watchlist was successfully replaced at TD
        // Request TD API to get the watchlists on the account
        const watchlists = await WatchlistService.api.getAccountWatchlists(accountId);
        // Match the name of the newly created watchlist
        let foundMatch = false;
        for (let i = 0; i < watchlists.length; i++) {
            let watchlistFromAPI = watchlists[i];
            if (watchlistName === watchlistFromAPI.name) {
                foundMatch = true;
                watchlist = watchlistFromAPI;
                break;
            }
        }
        if (foundMatch) {
            // Update the matched watchlist from TD API in the database
            const dbResult = await WatchlistService.db.updateWatchlist(accountId, watchlistId, watchlist);
            res.status(200).send(watchlist);
        } else {
            throw new InternalServerError(`No watchlist updated on account at TD with matching name ${watchlistName}`);
        }       
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
        const response = await WatchlistService.api.deleteWatchlist(accountId, watchlistId);
        const dbResult = await WatchlistService.db.deleteWatchlist(accountId, watchlistId);
        res.status(204).send();
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