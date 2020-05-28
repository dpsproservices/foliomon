const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const PassportService = require('../services/PassportService');

const controller = {

    // POST Register New User with email and password
    register: async (req, res) => {
        //console.log({req});
        let { email, password } = req.body;
        try {

            if (!email || !password ) {
                throw new BadRequestError('Email and password required.');
            }

            // validate email address and password
            if (!PassportService.util.validateEmail(email)) {
                throw new BadRequestError('Invalid email.');
            }

            // must be 8 characters 1 uppercase 1 number 1 special character
            if (!PassportService.util.validatePassword(password)) {
                throw new BadRequestError('Password must contain 1 Uppercase 1 Lowercase 1 Number 1 Special character.');
            }

            // verify user with email exists
            // when user already exists return error

            // when user with enail does not exist create and save user record
            const hash = await PassportService.util.encrypt(password);
            //console.log({hash});
            const userJSON = { email: email, password: hash };
            const user = await PassportService.db.createUser(userJSON);
            //console.log({user});
            // respond to request indicating user was created
            //const userId = result.id;
            const token = PassportService.util.getJwt(user);
            res.status(200).send({ appAuthToken: token });
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
            res.status(status).send({ error: error });
        }
    },

    // GET QR data
    getQrData: async (req, res) => {
        //console.log({req});
        
        let { appAuthToken } = req.body;
        try {
            if(!appAuthToken) {
                throw new UnauthorizedError('Invalid token.');
            }

            //const isTokenExpired = PassportService.util.isJwtExpired(appAuthToken);

            const payload = PassportService.util.getJwtPayload(appAuthToken);
            //console.log({ payload });
            const expiry = payload.exp;
            const timestamp = new Date().getTime();
            //console.log({timestamp});
            if (timestamp >= expiry) {
                //throw new UnauthorizedError('Expired token.');
            }

            const email = payload.sub;

            if (!email) {
                throw new BadRequestError('Invalid token.');
            }

            //const user = await PassportService.db.getUser(email);

            // if (!user) {
            //     // User is not found. It might be removed directly from the database.
            //     req.logout();
            //     throw new NotFoundError('User Not Found.');
            // }

            // get the QR data from Google Authenticator
            const qrData = await PassportService.util.getQrData(email);

            //console.log({ qrData});

            const secret = qrData.secret;
            const qr = qrData.qr;

            const updateResult = await PassportService.db.updateUserSecret(email, secret);

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

    // POST Setup 2FA verify 6 digit code sent with user secret
    setup2fa: async (req, res) => {
        console.log({ req });
        let { appAuthToken } = req.body;
        //let { email } = req.user.username; // from passport
        let { code } = req.body; // from the form field
        try {
            if (!code) {
                throw new BadRequestError('Code required.');
            }
            const user = await PassportService.db.getUser(email);

            if (!user) {
                // User is not found. It might be removed directly from the database.
                req.logout();
                throw new NotFoundError('User Not Found.');
            }

            const updateResult = await PassportService.db.updateUserSecret(email, secret);

            res.status(200).send( { setup2fa: true } );
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
            res.status(status).send({ error: error });
        }
    },

    // POST Update User Secret from Google Authenticator
    updateUserSecret: async (req, res) => {
        let user = req.user; // from passport
        let { email, secret } = req.body;
        try {
            if (!secret) {
                throw new BadRequestError('Missing secret.');
            }

            const user = await PassportService.db.getUser(email);

            if (!user) {
                // User is not found. It might be removed directly from the database.
                req.logout();
                throw new NotFoundError('User Not Found.');
            }

            const updateResult = await PassportService.db.updateUserSecret(email,secret);

            res.status(200).send({ });
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
            res.status(status).send({ error: error });
        }
    },

    // POST Login User with email and password
    login: async (req, res) => {
        let user = req.user; // from passport
        try {
            const jwt = PassportService.util.getJwt(user);
            res.status(200).send({ appAuthToken: jwt });
        } catch (err) {
            var status = 500; // default
            res.status(status).send({ error: error });
        }
    },

    // POST Logout User
    logout: async (req, res) => {
        try {
            req.logout();
            res.status(200).send({});
        } catch (err) {
            var status = 500; // default
            res.status(status).send({ error: error });
        }
    }

};
module.exports = controller;