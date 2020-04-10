const config = require('../config/config.js');
const axios = require('axios');
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
            headers: { 'Authorization': `Bearer ${token.accessToken}` }
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (err) {
            const message = response.message;
            console.log(`Error in watchlistApiService.getWatchlists: ${message}`);
            throw new Error(`Error in getWatchlists: ${message}`);
        }
    };

    // Get Watchlists for Single Account from the TD API
    const getAccountWatchlists = async (accountId) => {

        const token = await TokenService.getAccessToken();

        const options = {
            method: 'GET',
            url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` }
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (err) {
            const message = response.message;
            console.log(`Error in watchlistApiService.getAccountWatchlists: ${message}`);
            throw new Error(`Error in getAccountWatchlists: ${message}`);
        }
    }

    // Get Specific watchlist for a specific account from the TD API
    const getWatchlist = async (accountId,watchlistId) => {

        const token = await TokenService.getAccessToken();

        const options = {
            method: 'GET',
            url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists/${watchlistId}`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` }
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (err) {
            const message = response.message;
            console.log(`Error in watchlistApiService.getApiWatchlist: ${message}`);
            throw new Error(`Error in getApiWatchlist: ${message}`);
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
            data: watchlist
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (err) {
            const message = response.message;
            console.log(`Error in createWatchlist: ${message}`);
            throw new Error(`Error in createWatchlist: ${message}`);
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
            data: watchlist
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (err) {
            const message = response.message;
            console.log(`Error in replaceWatchlist: ${message}`);
            throw new Error(`Error in replaceWatchlist: ${message}`);
        }
    }

    /*
    Partially update watchlist for a specific account: change watchlist name,
    add to the beginning/end of a watchlist, update or delete items in a watchlist.
    This method does not verify that the symbol or asset type are valid.
    */
    const updateWatchlist = async (accountId, watchlist) => {

        const token = await TokenService.getAccessToken();

        /*
        const updatedWatchlist = {
            name: string,
            watchlistId: string,
            watchlistItems: [
                {
                    //quantity: 0,
                    //averagePrice: 0,
                    //commission: 0,
                    //purchasedDate: DateParam\,
                    instrument: {
                        symbol: 'TEST1',
                        assetType: 'EQUITY'
                    },
                    sequenceId: 0 // likely this sequence index which determines specific watchlist item to update
                },
                {
                    instrument: {
                        symbol: 'TEST2',
                        assetType: 'EQUITY'
                    },
                    sequenceId: 1 // likely this sequence index which determines specific watchlist item to update
                }
            ]
        }
        */

        const options = {
            method: 'PATCH',
            url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` },
            data: watchlist
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (err) {
            const message = response.message;
            console.log(`Error in updateWatchlist: ${message}`);
            throw new Error(`Error in updateWatchlist: ${message}`);
        }
    }

    // Delete Specific watchlist for a specific account from the TD API
    const deleteWatchlist = async (accountId, watchlistId) => {

        const token = await TokenService.getAccessToken();

        const options = {
            method: 'DELETE',
            url: `${config.auth.apiUrl}/accounts/${accountId}/watchlists/${watchlistId}`,
            headers: { 'Authorization': `Bearer ${token.accessToken}` }
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (err) {
            const message = response.message;
            console.log(`Error in watchlistApiService.deleteWatchlist: ${message}`);
            throw new Error(`Error in deleteWatchlist: ${message}`);
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
                    console.log('Error in watchlistService.getWatchlists No watchlists found in database.')
                    throw new Error('No watchlists found in database.');
                }
            })
            .catch(function (err) {
                throw new Error('Error fetching all watchlists from database.');
            });
    }

    // Fetch watchlists of one account from the database
    const getAccountWatchlists = function (accountId) {
        return Watchlist.findOne({ accountId: accountId }).exec()
            .then(function (foundWatchlists) {
                if (foundWatchlists && (foundWatchlists.length > 0)) {
                    return foundWatchlists;
                } else {
                    console.log(`Error in watchlistService.getAccountWatchlists No watchlists for account id ${accountId} found in database.`)
                    throw new Error(`Error No watchlists for account id ${accountId} found in database.`);
                }
            })
            .catch(function (err) {
                throw new Error(`Error fetching account watchlists for account id ${accountId} from database.`);
            });
    }

    // Save one or more watchlists of one or more accounts to the database
    const saveWatchlists = function (watchlists) {
        return Watchlist.create(watchlists)
            .then(function (result) {
                return result;
            })
            .catch(function (err) {
                throw new Error('Error saving watchlists to database.');
            });
    }

    // DELETE /foliomon/accounts/:accountId
    // Delete single Account by its accountId from the database
    const deleteWatchlist = function (accountId, watchlistId) {
        if (accountId && watchlistId) {
            Watchlist.deleteOne({ accountId: accountId, watchlistId: watchlistId }).exec()
                .then(function (foundWatchlist) {
                    if (foundWatchlist) {
                        console.log(`accountController.deleteAccountById Found account to delete: ${foundWatchlist}`);
                        res.status(200).send({ watchlist: foundWatchlist });
                    } else {
                        console.log(`Error in accountController.deleteAccountById No account id ${accountId} found in database.`);
                        res.status(404).send({ error: `No account id ${accountId} found in database.` });
                    }
                })
                .catch(function (err) {
                    console.log(`Error in accountController.deleteAccountById deleting account from database: ${err}`);
                    res.status(500).send({ error: `Error deleting account id ${accountId} from database.` });
                });
        } else {
            console.log(`Error in accountController.deleteAccountById deleting account from database: invalid account id ${accountId}`);
            res.status(404).send({ error: `Error invalid account id ${accountId}` });
        }
    }

    const updateWatchlist = function (watchlist) {

        let conditions = { accountId: watchlist.accountId, watchlistId: watchlist.watchlistId };

        let update = req.body;
        update.updateDate = new Date(); // date time now

        let options = {
            new: true,
            upsert: true
        };

        Watchlist.findOneAndUpdate(conditions, update, options).exec()
            .then(function (savedAccount) {
                console.log(`accountController.saveAccountById Saved account: ${savedAccount}`)
                res.status(200).send({ account: savedAccount })
            })
            .catch(function (err) {
                console.log(`Error in accountController.saveAccountById Unable to save account to database: ${err}`)
                res.status(500).send({ error: 'Unable to save account to database.' })
            });
    }

}

exports.api = api;
exports.db = db;

/*
exports.getWatchlists = getWatchlists;
exports.getAccountWatchlists = getAccountWatchlists;
exports.getWatchlist = getWatchlist;
exports.createWatchlist = createWatchlist;
exports.replaceWatchlist = replaceWatchlist;
exports.updateWatchlist = updateWatchlist;
exports.deleteWatchlist = deleteWatchlist;

exports.getWatchlists = getWatchlists;
exports.getAccountWatchlists = getAccountWatchlists;
exports.saveWatchlists = saveWatchlists;
*/