const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const passport = require('passport');
const User = require('../models/user/User');
const config = require('../config/config.js');
const bcrypt = require('bcrypt');

const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;
const TwoFAStrategy = require('passport-2fa-totp').Strategy;

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jwt-simple');

/*
const LocalStrategy = require('passport-local');

// Create local strategy email and password
const localOptions = { usernameField: 'email' };
const localStrategy = new LocalStrategy(
    localOptions, 
    function(email, password, done) {
    // Verify username (email) and password, call done with the user
    // if it is the correct login
    // otherwise call done with false

    User.findOne({ email: email }, function(err, user) {
        if (err) { 
            return done(err); 
        }
        if (!user) { 
            return done(null, false); 
        }

        // compare password to user.password 
        user.verifyPassword(password, function( err, isMatch) {
            if(err) { 
                return done(err); 
            }
            if (!isMatch) { 
                return done(null, false); 
            }
            return done(null,user);
        });
    });
});

passport.use(localStrategy);
*/

const INVALID_LOGIN = 'Invalid email or password';

/*
// serializeUSer and deserializeUser are needed when using sessions
// not needed for JWT
passport.serializeUser(function (user, done) {
    return done(null, user._id);
});

passport.deserializeUser(function (userId, done) {
    User.findById(userId, function (err, user) {
        if (err) {
            return done(err);
        } else if (user === null) {
            return done(null, false);
        } else {
            return done(null, user);
        }
    });
});
*/


const registerTwoFAoptions = {
    usernameField: 'email',
    passwordField: 'password',
    codeField: 'code',
    window: 6, // default 6 a window to generate TOTP code.
    passReqToCallback: false, // Pass request object to callbacks if set true.
    skipTotpVerification: true // TOTP code verification is skipped if set true.
};

const registerTwoFAStrategy = new TwoFAStrategy(
    registerTwoFAoptions,
    //function (req, email, password, done) {
    function (email, password, done) {
        // 1st step verification: validate input and create new user

        // input validation in client side form
        /*
        if (!/^[A-Za-z0-9_]+$/g.test(req.body.email)) {
            return done(null, false, { message: 'Invalid email' });
        }

        if (req.body.password.length === 0) {
            return done(null, false, { message: 'Password is required' });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return done(null, false, { message: 'Passwords do not match' });
        }
        */

        User.findOne({ email: email }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (user !== null) {
                //return done(null, false, { message: 'Invalid email' });
                return done(null, false);
            }
            //const salt = await bcrypt.genSalt(10);
            bcrypt.hash(password, null, null, function (err, hash) {
                if (err) {
                    return done(err);
                }

                const user = {
                    email: email,
                    password: hash
                };

                User.create(user, function (err) {
                    if (err) {
                        return done(err);
                    }

                    return done(null, user);
                });
            });
        });
    });

passport.use('register', registerTwoFAStrategy);

const loginTwoFAoptions = {
    usernameField: 'email',
    passwordField: 'password',
    codeField: 'code',
    window: 6, // default 6 A window to generate TOTP code.
    passReqToCallback: false, // Pass request object to callbacks if set true.
    skipTotpVerification: false // TOTP code verification is skipped if set true.
};

const loginTwoFAStrategy = new TwoFAStrategy(
    loginTwoFAoptions,
    function (email, password, done) {
        // 1st step verification: username and password
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                //return done(null, false, { message: INVALID_LOGIN }); 
                return done(null, false);
            }

            // compare password to user.password 
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    return done(err);
                }
                if (result === true) {
                    return done(null, user);
                } else {
                    //return done(null, false, { message: INVALID_LOGIN });
                    return done(null, false);
                }
            });
        });

    },
    function (user, done) {
        // 2nd step verification: TOTP code from Google Authenticator
        if (!user.secret) {
            done(new Error("Google Authenticator is not setup yet."));
        } else {
            // Google Authenticator uses 30 seconds key period
            // https://github.com/google/google-authenticator/wiki/Key-Uri-Format

            const secret = GoogleAuthenticator.decodeSecret(user.secret);
            done(null, secret, 30);
        }
    }
);

passport.use('login', loginTwoFAStrategy);


// Setup options for JWT strategy
const jwtOptions = {
    //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
    secretOrKey: config.auth.jwtSecret,
    //issuer: 'enter issuer here', // enter issuer here
    //audience: 'enter audience here', // enter audience here
    algorithms: ['HS512'] //,
    //ignoreExpiration: false,
    //passReqToCallback: false,
    /*jsonWebTokenOptions: {
        complete: false,
        clockTolerance: '',
        maxAge: '1d', // 1 days
        clockTimestamp: '100',
        nonce: 'foliomon' // string here for OpenID
    } */   
};

// Create JWT strategy
const jwtStrategy = new JwtStrategy(
    jwtOptions, 
    function(payload, done) {
    // See if user id in payload exists in db
    // call done with that user
    // otherwise call done without user object
    //AuthService.util.getUser()
    User.findById(payload.sub, function(err, user) {
        if (err) { return done(err,false); }
        if(user) {
            done(null,user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtStrategy);

/*=============================================================================
utility service methods
=============================================================================*/

const util = {

    validateEmail: function (email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    },

    validatePassword: function (password) {
        // Check if all the characters are present in string

        let hasLowerCase, hasUpperCase, hasNumber, hasSpecialCharacter = false;

        // On each test that is passed, increment the counter
        if (/[a-z]/.test(password)) {
            // If string contain at least one lowercase alphabet character
            hasLowerCase = true;
        }
        if (/[A-Z]/.test(password)) {
            hasUpperCase = true;
        }
        if (/[0-9]/.test(password)) {
            hasNumber = true;
        }
        if (/[!@#$&*]/.test(password)) {
            hasSpecialCharacter = true;
        }

        // Check if at least three rules are satisfied
        return password.length >= 8 && hasLowerCase && hasUpperCase && hasNumber && hasSpecialCharacter;
    },

    // returns salted hashed text
    encrypt: async (text) => {
        return await bcrypt.hash(text, 10);
    },

    // returns true when the hash was built from the text
    hashMatch: async (text, hash) => {
        return await bcrypt.compare(text, hash);
    },

    getJwt: function (user) {
        const timestamp = new Date().getTime();
        // number of minutes to expire X 60000 mili seconds per minute 
        const expiry = timestamp + (config.auth.jwtExpiry * 60000);
        const payload = {
            sub: user.email, // Subscriber: unique user identifier
            iat: timestamp, // Issued At Timestamp
            exp: expiry // Expiration time number of minutes
        };
        const token = jwt.encode(
            payload,
            config.auth.jwtSecret, // jwt secret
            'HS512' // hash algo
        );
        return token;
    },

    isJwtExpired: function (token) {
        const payload = jwt.decode(token, config.auth.jwtSecret, 'HS512');
        const { exp } = payload;
        const timestamp = new Date().getTime();
        return  timestamp >= exp;
    },

    getJwtPayload: function (token) {
        return jwt.decode(token, config.auth.jwtSecret, 'HS512');
    },

    getQrData: function (email) {
        const data = GoogleAuthenticator.register(email);
        //const secret = data.secret;
        //const qr = data.qr;
        return data;
    }
};

/*=============================================================================
database service methods
=============================================================================*/

const db = {

    getUser: async (email) => {
        try {
            let foundUser = await User.findOne({ email: email });
            if (foundUser) {
                return foundUser;
            } else {
                throw new NotFoundError(`Error user Not Found in database.`);
            }
        } catch (err) {
            throw err;
        }
    },

    createUser: async (user) => {
        try {
            let result = null;
            return result = await User.create(user);
        } catch (err) {
            if (err.name === 'ValidationError' && err.errors.email.kind == 'unique') {
                throw new BadRequestError(`Error email already in use.`);
            } else if (err.name === 'ValidationError') {
                throw new BadRequestError(`Error creating user: ${err.message}`);
            } else {
                throw new InternalServerError(`Error creating user in database: ${err.message}`);
            }
        }
    },

    updateUserSecret: async (email,secret) => {
        try {
            let result = null;
            return result = await User.updateOne({ email: email }, { secret: secret } );
        } catch (err) {
            if (err.name === 'ValidationError') {
                throw new BadRequestError(`Error updating user: ${err.message}`);
            } else {
                throw new InternalServerError(`Error updating user in database: ${err.message}`);
            }
        }
    }
};
module.exports.util = util;
module.exports.db = db;