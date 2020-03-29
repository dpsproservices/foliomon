const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');
const orderController = require('../controllers/orderController');

// Auth
router.get('/foliomon/authorize', authController.authorize);
router.get('/foliomon/reauthorize', authController.reauthorize);
router.get('/foliomon/accesstoken', authController.getAccessToken);
router.put('/foliomon/accesstoken', authController.saveAccessToken);
router.get('/foliomon/refreshtoken', authController.getRefreshToken);
router.put('/foliomon/refreshtoken', authController.saveRefreshToken);

// Order
router.get('/foliomon/orders', orderController.getAllOrders);

// Account

// get one account by accountId
router.get('/foliomon/accounts/:accountId', accountController.getAccountById);

// get all accounts available in db
router.get('/foliomon/accounts', accountController.getAllAccounts);

// save one account by accountId upsert
router.put('/foliomon/accounts/:accountId', accountController.saveAccountById);

// save multiple accounts upsert
router.put('/foliomon/accounts', accountController.saveMultipleAccounts);

// delete one account by accountId
router.delete('/foliomon/accounts/:accountId', accountController.deleteAccountById);

// delete all accounts
router.delete('/foliomon/accounts', accountController.deleteAllAccounts);

// get all accounts from TD api to initialize db
router.get('/foliomon/accounts/init', accountController.initialize);

module.exports = router;