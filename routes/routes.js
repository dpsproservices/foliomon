const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');
const orderController = require('../controllers/orderController');

// Authentication Controller Routes

// get a new Access Token and new Refresh Token from TD using an auth code obtained after logging in
router.get('/foliomon/authorize', authController.authorize);

// get a new Access Token and new Refresh Token from TD with a Refresh Token which hasnt expired
router.get('/foliomon/reauthorize', authController.reauthorize);

// get the Access Token stored in the database
router.get('/foliomon/accesstoken', authController.getAccessToken);

// save the Access Token into the database
router.put('/foliomon/accesstoken', authController.saveAccessToken);

// get the Reresh Token stored in the database
router.get('/foliomon/refreshtoken', authController.getRefreshToken);

// save the Refresh Token into the database
router.put('/foliomon/refreshtoken', authController.saveRefreshToken);

// Account Controller Routes

// get one account by its accountId from the database
router.get('/foliomon/accounts/:accountId', accountController.getAccountById);

// get all accounts available from the database
router.get('/foliomon/accounts', accountController.getAllAccounts);

// save one account by its accountId update it if it exists (upsert)
router.put('/foliomon/accounts/:accountId', accountController.saveAccountById);

// save multiple accounts into the database update them if they exist (upsert)
router.put('/foliomon/accounts', accountController.saveAccounts);

// delete one account by its accountId from the database
router.delete('/foliomon/accounts/:accountId', accountController.deleteAccountById);

// delete all accounts from the database
router.delete('/foliomon/accounts', accountController.deleteAllAccounts);

// get all accounts from TD api save them to the database
router.get('/foliomon/accounts/init', accountController.initialize);

// get account with positions from TD api
router.get('/foliomon/accounts/:accountId/positions', accountController.getPositionsByAccountId);

// get account with orders from TD api
router.get('/foliomon/accounts/:accountId/orders', accountController.getOrdersByAccountId);

// Order Controller Routes

// get all accounts orders from TD api save them to the database
router.get('/foliomon/orders/init', orderController.initialize);

// get all orders from TD api
router.get('/foliomon/orders', orderController.getAllOrders); 

// get account orders from TD api by account number
router.get('/foliomon/orders/:accountId', orderController.getOrdersByAccountId);

// get orders from TD api by its account number and order number
router.get('/foliomon/orders/:accountId/:orderId', orderController.getOrderByAccountIdOrderId);

module.exports = router;