const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config');
const isProdMode = config.app.mode === 'production';
const jwtAuth = passport.authenticate('jwt', { session: false });

// pass thru middleware function bypass auth
const noAuth = function (req, res, next) { return next(); };
const requireJwt = isProdMode ? jwtAuth : noAuth;

const passportController = require('../controllers/passportController');

//const localAuth = passport.authenticate('local', { session: false });
//const requireLocalAuth = isProdMode ? localAuth : noAuth;

// const twoFactorAuth = passport.authenticate('2fa-totp', {
//     successRedirect: '/test',
//     failureRedirect: '/login'
// });

//const require2FA = isProdMode ? twoFactorAuth : noAuth;

router.post('/register', passportController.register);
//router.post('/register', require2FA, passportController.register);

router.post('/login', passportController.login);
//router.post('/login', requireLocalAuth, passportController.login);

router.get('/getQrData', requireJwt, passportController.getQrData);
//router.post('/setup2fa', requireJwt, passportController.setup2fa);

router.post('/logout', requireJwt, passportController.logout);

//const TD_API_ROUTES = require('routes');
//export { default } from './routes'; // TD API routes
module.exports = router;