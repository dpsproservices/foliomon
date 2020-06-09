const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const passport = require('passport');
const User = require('../models/user/User');
const config = require('../config');
const argon2 = require('argon2');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
//const jwt = require('jwt-simple');
const jwt = require('jsonwebtoken');

const qrcode = require('qrcode');
const speakeasy = require('speakeasy');

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

// Setup options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
    secretOrKey: config.auth.jwtSecret,
    //issuer: 'enter issuer here', // enter issuer here
    //audience: 'enter audience here', // enter audience here
    algorithms: ['HS512'],
    ignoreExpiration: false //,
    //passReqToCallback: false,
    /*jsonWebTokenOptions: {
        complete: false,
        clockTolerance: '',
        maxAge: '1d', // 1 days
        clockTimestamp: '100',
        nonce: 'foliomon' // string here for OpenID
    } */   
};

// Passport JWT strategy
// Look up the User matching the sub in the JWT payload
const jwtStrategy = new JwtStrategy(
    jwtOptions, 
    function(payload, done) {
    // See if user id in payload exists in db
    // call done with that user
    // otherwise call done without user object
    User.findById(payload.sub, function(err, user) {
        if (err) { 
            return done(err,false); 
        }
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
    hash: async (text) => {
        //return await bcrypt.hash(text, 12);
        const argonOptions = {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1, // single thread
            hashLength: 64,
            raw: false,
            saltLength: 16
        };
        return await argon2.hash(text, argonOptions);
    },

    // returns true when the hash was built from the text
    verify: async (hash, text) => {
        //return await bcrypt.compare(text, hash);
        return await argon2.verify(hash,text);
    },

    getJwt: function (user) {
        const timestamp = new Date().getTime();
        // number of seconds to expire X 1000 mili seconds per second 
        const millisecondsToExpire = (config.auth.jwtExpiry * 1000);
        const expiry = timestamp + millisecondsToExpire;
        const expiresIn = '1d'; // 1 day
        const payload = {
            sub: user._id, // Subject: unique user identifier
            iat: timestamp, // Issued At Timestamp
            exp: expiry
        };

        const signedToken = jwt.sign(
            payload, 
            config.auth.jwtSecret, 
            { 
                algorithm: 'HS512', 
                expiresIn: expiresIn // if ommited, the token will not expire
            }
        );
        // return {
        //     token: "Bearer " + signedToken,
        //     expires: expiresIn
        // }
        return "Bearer " + signedToken;
    },
/*
    getJwt: function (user) {
        const timestamp = new Date().getTime();
        // number of minutes to expire X 60000 mili seconds per minute 
        const expiry = timestamp + (config.auth.jwtExpiry * 60000);
        const payload = {
            sub: user.email, // Subject: unique user identifier
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
*/

    getQrData: function (user) {
        const userId = user._id;
        //const email = user.email;
        const data = GoogleAuthenticator.register(userId);
        //const secret = data.secret;
        //const qr = data.qr;
        return data;
    }
};

/*=============================================================================
database service methods
=============================================================================*/

const db = {

    getUserById: async (userId) => {
        try {
            let foundUser = await User.findById(userId);
            if (foundUser) {
                return foundUser;
            } else {
                throw new NotFoundError(`Error user Not Found in database.`);
            }
        } catch (err) {
            throw err;
        }
    },

    getUserByEmail: async (email) => {
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

    updateUserSecret: async (user,secret) => {
        try {
            let result = null;
            let userId = user._id;
            return result = await User.findByIdAndUpdate(userId, { secret: secret } );
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