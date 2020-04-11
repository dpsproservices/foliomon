const config = require('../config/config.js');
const axios = require('axios');
const { UnauthorizedTokenError, NotFoundError, ForbiddenError, ServerError, TemporaryError } = require('./ServiceErrors');
const TokenService = require('./TokenService');
const Watchlist = require('../models/Watchlist');

/*=============================================================================
TD API Watchlist endpoint wrappers service methods

https://developer.tdameritrade.com/watchlist/apis
=============================================================================*/

const api = function() {

    // Get Watchlists for Multiple Accounts
    // Get all watchlists for all of the user's linked accounts from the TD API
    const getWatchlists = async () => {

        const token = await TokenService.getAccessToken();

        const options = {
            method: 'GET',
            url: `${config.auth.apiUrl}/accounts/watchlists`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` },
            validateStatus: function (status) {
                return status === 200 || status === 401;
            }
        };

        try {
            const response = await axios(options);
            const status = response.status;
            const message = response.message;
            if (status === 200) {
                return response.data;
            } else if (status === 401) {
                throw new UnauthorizedTokenError(`Invalid Access Token: ${message}`);
            }
        } catch (err) {            
            throw new ServerError(`Unexpected Server Error: ${message}`);
        }
    }

    // Get Watchlists for Single Account from the TD API
    const getAccountWatchlists = async (accountId) => {

        const token = await TokenService.getAccessToken();

        const options = {
            method: 'GET',
            url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` },
            validateStatus: function (status) {
                return status === 200 || status === 401 || status === 403;
            }
        };

        try {
            const response = await axios(options);
            const status = response.status;
            const message = response.message;            
            if (status === 200) {
                return response.data;
            } else if (status === 401) {
                throw new UnauthorizedTokenError(`Invalid Access Token: ${message}`);
            } else if (status === 403) {
                throw new ForbiddenError('User does not have permission to access the specified account.');
            }
        } catch (err) {
            throw new ServerError(`Unexpected Server Error: ${message}`);
        }
    }

    // Get Specific watchlist for a specific account from the TD API
    const getWatchlist = async (accountId,watchlistId) => {

        const token = await TokenService.getAccessToken();

        const options = {
            method: 'GET',
            url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists/${watchlistId}`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` },
            validateStatus: function (status) {
                return status === 200 || status === 400 || status === 401 || status === 403 || status === 404;
            }
        };

        try {
            const response = await axios(options);
            const status = response.status;
            const message = response.message;
            if (status === 200) {
                return response.data;
            } else if (status === 400) {
                throw new InvalidRequestError(`Invalid Request: ${message}`);
            } else if (status === 401) {
                throw new UnauthorizedTokenError(`Invalid Access Token: ${message}`);
            } else if (status === 403) {
                throw new ForbiddenError('User does not have permission to access the specified account.');
            } else if (status === 404) {
                throw new NotFoundError('Requested watchlist not found for specified account.');                
            }
        } catch (err) {
            throw new ServerError(`Unexpected Server Error: ${message}`);
        }
    }

    // Create Specific watchlist for a specific account with the TD API
    // does not verify that the symbol or asset type are valid.
    const createWatchlist = async (accountId, watchlist) => {

        const token = await TokenService.getAccessToken();

        const options = {
            method: 'POST',
            url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` },
            data: watchlist,
            validateStatus: function (status) {
                return status === 200 || status === 400 || status === 401 || status === 403;
            }
        };

        try {
            const response = await axios(options);
            const status = response.status;
            const message = response.message;
            if (status === 200) {
                return response.data;
            } else if (status === 400) {
                throw new InvalidRequestError(`Invalid Request: ${message}`);
            } else if (status === 401) {
                throw new UnauthorizedTokenError(`Invalid Access Token: ${message}`);
            } else if (status === 403) {
                throw new ForbiddenError('User does not have permission to access the specified account.');
            }
        } catch (err) {            
            throw new ServerError(`Unexpected Server Error: ${message}`);
        }
    }

    // Replace Specific watchlist for a specific account with the TD API
    // does not verify that the symbol or asset type are valid.
    const replaceWatchlist = async (accountId, watchlist) => {

        const token = await TokenService.getAccessToken();

        const options = {
            method: 'PUT',
            url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` },
            data: watchlist,
            validateStatus: function (status) {
                return status === 200 || status === 204 || status === 400 || status === 401 || status === 403;
            }
        };

        try {
            const response = await axios(options);
            const status = response.status;
            const message = response.message;
            if (status === 200 || status === 204) {
                return response.data;
            } else if (status === 400) {
                throw new InvalidRequestError(`Invalid Request: ${message}`);
            } else if (status === 401) {
                throw new UnauthorizedTokenError(`Invalid Access Token: ${message}`);
            } else if (status === 403) {
                throw new ForbiddenError('User does not have permission to access the specified account.');
            }
        } catch (err) {
            throw new ServerError(`Unexpected Server Error: ${message}`);
        }
    }

    
    // Partially update watchlist for a specific account: change watchlist name,
    // add to the beginning/end of a watchlist, update or delete items in a watchlist.
    // This method does not verify that the symbol or asset type are valid.
    const updateWatchlist = async (accountId, watchlist) => {

        const token = await TokenService.getAccessToken();

        const options = {
            method: 'PATCH',
            url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` },
            data: watchlist,
            validateStatus: function (status) {
                return status === 200 || status === 204 || status === 400 || status === 401 || status === 403;
            }
        };

        try {
            const response = await axios(options);
            const status = response.status;
            const message = response.message;
            if (status === 200 || status === 204) {
                return response.data;
            } else if (status === 400) {
                throw new InvalidRequestError(`Invalid Request: ${message}`);
            } else if (status === 401) {
                throw new UnauthorizedTokenError(`Invalid Access Token: ${message}`);
            } else if (status === 403) {
                throw new ForbiddenError('User does not have permission to access the specified account.');
            }
        } catch (err) {
            throw new ServerError(`Unexpected Server Error: ${message}`);
        }
    }

    // DELETE /foliomon/accounts/:accountId/watchlists/:watchlistId
    // Delete Specific watchlist for a specific account from the TD API
    const deleteWatchlist = async (accountId, watchlistId) => {

        const token = await TokenService.getAccessToken();

        const options = {
            method: 'DELETE',
            url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists/${watchlistId}`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` },
            validateStatus: function (status) {
                return status === 200 || status === 204 || status === 400 || status === 401 || status === 403;
            }
        };

        try {
            const response = await axios(options);
            const status = response.status;
            const message = response.message;
            if (status === 200 || status === 204) {
                return response.data;
            } else if (status === 400) {
                throw new InvalidRequestError(`Invalid Request: ${message}`);
            } else if (status === 401) {
                throw new UnauthorizedTokenError(`Invalid Access Token: ${message}`);
            } else if (status === 403) {
                throw new ForbiddenError('User does not have permission to access the specified account.');
            }
        } catch (err) {
            throw new ServerError(`Unexpected Server Error: ${message}`);
        }
    }

}

/*=============================================================================
Watchlist database service methods
=============================================================================*/

const db = function() {
    
    // Fetch all watchlists of all accounts from the database
    const getWatchlists = function () {
        return Watchlist.find().exec()
            .then(function (foundWatchlists) {
                if (foundWatchlists && (foundWatchlists.length > 0)) {
                    return foundWatchlists;
                } else {
                    //throw new NotFoundError('No watchlists found in database.');
                    return []; // 200 OK when accounts dont have any watchlists
                }
            })
            .catch(function (err) {
                throw new ServerError('Error fetching all watchlists from database.');
            });
    }

    // Fetch watchlists of one account from the database
    const getAccountWatchlists = function (accountId) {
        if(accountId) {
            return Watchlist.findOne({ accountId: accountId }).exec()
                .then(function (foundWatchlists) {
                    if (foundWatchlists && (foundWatchlists.length > 0)) {
                        return foundWatchlists;
                    } else {
                        //throw new NotFoundError(`Error No watchlists found in database for account id ${accountId}.`);
                        return []; // 200 OK when account doesnt have any watchlist
                    }
                })
                .catch(function (err) {
                    throw new ServerError(`Error fetching watchlists from database for account id ${accountId}.`);
                });
        } else {
            throw new InvalidRequestError(`Invalid account id: ${accountId}`);
        }
    }

    // Fetch specific watchlist of one account from the database
    const getWatchlist = function (accountId, watchlistId) {
        if (accountId && watchlistId) {        
            return Watchlist.findOne({ accountId: accountId, watchlistId: watchlistId }).exec()
                .then(function (foundWatchlist) {
                    if (foundWatchlist) {
                        return foundWatchlist;
                    } else {                    
                        throw new NotFoundError(`Error No watchlist found in database for account id ${accountId} with watchlist id ${watchlistId}.`);
                    }
                })
                .catch(function (err) {
                    throw new ServerError(`Error fetching watchlist from database for account id ${accountId} with watchlist id ${watchlistId}.`);
                });
        } else {
            throw new InvalidRequestError(`Invalid Request: account id: ${accountId} watchlist id: ${watchlistId}`);
        }            
    }    

    // Create one or more watchlists of one or more accounts into the database
    const createWatchlists = function (watchlists) {
        if (watchlists) {          
            return Watchlist.create(watchlists)
                .then(function (createdWatchlists) {
                    return createdWatchlists;
                })
                .catch(function (err) {
                    throw new ServerError(`Error creating watchlist(s) in database: ${err}`);
                });
        } else {
            throw new InvalidRequestError(`Invalid Request: watchlists: ${watchlists}`);
        }              
    }

    // Replace Specific watchlist for a specific account with the TD API
    // does not verify that the symbol or asset type are valid.
    const replaceWatchlist = function (watchlist) {
        if (watchlist) {  
            let filter = { accountId: watchlist.accountId, watchlistId: watchlist.watchlistId };

            let replacement = watchlist;
            replacement.updateDate = new Date(); // date time now

            let options = {
                omitUndefined: true
            };

            return Watchlist.findOneAndReplace(filter, replacement, options).exec()
                .then(function (replacedWatchlist) {
                    return replacedWatchlist;
                })
                .catch(function (err) {
                    throw new ServerError(`Error replacing watchlist in database: ${err}`);
                });
        } else {
            throw new InvalidRequestError(`Invalid Request: watchlist: ${watchlist}`);
        }                   
    }

    // Partially update watchlist for a specific account: change watchlist name,
    // add to the beginning/end of a watchlist, update or delete items in a watchlist.
    // This method does not verify that the symbol or asset type are valid.
    const updateWatchlist = function (watchlist) {
        if (watchlist) {
            let conditions = { accountId: watchlist.accountId, watchlistId: watchlist.watchlistId };

            let update = watchlist;
            update.updateDate = new Date(); // date time now

            let options = {
                new: true,
                upsert: true
            };

            return Watchlist.findOneAndUpdate(conditions, update, options).exec()
                .then(function (updatedWatchlist) {
                    return updatedWatchlist;
                })
                .catch(function (err) {
                    throw new ServerError(`Error updating watchlist in database: ${err}`);
                });
        } else {
            throw new InvalidRequestError(`Invalid Request: watchlist: ${watchlist}`);
        }
    }    

    // Delete all watchlists from the database
    const deleteWatchlists = function () {
        return Watchlist.deleteMany()
            .then((deletedWatchlists) => {
                if (deletedWatchlists) {
                    return deletedWatchlists;
                } else {
                    //throw new NotFoundError('No watchlists found in database.');
                    return []; // 200 OK when accounts dont have any watchlists
                }
            })
            .catch(function (err) {
                throw new ServerError(`Error deleting all watchlists from database: ${err}`);
            });
    }

    // Delete all watchlists of a specific account from the database
    const deleteAccountWatchlists = function (accountId) {
        if (accountId) {
            return Watchlist.deleteMany({ accountId: accountId }).exec()
                .then(function (deletedWatchlists) {
                    if (deletedWatchlists) {
                        return deletedWatchlists;
                    } else {
                        //throw new NotFoundError(`Error No watchlists found in database for account id ${accountId}.`);
                        return []; // 200 OK when account doesnt have any watchlist
                    }
                })
                .catch(function (err) {
                    throw new ServerError(`Error deleting account watchlists from database: ${err}`);
                });
        } else {
            throw new InvalidRequestError(`Invalid Request: account id: ${accountId}`);
        }  
    }     

    // Delete watchlist for a specific account from the database
    const deleteWatchlist = function (accountId, watchlistId) {
        if (accountId && watchlistId) {
            return Watchlist.deleteOne({ accountId: accountId, watchlistId: watchlistId }).exec()
                .then(function (foundWatchlist) {
                    if (foundWatchlist) {
                        console.log(`watchlistService.deleteAccountById Found account to delete: ${foundWatchlist}`);
                    } else {
                        console.log(`Error in watchlistService.deleteAccountById No account id ${accountId} found in database.`);
                    }
                })
                .catch(function (err) {
                    console.log(`Error in watchlistService.deleteAccountById deleting account from database: ${err}`);
                });
        } else {
            console.log(`Error in watchlistService.deleteAccountById deleting account from database: invalid account id ${accountId}`);
        }
    }    

}

exports.api = api;
exports.db = db;