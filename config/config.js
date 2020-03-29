const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config({ debug: true, path: path.resolve(__dirname, '../.env') });
if (dotenv.error) {
    throw dotenv.error;
}
//console.log("Loaded environment config:");
//console.log(dotenv.parsed);

const hostname = process.env.FOLIOMON_HOSTNAME;
const httpPort = process.env.FOLIOMON_HTTP_PORT;
const httpsPort = process.env.FOLIOMON_HTTPS_PORT;
const baseUrl = process.env.FOLIOMON_BASE_URI;
const apiUrl = process.env.FOLIOMON_API_URI;
const mongoHostname = process.env.MONGO_HOSTNAME;
const mongoDB = process.env.MONGO_DATABASE;
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoPort = process.env.MONGO_PORT;
const mongoUrl = `mongodb://${mongoHostname}:${mongoPort}/${mongoDB}?authSource=admin`;

// SSL cert generated with openssl
const privateKey = fs.readFileSync(path.resolve(__dirname, './server.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, './server.crt'), 'utf8');
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

// TD Ameritrade API urls

// Auth
const tdUrlPostAccessToken = process.env.TDAPI_AUTH_POST_ACCESS_TOKEN;

// Account
const tdUrlGetAllAccounts = process.env.TDAPI_ACCOUNT_GET_ALL_ACCOUNTS;
// https://api.tdameritrade.com/v1/accounts

const tdUrlGetOneAccount = process.env.TDAPI_ACCOUNT_GET_ONE_ACCOUNT;
// https://api.tdameritrade.com/v1/accounts/{accountId}

// Orders
const tdUrlGetOrder = process.env.TDAPI_ORDERS_GET_ORDER;
// https://api.tdameritrade.com/v1/accounts/{accountId}/orders/{orderId}

const tdUrlGetOrdersByPath = process.env.TDAPI_ORDERS_GET_ORDERS_BY_PATH;
// https://api.tdameritrade.com/v1/accounts/{accountId}/orders

const tdUrlGetOrdersByQuery = process.env.TDAPI_ORDERS_GET_ORDERS_BY_QUERY;
// https://api.tdameritrade.com/v1/orders

const tdUrlPlaceOrder = process.env.TDAPI_ORDERS_PLACE_ORDER;
// https://api.tdameritrade.com/v1/accounts/{accountId}/orders

const tdUrlReplaceOrder = process.env.TDAPI_ORDERS_REPLACE_ORDER;
// https://api.tdameritrade.com/v1/accounts/{accountId}/orders/{orderId}

const tdUrlCancelOrder = process.env.TDAPI_ORDERS_CANCEL_ORDER;
// https://api.tdameritrade.com/v1/accounts/{accountId}/orders/{orderId}

// Saved Orders
const tdUrlGetSavedOrder = process.env.TDAPI_ORDERS_GET_SAVED_ORDER;
// https://api.tdameritrade.com/v1/accounts/{accountId}/orders/{orderId}

const tdUrlGetSavedOrdersByPath = process.env.TDAPI_ORDERS_GET_SAVED_ORDERS_BY_PATH;
// https://api.tdameritrade.com/v1/accounts/{accountId}/orders

const tdUrlGetSavedOrdersByQuery = process.env.TDAPI_ORDERS_GET_SAVED_ORDERS_BY_QUERY;
// https://api.tdameritrade.com/v1/orders

const tdUrlPlaceSavedOrder = process.env.TDAPI_ORDERS_PLACE_SAVED_ORDER;
// https://api.tdameritrade.com/v1/accounts/{accountId}/orders

const tdUrlReplaceSavedOrder = process.env.TDAPI_ORDERS_REPLACE_SAVED_ORDER;
// https://api.tdameritrade.com/v1/accounts/{accountId}/orders/{orderId}

const tdUrlCancelSavedOrder = process.env.TDAPI_ORDERS_CANCEL_SAVED_ORDER;
// https://api.tdameritrade.com/v1/accounts/{accountId}/orders/{orderId}

// Instruments

// Market Hours

// Price History

// Quotes

// Transactions

// Watchlist

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
        username: username,
        password: password
    },

    api: {
        tdameritrade: {
            auth: {
                postAccessToken: tdUrlPostAccessToken
            },
            accounts: {
                getAllAccounts: tdUrlGetAllAccounts,
                getOneAccount: tdUrlGetOneAccount
            },
            orders: {
                getOrder: tdUrlGetOrder,
                getOrdersByPath: tdUrlGetOrdersByPath,
                getOrdersByQuery: tdUrlGetOrdersByQuery,
                placeOrder: tdUrlPlaceOrder,
                replaceOrder: tdUrlReplaceOrder,
                cancelOrder: tdUrlCancelOrder
            },
            savedOrders: {
                getSavedOrder: tdUrlGetSavedOrder,
                getSavedOrdersByPath: tdUrlGetSavedOrdersByPath,
                getSavedOrdersByQuery: tdUrlGetSavedOrdersByQuery,
                placeSavedOrder: tdUrlPlaceSavedOrder,
                replaceSavedOrder: tdUrlReplaceSavedOrder,
                cancelSavedOrder: tdUrlCancelSavedOrder
            } /*,
            instruments: {
                searchInstruments: tdUrlSearchInstruments,
                getInstrument: tdUrlGetInstrument
            },
            marketHours: {
                getMultipleMarketsHours: tdUrlGetMultipleMarketsHours,
                getSingleMarketHours: tdUrlGetSingleMarketHours
            },
            priceHistory: {
                getPriceHistory: tdUrlGetPriceHistory
            },
            quotes: {
                getQuote: tdUrlGetQuote,
                getQuotes: tdUrlGetQuotes
            },
            transactions: {
                getTransaction: tdUrlGetTransaction,
                getTransactions: tdUrlGetTransactions
            },
            watchlist: {
                createWatchList: tdUrlCreateWatchList,
                deleteWatchList: tdUrlDeleteWatchList,
                getWatchList: tdUrlGetWatchList,
                getWatchListMultipleAccounts: tdUrlGetWatchListMultipleAccounts,
                getWatchListSingleAccounts: tdUrlGetWatchListSingleAccounts,
                replaceWatchlist: tdUrlReplaceWatchList,
                updateWatchList: tdUrlUpdateWatchList
            }*/
        },
        foliomon: {

        }
    }
};
//console.log("config:");
//console.log(config);
module.exports = config;