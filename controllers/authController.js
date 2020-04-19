const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const AuthService = require('../services/AuthService');

const controller = {

    // GET /foliomon/authorize
    // Authorize the foliomon app to use the TD account

    // See the Authentication API's Post Access Token method for more information
    // https://developer.tdameritrade.com/authentication/apis/post/token-0

    // https://developer.tdameritrade.com/content/simple-auth-local-apps
    
    // After the app is approved to use the account, TD redirects here
    postAccessToken: async (req, res) => {
        try {
            let response = null;
            
            if (req.query.code) {
                // request a new Access Token and new Refresh Token from TD
                // using the authorization code grant from the redirect url                
                response = await AuthService.api.postAuthCode(req.query.code);
            } else {
                refreshToken = await AuthService.db.getRefreshToken();
                response = await AuthService.api.postRefreshToken(refreshToken);
            }

            console.log(`authorizeApp.postAccessToken received new tokens: ${response.data}`);
            
            // store the access and refresh tokens into the db 
            // together with their expiration date times
            const updatedAuthToken = AuthService.api.getAuthTokenFromResponse(response.data);
            const result = await AuthService.db.updateToken(updatedAuthToken);
            res.status(200).send(updatedAuthToken);
        } catch (err) {
            console.log(`Error in authController.postAccessToken: ${err.message}`);
            var status = 500; // default
            var error = err.message;
            if (err instanceof BadRequestError) {
                status = 400;
                error = `Bad Request: ${err.message}`;
            } else if (err instanceof UnauthorizedError) {
                status = 401;
                error = `Invalid Access Token: ${err.message}`;
            } else if (err instanceof ForbiddenError) {
                status = 403;
                error = `User does not have permission to access the account: ${err.message}`;
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Client id ${orderId} not found.`;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            } else if (err instanceof ServiceUnavailableError) {
                status = 503;
                error = `Service Unavailable: ${err.message}`;
            }
            res.status(status).send({ error: error });
        }
    },

    // GET /foliomon/accesstoken
    // Get the Access Token from the auth token in the database
    getAccessToken: async (req, res) => {
        try {
            const authToken = await AuthService.db.getAuthToken();
            let accessTokenExpirationDate = new Date(authToken.accessTokenExpirationDate);
            if (accessTokenExpirationDate > new Date() ) {
                const accessToken = authToken.accessToken;
                res.status(200).send(accessToken);
            } else {
                throw new UnauthorizedError('Access Token is Expired.');
            }
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof UnauthorizedError) {
                status = 401;
                error = 'Access Token is Expired.';
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Access Token Not Found.`;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            }
            res.status(status).send({ error: error });
        }
    },

    // GET /foliomon/refreshtoken
    // Get the Refresh Token from the auth token in the database
    getRefreshToken: async (req, res) => {
        try {
            const authToken = await AuthService.db.getAuthToken();
            let refreshTokenExpirationDate = new Date(authToken.refreshTokenExpirationDate);
            if (refreshTokenExpirationDate > new Date()) {
                const refreshToken = authToken.refreshToken;
                res.status(200).send(refreshToken);
            } else {
                throw new UnauthorizedError('Refresh Token is Expired.');
            }            
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof UnauthorizedError) {
                status = 401;
                error = 'Refresh Token is Expired.';
            } else if (err instanceof NotFoundError) {
                status = 404;
                error = `Refresh Token Not Found.`;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            }
            res.status(status).send({ error: error });
        }
    },

    /*

    Requests can be made by authenticating your application and a user in combination, 
    or only authenticating your application (referred to as unauthenticated requests). 
    Without user authentication and authorization, public resources like delayed data may be available.

    Unauthenticated Requests

    Right now, APIs offering this generally only require the OAuth User ID passed in to a parameter. 
    In the future, we will move toward only supporting the OAuth 2.0 Client Credentials flow 
    described in section 1.3.4 of RFC 6749 for this type of request.
    Authenticated Requests

    To authenticate a user, we use the OAuth 2.0 Authorization Code flow described in section 1.3.1 of RFC 6749. 
    The best way to see this in action is to follow the steps on the simple auth guide

    Invoke the authentication window in the browser with the URL 
    https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=Redirect URI&client_id=OAuth User ID@AMER.OAUTHAP.
    When the user has authenticated, a GET request will be made to your redirect URI with the authorization code passed as a parameter.
    This authorization code can then be passed as the code parameter to the Authentication API's Post Access Token method 
    using the authorization_code grant type. 
    To receive a refresh token which allows you to receive a new access token after the access token's expiration of 30 minutes, 
    set the access type to offline.
    When you have POSTed details to the token endpoint and received your access token and refresh token, 
    you can pass the access token as a bearer token by setting the Authorization header on all requests to "Bearer Access Token"

    */

    authorizeApp: async () => {
        const timeNow = new Date();
        console.log(`authorizeApp START ${timeNow}`);

        let authToken = null;
        let accessToken = null;
        let refreshToken = null;
        let isAccessTokenExpired = false;
        let isRefreshTokenExpired = false;
        let accessTokenExpirationDate = null;
        let refreshTokenExpirationDate = null;
        let authorized = false;

        // Fetch the access and refresh tokens from the db and check their expiration date time
        try {
            authToken = await AuthService.db.getToken();
            accessTokenExpirationDate = new Date(authToken.accessTokenExpirationDate);
            refreshTokenExpirationDate = new Date(authToken.refreshTokenExpirationDate);

            if (accessTokenExpirationDate <= new Date()) {
                console.log(`Access token has expired.`);
                isAccessTokenExpired = true;
            } else {
                console.log(`Access token is valid.`);
            }

            if (refreshTokenExpirationDate <= new Date()) {
                console.log(`Refresh token has expired.`);
                isRefreshTokenExpired = true;
            } else {
                console.log(`Refresh token is valid.`);
            }

            accessToken = authToken.accessToken;
            refreshToken = authToken.refreshToken;

        } catch (err) {
            console.log(`Error in authorizeApp: ${err.message}`);
            isAccessTokenExpired = true;
            isRefreshTokenExpired = true;
        }

        // if the access token exists and it isnt expired then continue the app main event loop 
        if (accessToken && !isAccessTokenExpired) {
            authorized = true;
            console.log(`authorizeApp access token valid until: ${accessTokenExpirationDate}`);
            return authorized;
            // otherwise if access token is expired but the refresh token is not expired yet
            // use it to request a new access token and refresh token and save them
        } else if (isAccessTokenExpired && !isRefreshTokenExpired && refreshToken) {
            try {
                const response = await AuthService.api.postRefreshToken(refreshToken);
                if (response.data) {
                    console.log(`authorizeApp post refresh token received new tokens.${response.data}`);
                    const updatedAuthToken = AuthService.api.getAuthTokenFromResponse(response.data);
                    const result = await AuthService.db.updateToken(updatedAuthToken);
                    authorized = true;
                    return authorized;
                }
            } catch (err) { // handle all response status code other than OK 200
                console.log(`Error in authorizeApp: ${err.message}`);
                isRefreshTokenExpired = true;
                authorized = false;
                return authorized;
            };
        }

        // when both access token and refresh token are expired
        // or neither are available in the database then user will need to
        // login to the TD Ameritrade page to do the post auth code grant
        if (isAccessTokenExpired && isRefreshTokenExpired) {
            authorized = false;
            console.log('authorizeApp Need to login to TD to get new tokens...');
        }

        return authorized;
    }

};
module.exports = controller;