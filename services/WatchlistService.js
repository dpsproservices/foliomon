const config = require('../config/config.js');
const axios = require('axios');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('./errors/ServiceErrors');
const TokenService = require('./TokenService');
const Watchlist = require('../models/Watchlist');

/*=============================================================================
TD API Watchlist endpoint wrappers service methods

https://developer.tdameritrade.com/watchlist/apis
=============================================================================*/

const api = {

    // Get all watchlists for all of the user's linked accounts from the TD API
    getWatchlists: async () => {
        try {
            const token = await TokenService.getAccessToken();

            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/watchlists`,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 401 || status === 503;
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
            } else if (status === 503) {
                throw new ServiceUnavailableError(message);
            } else {            
                throw new InternalServerError(message);
            }
        } catch(err) {
            throw err;
        }          
    },

    // Get Watchlists of Single Account from the TD API
    getAccountWatchlists: async (accountId) => {
        try {
            const token = await TokenService.getAccessToken();

            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists`,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                validateStatus: function (status) {
                    return status === 200 || status === 401 || status === 403 || status === 503;
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
            } else if (status === 503) {
                throw new ServiceUnavailableError(message);
            } else {   
                throw new InternalServerError(message);
            }
        } catch(err) {
            throw err;
        }          
    },

    // Get specific watchlist of a specific account from the TD API
    getWatchlist: async (accountId,watchlistId) => {
        try {
            const token = await TokenService.getAccessToken();

            const options = {
                method: 'GET',
                url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists/${watchlistId}`,
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
                throw new InternalServerError(message);
            }
        } catch(err) {
            throw err;
        }          
    },

    // Create Specific watchlist of a specific account with the TD API
    // does not verify that the symbol or asset type are valid.
    createWatchlist: async (accountId, watchlist) => {
        try {
            const token = await TokenService.getAccessToken();

            const options = {
                method: 'POST',
                url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists`,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                data: watchlist,
                validateStatus: function (status) {
                    return status === 201 || status === 400 || status === 401 || status === 403 || status === 503;
                }
            };

            const response = await axios(options);
            console.log({response});
            const status = response.status;
            const message = response.data.error;
            if (status === 201) {
                return response;
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
        } catch(err) {
            throw err;
        }           
    },

    // Replace an existing watchlist in a specific account with the TD API
    // does not verify that the symbol or asset type are valid.
    replaceWatchlist: async (accountId, watchlistId, watchlist) => {
        try {
            const token = await TokenService.getAccessToken();
            const options = {
                method: 'PUT',
                url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists/${watchlistId}`,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                data: watchlist,
                validateStatus: function (status) {
                    return status === 204 || status === 400 || status === 401 || status === 403 || status === 404 || status === 503;
                }
            };

            const response = await axios(options);
            const status = response.status;
            const message = response.data.error;
            if (status === 204) {
                return response;
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
        } catch(err) {
            throw err;
        }          
    },

    // Partially update watchlist of a specific account: change watchlist name,
    // add to the beginning/end of a watchlist, update or delete items in a watchlist.
    // This method does not verify that the symbol or asset type are valid.
    updateWatchlist: async (accountId, watchlistId, watchlist) => {
        try {
            const token = await TokenService.getAccessToken();
            const options = {
                method: 'PATCH',
                url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists/${watchlistId}`,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                data: watchlist,
                validateStatus: function (status) {
                    return status === 204 || status === 400 || status === 401 || status === 403 || status === 404 || status === 503;
                }
            };

            const response = await axios(options);
            const status = response.status;
            const message = response.data.error;
            if (status === 204) {
                return response;
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
        } catch(err) {
            throw err;
        }         
    },

    // Delete specific watchlist of a specific account from the TD API
    deleteWatchlist: async (accountId, watchlistId) => {
        try {
            const token = await TokenService.getAccessToken();

            const options = {
                method: 'DELETE',
                url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists/${watchlistId}`,
                headers: { 'Authorization': `Bearer ${token.accessToken}` },
                validateStatus: function (status) {
                    return status === 204 || status === 400 || status === 401 || status === 403 || status === 404 || status === 503;
                }
            };

            const response = await axios(options);
            const status = response.status;
            const message = response.data.error;
            if (status === 204) {
                return response;
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
        } catch(err){
            throw err;
        } 
    }

};

/*=============================================================================
Watchlist database service methods
=============================================================================*/

const db = {
    
    // Fetch all watchlists of all accounts from the database
    getWatchlists: async () => {
        try {
            const foundWatchlists = await Watchlist.find();
            
            if (foundWatchlists && (foundWatchlists.length > 0)) {
                return foundWatchlists;
            } else {
                return [];
            }
        } catch(err) {
            throw new InternalServerError(`Error fetching all watchlists from database: ${err.message}`);
        }
    },

    // Fetch watchlists of one account from the database
    getAccountWatchlists: async (accountId) => {       
        let foundWatchlists = null;
        try {      
            if (accountId) {
                try {   
                    foundWatchlists = await Watchlist.find({ accountId: accountId });
                } catch (err) {
                    throw new InternalServerError(`Error fetching watchlists from database for accountId ${accountId} watchlistId ${watchlistId}: ${err.message}`);
                }
                if (foundWatchlists && (foundWatchlists.length > 0)) {
                    return foundWatchlists;
                } else {
                    return []; // no watchlists on account
                }         
            } else {
                throw new BadRequestError(`Error fetching watchlists from database for accountId ${accountId}`);
            }         
        } catch(err) {
            throw err;
        }
    },

    // Fetch specific watchlist of one account from the database
    getWatchlist: async (accountId, watchlistId) => {
        let foundWatchlist = null;
        try {
            if (accountId && watchlistId) {          
                try {         
                    foundWatchlist = await Watchlist.findOne({ accountId: accountId, watchlistId: watchlistId });
                } catch (err) {
                    throw new InternalServerError(`Error fetching watchlist from database for accountId ${accountId} watchlistId ${watchlistId}: ${err.message}`);
                }
                if (foundWatchlist) {
                    return foundWatchlist;
                } else {                    
                    throw new NotFoundError(`Error watchlist Not Found in database for accountId ${accountId} watchlistId ${watchlistId}.`);
                }
            } else {
                throw new BadRequestError(`Error getting watchlist from database for accountId: ${accountId} watchlistId: ${watchlistId}`);
            }         
        } catch(err) {
            throw err;
        }
    },    

    // Create one watchlist on one account in the database
    createWatchlist: async (watchlist) => {
        let createdWatchlist = null;
        try {
            if (watchlist) {          
                try {
                    return createdWatchlist = await Watchlist.create(watchlist);
                } catch(err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error creating watchlist in database: ${err.message}`);
                    } else {
                        throw new InternalServerError(`Error creating watchlist in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error creating watchlist in database: ${watchlist}`);
            }       
        } catch (err) {
            throw err;
        }  
    },

    // Replace Specific watchlist for a specific account with the TD API
    // does not verify that the symbol or asset type are valid.
    replaceWatchlist: async (accountId, watchlistId, watchlist) => {
        let replacedWatchlist = null;
        try {
            if (accountId && watchlistId && watchlist && (accountId === watchlist.accountId) && (watchlistId === watchlist.watchlistId)) { 
                let filter = { accountId: accountId, watchlistId: watchlistId };

                let replacement = watchlist;

                let options = {
                    new: true,
                    omitUndefined: true
                };
                try {
                    replacedWatchlist = await Watchlist.findOneAndReplace(filter, replacement, options);
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error replacing watchlist in database for accountId ${accountId} watchlistId ${watchlistId}: ${err.message}`);
                    } else {                    
                        throw new InternalServerError(`Error replacing watchlist in database: ${err.message}`);
                    }
                } 
                if (replacedWatchlist) {
                    return replacedWatchlist;
                } else {
                    throw new NotFoundError(`Error watchlist Not Found in database for accountId ${accountId} watchlistId ${watchlistId}.`); 
                }                    
            } else {
                throw new BadRequestError(`Error replacing watchlist in database for accountId ${accountId} watchlistId ${watchlistId} watchlist: ${watchlist}`);
            }
        } catch (err) {
            throw err;
        }                   
    },

    // Partially update watchlist for a specific account: change watchlist name,
    // add to the beginning/end of a watchlist, update or delete items in a watchlist.
    // This method does not verify that the symbol or asset type are valid.
    updateWatchlist: async (accountId, watchlistId, watchlist) => {
        let updatedWatchlist = null;
        try {
            if (accountId && watchlistId && watchlist && (accountId === watchlist.accountId) && (watchlistId === watchlist.watchlistId) ) {
                let conditions = { accountId: accountId, watchlistId: watchlistId };

                let update = watchlist;

                let options = {
                    new: true,
                    omitUndefined: true
                };
                try {
                    updatedWatchlist = await Watchlist.findOneAndUpdate(conditions, update, options);
                } catch(err){
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error updating watchlist in database for accountId ${accountId} watchlistId ${watchlistId}: ${err.message}`);
                    } else {
                        throw new InternalServerError(`Error updating watchlist in database: ${err.message}`);
                    }                    
                }
                if(updatedWatchlist) {
                    return updatedWatchlist;
                } else {
                    throw new InternalServerError(`Error updating watchlist in database: ${err.message}`);
                }
            } else {
                throw new BadRequestError(`Error updating watchlist in database for accountId ${accountId} watchlistId ${watchlistId} watchlist: ${watchlist}`);
            }
        } catch (err) {
            throw err;
        }  
    },    

    // Delete all watchlists from the database
    deleteWatchlists: async () => {
        let deletedWatchlists = null;
        try {
            deletedWatchlists = await Watchlist.deleteMany();

            if (deletedWatchlists) {
                return deletedWatchlists;
            } else {
                //throw new NotFoundError('No watchlists found in database.');
                return []; // 200 OK when accounts dont have any watchlists
            }
        } catch(err) {
            throw new InternalServerError(`Error deleting all watchlists from database: ${err.message}`);
        }
    },

    // Delete all watchlists of a specific account from the database
    deleteAccountWatchlists: async (accountId) => {
        let deletedWatchlists = null;
        try {
            if (accountId) {
                try {
                    deletedWatchlists = await Watchlist.deleteMany({ accountId: accountId });
                } catch (err) {
                    throw new InternalServerError(`Error deleting account watchlists from database for accountId ${accountId}: ${err.message}`);
                }
                if (deletedWatchlists) {
                    return deletedWatchlists;
                } else {
                    //throw new NotFoundError(`Error No watchlists found in database for accountId ${accountId}.`);
                    return []; // 200 OK when account doesnt have any watchlist
                }                    
            } else {
                throw new BadRequestError(`Error deleting account watchlists from database for accountId ${accountId}`);
            }  
        } catch (err) {
            throw err;
        }
    },     

    // Delete watchlist for a specific account from the database
    deleteWatchlist: async (accountId, watchlistId) => {
        let deletedWatchlist = null;
        try {
            if (accountId && watchlistId) {
                try {
                    deletedWatchlist = await Watchlist.deleteOne({ accountId: accountId, watchlistId: watchlistId });
                } catch (err) {
                    throw new InternalServerError(`Error deleting watchlist from database for accountId ${accountId} watchlistId ${watchlistId}: ${err.message}`);
                }
                if (deletedWatchlist) {
                    return deletedWatchlist;
                } else {
                    throw new NotFoundError(`Error deleting watchlist Not Found in database for accountId ${accountId} watchlistId ${watchlistId}.`);
                }
            } else {
                throw new BadRequestError(`Error deleting watchlist from database for accountId: ${accountId} watchlistId ${watchlistId}.`);
            }
        } catch (err) {
            throw err;
        }
    },

    // Controller functions to call this after getting watchlist(s) data from TD API
    // to persist the latest version of the data from TD into the database
    refreshWatchlists: async (watchlists) => {
        try {
            let deleteManyResult = await Watchlist.deleteMany();
            let createResult = await Watchlist.create(watchlists);
        } catch (err) {
            throw err;
        }
    }
};

module.exports.api = api;
module.exports.db = db;