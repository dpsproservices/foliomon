const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');
const orderController = require('../controllers/orderController');
const watchlistController = require('../controllers/watchlistController');
const userController = require('../controllers/userController');
const marketDataController = require('../controllers/marketDataController');

/*=============================================================================
Authentication routes
=============================================================================*/

// get a new Access Token and new Refresh Token from TD using an auth code obtained after logging in
router.get('/foliomon/authorize', authController.postAccessToken);

// get a new Access Token and new Refresh Token from TD with a Refresh Token which hasnt expired
//router.get('/foliomon/reauthorize', authController.reauthorize);

// get the Access Token stored in the database
router.get('/foliomon/accesstoken', authController.getAccessToken);

// save the Access Token into the database
//router.put('/foliomon/accesstoken', authController.saveAccessToken);

// get the Reresh Token stored in the database
//router.get('/foliomon/refreshtoken', authController.getRefreshToken);

// save the Refresh Token into the database
//router.put('/foliomon/refreshtoken', authController.saveRefreshToken);

/*=============================================================================
Account routes
=============================================================================*/

// get all accounts available from the database
router.get('/foliomon/accounts', accountController.getAllAccounts);

// save multiple accounts into the database update them if they exist (upsert)
router.put('/foliomon/accounts', accountController.saveAccounts);

// delete all accounts from the database
router.delete('/foliomon/accounts', accountController.deleteAllAccounts);

// get all accounts from TD api save them to the database
router.get('/foliomon/accounts/refresh', accountController.refreshAccounts);

// get one account by its accountId from the database
router.get('/foliomon/accounts/:accountId', accountController.getAccountById);

// save one account by its accountId update it if it exists (upsert)
router.put('/foliomon/accounts/:accountId', accountController.saveAccountById);

// delete one account by its accountId from the database
router.delete('/foliomon/accounts/:accountId', accountController.deleteAccountById);

// get account with positions from TD api
router.get('/foliomon/accounts/:accountId/positions', accountController.getPositionsByAccountId);

// get account with orders from TD api
router.get('/foliomon/accounts/:accountId/orders', accountController.getOrdersByAccountId);

/*=============================================================================
Orders routes
=============================================================================*/

// Get all orders of all of the user's linked accounts from TD API
// Delete all orders in the database
// Save orders from TD into the database and send them back on the response to the client
router.post('/foliomon/orders/reset', orderController.resetOrders);

// Get all orders of all of the user's linked accounts from TD API
router.get('/foliomon/orders', orderController.getOrders);

// Get all orders of one single account from TD API
router.get('/foliomon/orders/:accountId', orderController.getAccountOrders);

// Get Specific order of a specific account from TD API
router.get('/foliomon/orders/:accountId/:orderId', orderController.getOrder);

// Place a new order in a specific account with TD API
router.post('/foliomon/orders/:accountId', orderController.placeOrder);

// Replace an existing order in a specific account with TD API
router.put('/foliomon/orders/:accountId/:orderId', orderController.replaceOrder);

// Delete specific order of a specific account with TD API
router.delete('/foliomon/orders/:accountId/:orderId', orderController.deleteOrder);

/*=============================================================================
Watchlist routes
=============================================================================*/

// Get all watchlists of all of the user's linked accounts from TD API
// Delete all watchlists in the database
// Save watchlists from TD into the database and send them back on the response to the client
router.post('/foliomon/watchlists/reset', watchlistController.resetWatchlists);

// Get all watchlists of all of the user's linked accounts from TD API
router.get('/foliomon/watchlists', watchlistController.getWatchlists);

// Get all watchlists of one single account from TD API
router.get('/foliomon/watchlists/:accountId', watchlistController.getAccountWatchlists);

// Get Specific watchlist of a specific account from TD API
router.get('/foliomon/watchlists/:accountId/:watchlistId', watchlistController.getWatchlist);

// Create a new watchlist in a specific account with TD API
router.post('/foliomon/watchlists/:accountId', watchlistController.createWatchlist);

// Replace an existing watchlist in a specific account with TD API
router.put('/foliomon/watchlists/:accountId/:watchlistId', watchlistController.replaceWatchlist);

// Partially update watchlist of a specific account with TD API
router.patch('/foliomon/watchlists/:accountId/:watchlistId', watchlistController.updateWatchlist);

// Delete specific watchlist of a specific account with TD API
router.delete('/foliomon/watchlists/:accountId/:watchlistId', watchlistController.deleteWatchlist);

/*=============================================================================
User Info and Preferences routes
=============================================================================*/

// Get User Principals
router.get('/foliomon/user', userController.getUserPrincipals);

// Get Streamer Subscription Keys
router.post('/foliomon/user/sub', userController.getStreamerSubscriptionKeys);

/*=============================================================================
Market Data routes
=============================================================================*/

// Get Todays Market Hours or one specific market e.g. 'EQUITY'
router.get('/foliomon/marketdata/hours/:market', marketDataController.getMarketHours);

// Search or retrieve instrument data, including fundamental data on multiple symbols
router.post('/foliomon/marketdata/instruments', marketDataController.getInstruments);

// Get chart data, price history
router.post('/foliomon/marketdata/pricehistory', marketDataController.getPriceHistory);

// Get top 10 (up or down) movers by value or percent for a particular market
router.post('/foliomon/marketdata/movers', marketDataController.getMovers);

// Get realtime quote for one or more symbols
router.post('/foliomon/marketdata/quotes', marketDataController.getQuotes);

// Get realtime quote for one symbol
router.get('/foliomon/marketdata/:symbol/quotes/', marketDataController.getQuote);

// Get delayed quote for one or more symbols
router.post('/foliomon/marketdata/delayed', marketDataController.getDelayedQuotes);

// Get delayed quote for one symbol
router.get('/foliomon/marketdata/:symbol/delayed/', marketDataController.getDelayedQuote);

module.exports = router;