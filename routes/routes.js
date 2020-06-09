const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/config.js');
const isProdMode = config.app.mode === 'production';

const jwtAuth = passport.authenticate('jwt', { session: false });

// pass thru middleware function bypass auth
const noAuth = function (req, res, next) { return next(); };
const requireJwt = isProdMode ? jwtAuth : noAuth;

const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');
const orderController = require('../controllers/orderController');
const watchlistController = require('../controllers/watchlistController');
const userController = require('../controllers/userController');
const marketDataController = require('../controllers/marketDataController');
const transactionController = require('../controllers/transactionController');

router.get('/testjwt', requireJwt, function (req, res) {
    res.send({ testjwt: 'ok' });
});

/*=============================================================================
TD API Authentication routes
=============================================================================*/

// Get a new Access Token and new Refresh Token from TD using an auth code obtained after logging in
router.get('/authorize', requireJwt, authController.postAccessToken);

// Get a new Access Token and new Refresh Token from TD using the valid Refresh Token from database
router.get('/reauthorize', requireJwt, authController.postAccessToken);

// Get the Access Token stored in the database
router.get('/accesstoken', requireJwt, authController.getAccessToken);

// Get the Refresh Token stored in the database for testing
//router.get('/refreshtoken', requireJwt, authController.getRefreshToken);

/*=============================================================================
TD API Account routes
=============================================================================*/

// Get all of the user's linked accounts from TD API
// Delete all accounts in the database
// Save accounts from TD into the database and send them back on the response to the client
router.post('/accounts/reset', requireJwt, accountController.resetAccounts);

// Get all accounts available from the TD api
router.get('/accounts', requireJwt, accountController.getAccounts);

// Get one account from the TD api
router.get('/accounts/:accountId', requireJwt, accountController.getAccount);

// Get one account with positions from TD api
router.get('/accounts/:accountId/positions', requireJwt, accountController.getAccountPositions);

// Get one account with orders from TD api
router.get('/accounts/:accountId/orders', requireJwt, accountController.getAccountOrders);

/*=============================================================================
TD API Orders routes
=============================================================================*/

// Get all orders of all of the user's linked accounts from TD API
// Delete all orders in the database
// Save orders from TD into the database and send them back on the response to the client
router.post('/orders/reset', requireJwt, orderController.resetOrders);

// Get all orders of all of the user's linked accounts from TD API
router.get('/orders', requireJwt, orderController.getOrders);

// Get all orders of one single account from TD API
router.get('/orders/:accountId', requireJwt, orderController.getAccountOrders);

// Get Specific order of a specific account from TD API
router.get('/orders/:accountId/:orderId', requireJwt, orderController.getOrder);

// Place a new order in a specific account with TD API
router.post('/orders/:accountId', requireJwt, orderController.placeOrder);

// Replace an existing order in a specific account with TD API
router.put('/orders/:accountId/:orderId', requireJwt, orderController.replaceOrder);

// Cancel an order of a specific account with TD API
router.delete('/orders/:accountId/:orderId', requireJwt, orderController.cancelOrder);

/*=============================================================================
TD API Watchlist routes
=============================================================================*/

// Get all watchlists of all of the user's linked accounts from TD API
// Delete all watchlists in the database
// Save watchlists from TD into the database and send them back on the response to the client
router.post('/watchlists/reset', requireJwt, watchlistController.resetWatchlists);

// Get all watchlists of all of the user's linked accounts from TD API
router.get('/watchlists', requireJwt, watchlistController.getWatchlists);

// Get all watchlists of one single account from TD API
router.get('/watchlists/:accountId', requireJwt, watchlistController.getAccountWatchlists);

// Get Specific watchlist of a specific account from TD API
router.get('/watchlists/:accountId/:watchlistId', requireJwt, watchlistController.getWatchlist);

// Create a new watchlist in a specific account with TD API
router.post('/watchlists/:accountId', requireJwt, watchlistController.createWatchlist);

// Replace an existing watchlist in a specific account with TD API
router.put('/watchlists/:accountId/:watchlistId', requireJwt, watchlistController.replaceWatchlist);

// Partially update watchlist of a specific account with TD API
router.patch('/watchlists/:accountId/:watchlistId', requireJwt, watchlistController.updateWatchlist);

// Delete specific watchlist of a specific account with TD API
router.delete('/watchlists/:accountId/:watchlistId', requireJwt, watchlistController.deleteWatchlist);

/*=============================================================================
TD API User Info and Preferences routes
=============================================================================*/

// Get User Principals
router.get('/user', requireJwt, userController.getUserPrincipals);

// Get Streamer Subscription Keys
router.post('/user/sub', requireJwt, userController.getStreamerSubscriptionKeys);

/*=============================================================================
TD API Market Data routes
=============================================================================*/

// Get Todays Market Hours or one specific market e.g. 'EQUITY'
router.get('/marketdata/hours/:market', requireJwt, marketDataController.getMarketHours);

// Search or retrieve instrument data, including fundamental data on multiple symbols
router.post('/marketdata/instruments', requireJwt, marketDataController.getInstruments);

// Get chart data, price history
router.post('/marketdata/pricehistory', requireJwt, marketDataController.getPriceHistory);

// Get all available daily price and volume OHLC chart data for 20 years including today 
router.get('/marketdata/pricehistory/:symbol/daily', requireJwt, marketDataController.getDailyPriceHistory);

// Get all available minute price and volume OHLC chart data for 10 days including today 
router.get('/marketdata/pricehistory/:symbol/minute', requireJwt, marketDataController.getMinutePriceHistory);

// Get top 10 (up or down) movers by value or percent for a particular market
router.post('/marketdata/movers', requireJwt, marketDataController.getMovers);

// Get realtime quote for one or more symbols
router.post('/marketdata/quotes', requireJwt, marketDataController.getQuotes);

// Get realtime quote for one symbol
router.get('/marketdata/:symbol/quotes/', requireJwt, marketDataController.getQuote);

// Get delayed quote for one or more symbols
router.post('/marketdata/delayed', requireJwt, marketDataController.getDelayedQuotes);

// Get delayed quote for one symbol
router.get('/marketdata/:symbol/delayed/', requireJwt, marketDataController.getDelayedQuote);

/*=============================================================================
TD API Transaction History routes
=============================================================================*/

// Get transactions of one single account from TD API
router.get('/transactions/:accountId/:months', requireJwt, transactionController.getAccountTransactions);

// Get one transaction of an account from TD API
router.get('/transactions/:accountId/:transactionId', requireJwt, transactionController.getTransaction);

module.exports = router;