const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const AuthService = require('../services/AuthService');

const controller = {

    // GET /foliomon/auth
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

            const authReply = response.data;

            // Validate the response data from TD API
            if (!authReply.token_type) {
                throw new InternalServerError('Response from TD API has invalid token_type.');
            }
            if (!authReply.access_token) {
                throw new InternalServerError('Response from TD API has invalid access_token.');
            }
            if (!authReply.expires_in) {
                throw new InternalServerError('Response from TD API has invalid expires_in.');
            }
            if (!authReply.refresh_token) {
                throw new InternalServerError('Response from TD API has invalid refresh_token.');
            }
            if (!authReply.refresh_token_expires_in) {
                throw new InternalServerError('Response from TD API has invalid refresh_token_expires_in.');
            }

            const tokenType = authReply.token_type; // 'Bearer'
            const accessToken = authReply.access_token;
            const accessTokenExpiresIn = authReply.expires_in; // 1800 seconds
            const refreshToken = authReply.refresh_token;
            const refreshTokenExpiresIn = authReply.refresh_token_expires_in; // 7776000 seconds

            const grantedDate = new Date(); // date time now it was just granted
            var accessTokenExpirationDate = new Date();
            accessTokenExpirationDate.setTime(grantedDate.getTime() + (accessTokenExpiresIn * 1000));

            var refreshTokenExpirationDate = new Date();
            refreshTokenExpirationDate.setTime(grantedDate.getTime() + (refreshTokenExpiresIn * 1000));

            console.log(`Received access token expires: ${accessTokenExpirationDate} refresh token expires: ${refreshTokenExpirationDate}`);

            const authTokenUpdate = {
                tokenType: tokenType, // "Bearer"
                accessToken: accessToken,
                accessTokenExpiresInSeconds: accessTokenExpiresIn, // seconds to expire from now
                accessTokenGrantedDate: grantedDate, // date time access token was granted
                accessTokenExpirationDate: accessTokenExpirationDate, // date time access token will expire (granted date + expires in)
                refreshToken: refreshToken,
                refreshTokenExpiresInSeconds: refreshTokenExpiresIn, // seconds to expire from now
                refreshTokenGrantedDate: grantedDate, // date time refresh token was granted
                refreshTokenExpirationDate: refreshTokenExpirationDate // date time refresh token will expire (granted_date + expires_in)
            };
            // store the access and refresh tokens into the db 
            // together with their expiration date times
            const result = await AuthService.db.updateToken(authTokenUpdate);
            res.status(200).send(authTokenUpdate);
        } catch (err) {
            console.log(`Error in authController.authorize: ${err.message}`);
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
            const accessToken = authToken.accessToken;
            res.status(200).send(accessToken);
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof NotFoundError) {
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
            const refreshToken = authToken.refreshToken;
            res.status(200).send(refreshToken);
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof NotFoundError) {
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
            }

            if (refreshTokenExpirationDate <= new Date()) {
                console.log(`Refresh token has expired.`);
                isRefreshTokenExpired = true;
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
                if (response) {
                    console.log('authorizeApp post refresh token received new tokens.');
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