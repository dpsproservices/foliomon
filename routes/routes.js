const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
//const accountController = require('../controllers/accountController');

router.get('/foliomon', authController.authorize);
router.get('/foliomon/getAccessToken', authController.getAccessToken);
router.put('/foliomon/saveAccessToken', authController.saveAccessToken);
router.get('/foliomon/getRefreshToken', authController.getRefreshToken);
router.put('/foliomon/saveRefreshToken', authController.saveRefreshToken);

// TODO
//router.get('/foliomon/accounts', accountController.getAccounts);
//router.get('/foliomon/accounts/:id', accountController.getAccountById);

module.exports = router;