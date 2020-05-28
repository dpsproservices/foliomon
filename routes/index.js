const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;
const config = require('../config/config.js');
const isProdMode = config.app.mode === 'production';
const User = require('../models/user/User');
const passportController = require('../controllers/passportController');

// pass thru middleware function bypass auth
const noAuth = function (req, res, next) { return next(); };

//const localAuth = passport.authenticate('local', { session: false });
//const requireSignIn = isProdMode ? localAuth : noAuth;

// const twoFactorAuth = passport.authenticate('2fa-totp', {
//     successRedirect: '/test',
//     failureRedirect: '/login'
// });

//const require2FA = isProdMode ? twoFactorAuth : noAuth;

// const authenticated = function (req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
    
//     return res.redirect('/');
// }

router.post('/register', passportController.register);
//router.post('/register', require2FA, passportController.register);

router.post('/login', passportController.login);
//router.post('/login', requireSignIn, passportController.login);

router.post('/getQrData', passportController.getQrData);
router.post('/setup2fa', passportController.setup2fa);

router.post('/logout', passportController.logout);

/*
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/test');
    }
    
    const errors = req.flash('error');
    return res.render('index', { 
        errors: errors
    });
});
*/

/*
router.post('/', passport.authenticate('login', {
    failureRedirect: '/',
    failureFlash: true,
    badRequestMessage: 'Invalid username or password.'
}), function (req, res, next) {
    if (!req.body.remember) {
        return res.redirect('/test');    
    }
    
    // Create remember_me cookie and redirect to /profile page
    CookieService.db.create(req.user, function (err, token) {
        if (err) {
            return next(err);
        }
        
        res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
        return res.redirect('/test');
    });    
});
*/

/*
router.get('/register', function (req, res, next) {
    const errors = req.flash('error');
    return res.render('register', {
        errors: errors
    });
});
*/

/*
router.post('/register', passport.authenticate('register', {
    successRedirect: '/setup2fa',
    failureRedirect: '/register',
    failureFlash: false
}));
*/

/*
router.get('/setup2fa', authenticated, function (req, res, next) {
    const errors = req.flash('setup2fa-error');
    const qrInfo = GoogleAuthenticator.register(req.user.username);
    req.session.qr = qrInfo.secret;
    
    return res.render('setup2fa', {
        errors: errors,
        qr: qrInfo.qr
    });
});
*/

/*
router.post('/setup2fa', authenticated, function (req, res, next) {
    if (!req.session.qr) {
        req.flash('setup2fa-error', 'The Account cannot be registered. Please try again.');
        return res.redirect('/setup2fa');
    }
    
    User.findById(req.user._id, function (err, user) {
        if (err) {
            req.flash('setup2fa-error', err);
            return res.redirect('/setup2fa');
        }
        
        if (!user) {
            // User is not found. It might be removed directly from the database.
            req.logout();
            return res.redirect('/');
        }
        
        User.update(user, { $set: { secret: req.session.qr } }, function (err) {
            if (err) {
                req.flash('setup2fa-error', err);
                return res.redirect('/setup2fa');
            }
            
            res.redirect('/test');
        });      
    });
});
*/

//const TD_API_ROUTES = require('routes');
//export { default } from './routes';

module.exports = router;