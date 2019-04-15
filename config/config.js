const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config({ debug: true, path: path.resolve(__dirname, './config.env') });
if (dotenv.error) {
    throw dotenv.error;
}
//console.log("Loaded environment config:");
//console.log(dotenv.parsed);

const hostname = process.env.FOLIOMON_HOSTNAME;
const httpPort = process.env.FOLIOMON_HTTP_PORT;
const httpsPort = process.env.FOLIOMON_HTTPS_PORT;

const mongoHostname = process.env.MONGO_HOSTNAME;
const mongoDB = process.env.MONGO_DATABASE;
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoPort = process.env.MONGO_PORT;
const mongoUrl = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHostname}:${mongoPort}/${mongoDB}?authSource=admin`;

// SSL cert generated with openssl
const privateKey = fs.readFileSync(path.resolve(__dirname, './key.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, './certificate.pem'), 'utf8');
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

const username = process.env.FOLIOMON_USERNAME;
const password = process.env.FOLIOMON_PASSWORD;

const config = {

    webServer: {
        hostname: hostname,
        httpPort: httpPort,
        httpsPort: httpsPort,
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
        redirectUrl: redirectUrl,
        clientId: clientId,
        authUrl: authUrl,
        tokenUrl: tokenUrl,
        tokenDefaults: {
            authTokenExpiresIn: authTokenExpiresInDefault,
            refreshTokenExpiresIn: refreshTokenExpiresInDefault,
            tokenType: tokenTypeDefault
        },
        username: username,
        password: password
    }
};
//console.log("config:");
//console.log(config);
module.exports = config;