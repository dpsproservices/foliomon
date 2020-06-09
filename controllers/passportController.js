const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const PassportService = require('../services/PassportService');

const controller = {

    // POST Register New User with email and password
    register: async (req, res) => {
        //console.log({req});
        let { email, password } = req.body;
        try {

            // validate email address and password are required
            if (!email || !password ) {
                throw new BadRequestError('Email and password required.');
            }

            // validate email address
            if (!PassportService.util.validateEmail(email)) {
                throw new BadRequestError('Invalid email.');
            }

            // password must be 8 characters 1 uppercase 1 number 1 special character
            if (!PassportService.util.validatePassword(password)) {
                throw new BadRequestError('Password must contain 1 Uppercase 1 Lowercase 1 Number 1 Special character.');
            }

            // hash the password
            const hash = await PassportService.util.hash(password);
            //console.log({hash});
            const userJSON = { email: email, password: hash };

            // when user already exists will throw BadRequestError
            // when user with enail does not exist create user record
            const user = await PassportService.db.createUser(userJSON);
            //console.log({user});
            
            const token = PassportService.util.getJwt(user);
            res.status(200).send({ registered: true, appAuthToken: token });
        } catch (err) {
            //console.log({err});
            var status = 500; // default
            var error = err.message;
            if (err instanceof BadRequestError) {
                status = 400;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            }
            res.status(status).send({ registered: false, error: error });
        }
    },

    // GET QR data
    getQrData: async (req, res) => {
        console.log({req});
        
        //let appAuthToken = req.headers.authorization;
        let { user } = req; // from passport
        try {
            if (!user) {
                // User is not found. It might be removed directly from the database.
                req.logout();
                throw new NotFoundError('User Not Found.');
            }
/*
            if(!appAuthToken) {
                throw new UnauthorizedError('Invalid token.');
            }

            //const isTokenExpired = PassportService.util.isJwtExpired(appAuthToken);

            const payload = PassportService.util.getJwtPayload(appAuthToken);
            //console.log({ payload });

            // verify the token is not expired
            const expiry = payload.exp;
            const timestamp = new Date().getTime();
            //console.log({timestamp});
            if (timestamp >= expiry) {
                throw new UnauthorizedError('Expired token.');
            }

            const email = payload.sub;

            if (!email) {
                throw new BadRequestError('Invalid token.');
            }

            // validate the token contains a valid user
            const user = await PassportService.db.getUser(email);

            if (!user) {
                // User is not found. It might be removed from the database.
                req.logout();
                throw new NotFoundError('Invalid token. User Not Found.');
            }
*/
            // get the QR data based on the user data
            const qrData = await PassportService.util.getQrData(user);

            //console.log({ qrData});

            const secret = qrData.secret;
            const qr = qrData.qr;

            const updateResult = await PassportService.db.updateUserSecret(user, secret);

            res.status(200).send( { qr: qr } );
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof BadRequestError) {
                status = 400;
            } else if (err instanceof UnauthorizedError) {
                status = 401;
            } else if (err instanceof NotFoundError) {
                status = 404;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            }
            res.status(status).send({ error: error });
        }
    },

    // POST Update User Secret from Google Authenticator
    verify2fa: async (req, res) => {
        let { user } = req; // from passport
        let { code } = req.body;
        try {
            if (!user) {
                // User is not found. It might be removed directly from the database.
                req.logout();
                throw new NotFoundError('User Not Found.');
            }

            if (!user.secret) {
                throw new BadRequestError("Google Authenticator is not setup yet.");
            }

            if (!code) {
                throw new BadRequestError('Missing code.');
            }

            const token = PassportService.util.getJwt(user);
            res.status(200).send({ verified: true, appAuthToken: token });
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof BadRequestError) {
                status = 400;
            } else if (err instanceof NotFoundError) {
                status = 404;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            }
            res.status(status).send({ verified: false, error: error });
        }
    },

    // POST Login User with email and password
    login: async (req, res) => {
        let user = req.user; // from passport
        try {
            if(user.setup2fa) {
                // user needs to verify 2fa code
                res.status(200).send({ isLoggedIn: true, appAuthToken: null });
            } else {
                const jwt = PassportService.util.getJwt(user);
                res.status(200).send({ isLoggedIn: true, appAuthToken: jwt });
            }
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof BadRequestError) {
                status = 400;
            } else if (err instanceof UnauthorizedError) {
                status = 401;
            } else if (err instanceof NotFoundError) {
                status = 404;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            }
            res.status(status).send({ isLoggedIn: false, error: error });
        }
    },

    // POST Logout User
    logout: async (req, res) => {
        try {
            req.logout();
            res.status(200).send({ isLoggedOut: true });
        } catch (err) {
            var status = 500; // default
            res.status(status).send({ isLoggedOut: false, error: error });
        }
    }

};
module.exports = controller;