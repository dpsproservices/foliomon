const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');

// Auth
router.get('/foliomon', authController.authorize);
router.get('/foliomon/reauthorize', authController.reauthorize);
router.get('/foliomon/getAccessToken', authController.getAccessToken);
router.put('/foliomon/saveAccessToken', authController.saveAccessToken);
router.get('/foliomon/getRefreshToken', authController.getRefreshToken);
router.put('/foliomon/saveRefreshToken', authController.saveRefreshToken);

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

module.exports = router;