const config = require('../config/config.js');
const axios = require('axios');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('./errors/ServiceErrors');
const AuthService = require('./AuthService');
const Watchlist = require('../models/Watchlist');

/*=============================================================================
TD API Watchlist endpoint wrappers service methods

https://developer.tdameritrade.com/watchlist/apis
=============================================================================*/

const api = {

    // Get all watchlists for all of the user's linked accounts from the TD API
    // https://developer.tdameritrade.com/watchlist/apis/get/accounts/watchlists-0
    getWatchlists: async () => {
        try {
            const token = await AuthService.getAccessToken();
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
    // https://developer.tdameritrade.com/watchlist/apis/get/accounts/%7BaccountId%7D/watchlists-0
    getAccountWatchlists: async (accountId) => {
        try {
            const token = await AuthService.getAccessToken();
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
    // https://developer.tdameritrade.com/watchlist/apis/get/accounts/%7BaccountId%7D/watchlists/%7BwatchlistId%7D-0
    getWatchlist: async (accountId,watchlistId) => {
        try {
            const token = await AuthService.getAccessToken();
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
    // https://developer.tdameritrade.com/watchlist/apis/post/accounts/%7BaccountId%7D/watchlists-0
    createWatchlist: async (accountId, watchlist) => {
        try {
            const token = await AuthService.getAccessToken();
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
    // https://developer.tdameritrade.com/watchlist/apis/put/accounts/%7BaccountId%7D/watchlists/%7BwatchlistId%7D-0
    replaceWatchlist: async (accountId, watchlistId, watchlist) => {
        try {
            const token = await AuthService.getAccessToken();
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
    // https://developer.tdameritrade.com/watchlist/apis/patch/accounts/%7BaccountId%7D/watchlists/%7BwatchlistId%7D-0
    updateWatchlist: async (accountId, watchlistId, watchlist) => {
        try {
            const token = await AuthService.getAccessToken();
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
            const token = await AuthService.getAccessToken();
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

    // Controller will Get all watchlists of all of the user's linked accounts from TD API
    // This reset function is intended to delete all watchlists in the database
    // then save the lastest watchlists from TD into the database 
    resetWatchlists: async (watchlists) => {
        try {
            let deleteManyResult = await Watchlist.deleteMany();
            let createResult = await Watchlist.create(watchlists);
        } catch (err) {
            throw err;
        }
    },

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
            if (!accountId) {
                throw new BadRequestError(`Error fetching watchlists from database for account`);
            }
            try {   
                foundWatchlists = await Watchlist.find({ accountId: accountId });
                if (foundWatchlists && (foundWatchlists.length > 0)) {
                    return foundWatchlists;
                } else {
                    return []; // no watchlists on account
                } 
            } catch (err) {
                throw new InternalServerError(`Error fetching watchlists from database for account and watchlistId: ${err.message}`);
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
                    throw new InternalServerError(`Error fetching watchlist from database for account and watchlistId: ${err.message}`);
                }
                if (foundWatchlist) {
                    return foundWatchlist;
                } else {                            
                    throw new NotFoundError(`Error watchlist Not Found in database for account and watchlistId.`);
                }
            } else {
                throw new BadRequestError(`Error getting watchlist from database for accountId and watchlistId.`);
            }         
        } catch(err) {
            throw err;
        }
    },    

    // Create one watchlist on one account in the database
    createWatchlist: async (watchlist) => {        
        try {      
            let result = null;
            return result = await Watchlist.create(watchlist);
        } catch (err) {
            if (err.name === 'ValidationError') {
                throw new BadRequestError(`Error creating watchlist in database validation: ${err.message}`);
            } else {
                throw new InternalServerError(`Error creating watchlist in database: ${err.message}`);
            }
        }  
    },

    // Replace Specific watchlist for a specific account in the database
    // does not verify that the symbol or asset type are valid.
    replaceWatchlist: async (accountId, watchlistId, watchlist) => {        
        try {
            if (accountId && watchlistId && watchlist && (accountId === watchlist.accountId) && (watchlistId === watchlist.watchlistId)) { 
                let filter = { accountId: accountId, watchlistId: watchlistId };
                let replacement = watchlist;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await Watchlist.replaceOne(filter, replacement, options);
                    // matched and replaced only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('Watchlist for account with watchlistId specified Not Found in database.');
                    }                    
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error replacing watchlist in database for accountId and watchlistId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error replacing watchlist in database: ${err.message}`);
                    }
                }                                                    
            } else {
                throw new BadRequestError(`Error replacing watchlist in database for accountId and watchlistId.`);
            }
        } catch (err) {
            throw err;
        }                   
    },

    // Partially update watchlist for a specific account in the database, change watchlist name,
    // add to the beginning/end of a watchlist, update or delete items in a watchlist.
    // This method does not verify that the symbol or asset type are valid.
    updateWatchlist: async (accountId, watchlistId, watchlist) => {
        try {
            if (accountId && watchlistId && watchlist && (accountId === watchlist.accountId) && (watchlistId === watchlist.watchlistId)) {
                let filter = { accountId: accountId, watchlistId: watchlistId };
                let update = watchlist;
                let options = {
                    new: true,
                    upsert: false,
                    omitUndefined: true
                };
                let result = null;
                try {
                    result = await Watchlist.updateOne(filter, update, options);                    
                    // matched and updated only 1 document
                    if (result.n === 1 && result.nModified === 1) {
                        return result;
                    } else {
                        throw new NotFoundError('Watchlist for account with watchlistId specified Not Found in database.');
                    }
                } catch (err) {
                    if (err.name === 'ValidationError') {
                        throw new BadRequestError(`Error updatng watchlist in database for accountId and watchlistId: ${err.message}`);
                    } else if (err.name === 'NotFoundError') {
                        throw err;
                    } else {
                        throw new InternalServerError(`Error updatng watchlist in database: ${err.message}`);
                    }
                }
            } else {
                throw new BadRequestError(`Error updatng watchlist in database invalid accountId or watchlistId or watchlist object.`);
            }
        } catch (err) {
            throw err;
        }   
    },    

    // Delete all watchlists from the database
    deleteWatchlists: async () => {
        let result = null;
        try {
            result = await Watchlist.deleteMany();
            return result;
        } catch(err) {
            throw new InternalServerError(`Error deleting all watchlists from database: ${err.message}`);
        }
    },

    // Delete all watchlists of a specific account from the database
    deleteAccountWatchlists: async (accountId) => {
        let result = null;
        try {
            if (accountId) {
                try {
                    result = await Watchlist.deleteMany({ accountId: accountId });
                    return result;
                } catch (err) {
                    throw new InternalServerError(`Error deleting account watchlists from database: ${err.message}`);
                }                
            } else {
                throw new BadRequestError(`Error deleting account watchlists from database invalid accountId.`);
            }  
        } catch (err) {
            throw err;
        }
    },     

    // Delete watchlist for a specific account from the database
    deleteWatchlist: async (accountId, watchlistId) => {
        try {
            if (accountId && watchlistId) {
                let result = await Watchlist.deleteOne({ accountId: accountId, watchlistId: watchlistId });
                if (result.n === 1 && result.nModified === 1) {
                    return result;
                } else {
                    throw new NotFoundError(`Error deleting watchlist Not Found in database for accountId and watchlistId.`);
                }
            } else {
                throw new BadRequestError(`Error deleting watchlist from database invalid accountId or watchlistId.`);
            }
        } catch (err) {
            throw err;
        }
    }
};

module.exports.api = api;
module.exports.db = db;