const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config({ debug: true, path: path.resolve(__dirname, '../.env') });
if (dotenv.error) {
    throw dotenv.error;
}
//console.log("Loaded environment config:");
//console.log(dotenv.parsed);

const mode = process.env.FOLIOMON_MODE; // development or production`

const hostname = process.env.FOLIOMON_HOSTNAME;
const httpPort = process.env.FOLIOMON_HTTP_PORT;
const httpsPort = process.env.FOLIOMON_HTTPS_PORT;
const baseUrl = process.env.FOLIOMON_BASE_URI; //`https://${hostname}:${httpsPort}`;
const apiUrl = process.env.FOLIOMON_API_URI;
const mongoHostname = process.env.MONGO_HOSTNAME;
const mongoDB = process.env.MONGO_DATABASE;
const mongoUsername = process.env.MONGO_USERNAME; //db.createUser({user:’foliomon’,pwd: ‘foliomon’,roles:["readWrite"]})
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoPort = process.env.MONGO_PORT;
const mongoUrl = `mongodb://${mongoHostname}:${mongoPort}/${mongoDB}?authSource=admin`;

// SSL cert generated with openssl
const privateKey = fs.readFileSync(path.resolve(__dirname, './ssl/server.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, './ssl/server.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const redirectUrl = process.env.FOLIOMON_REDIRECT_URI;
const clientId = process.env.FOLIOMON_CLIENT_ID;

//const authUrl = `https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=${redirectUrl}&client_id=${clientId}`;
const authUrl = process.env.FOLIOMON_AUTH_URL;
//const tokenUrl = 'https://api.tdameritrade.com/v1/oauth2/token';
const tokenUrl = process.env.FOLIOMON_TOKEN_URL;

const authTokenExpiresInDefault = process.env.FOLIOMON_AUTH_TOKEN_EXPIRES_IN;
const refreshTokenExpiresInDefault = process.env.FOLIOMON_REFRESH_TOKEN_EXPIRES_IN;
const tokenTypeDefault = process.env.FOLIOMON_TOKEN_TYPE;

const defaultMarkets = process.env.FOLIOMON_DEFAULT_MARKETS;

const jwtSecret = process.env.FOLIOMON_JWT_SECRET;
const jwtExpiry = process.env.FOLIOMON_JWT_EXPIRY;

const config = {

    webServer: {
        hostname: hostname,
        httpPort: httpPort,
        httpsPort: httpsPort,
        baseUrl: baseUrl,
        sslKeyCert: {
            key: privateKey,
            cert: certificate
        }
    },

    mongodb: {
        hostname: mongoHostname,
        database: mongoDB,
        username: mongoUsername,
        password: mongoPassword,
        port: mongoPort,
        url: mongoUrl
    },

    auth: {
        apiUrl: apiUrl,
        redirectUrl: redirectUrl,
        clientId: clientId,
        authUrl: authUrl,
        tokenUrl: tokenUrl,
        tokenDefaults: {
            authTokenExpiresIn: authTokenExpiresInDefault,
            refreshTokenExpiresIn: refreshTokenExpiresInDefault,
            tokenType: tokenTypeDefault
        },
        jwtSecret: jwtSecret,
        jwtExpiry: jwtExpiry
    },

    app: {
        defaults: {
            markets: defaultMarkets
        },

        mode: mode
    }

};
//console.log("config:");
//console.log(config);
module.exports = config;