const passport = require('passport');
const User = require('../models/user/User');
const config = require('../config/config.js');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
//const AuthService = require('../services/AuthService');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

// Create local strategy email and password
const localOptions = { usernameField: 'email' }
const localStrategy = new LocalStrategy(localOptions, function(email, password, done) {
    // Verify username (email) and password, call done with the user
    // if it is the correct login
    // otherwise call done with false

    User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        // compare password to user.password 
        user.verifyPassword(password, function( err, isMatch) {
            if(err) { return done(err); }
            if (!isMatch) { return done(null, false); }
            return done(null,user);
        });
    });
});


// Setup options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
    secretOrKey: config.auth.jwtSecret
};

// Create JWT strategy
const jwtStrategy = new JwtStrategy(jwtOptions, function(payload, done) {
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

// Tell passport to use this strategy
passport.use(jwtStrategy);
passport.use(localStrategy);

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
        return jwt.encode({ sub: user.id, iat: timestamp }, config.auth.jwtSecret)
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
    } //,

    /*
    verifyPassword: async (user) => {
        try {
            let result = null;
            result = await User.findOne
        } catch (err) {

        }
    }
    */
};
module.exports.util = util;
module.exports.db = db;