const config = require('../config/config.js');
const request = require('request-promise-native');
request.debug = true;
const AccessToken = require('../models/auth/AccessToken');
const Account = require('../models/securitiesAccount/Account');

// GET /foliomon/accounts
// Get all Accounts
exports.getAllAccounts = function(req, res) {
    Account.find().exec()
        .then(function(foundAccounts) {
            if (foundAccounts && (foundAccounts.length > 0)) {
                console.log(`accountController.getAllAccounts Found accounts: ${foundAccounts}`)
                res.status(200).send({ accounts: foundAccounts })
            } else {
                console.log('Error in accountController.getAllAccounts No accounts found in database.')
                res.status(404).send({ error: 'No accounts found in database.' })
            }
        })
        .catch(function(err) {
            console.log(`Error in accountController.getAllAccounts fetching all accounts from database: ${err}`)
            res.status(500).send({ error: 'Error fetching all accounts from database.' })
        });
};

// GET /foliomon/accounts/:accountId
// Get single Account by accountId
exports.getAccountById = function(req, res) {
    const accountId = req.params.accountId;
    if (accountId) {
        Account.findOne({ accountId: accountId }).exec()
            .then(function(foundAccount) {
                if (foundAccount) {
                    console.log(`accountController.getAccountById Found account: ${foundAccount}`)
                    res.status(200).send({ account: foundAccount })
                } else {
                    console.log(`Error in accountController.getAccountById No account id ${accountId} found in database.`)
                    res.status(404).send({ error: `No account id ${accountId} found in database.` })
                }
            })
            .catch(function(err) {
                console.log(`Error in accountController.getAccountById fetching account from database: ${err}`)
                res.status(500).send({ error: `Error fetching account id ${accountId} from database.` })
            });
    } else {
        console.log(`Error in accountController.getAccountById fetching account from database: invalid account id ${accountId}`)
        res.status(404).send({ error: `Error invalid account id ${accountId}` })
    }
};

function isValidAccountRequest(req) {

    if (!req.params.accountId) {
        return { isValid: false, message: 'Error invalid accountId in request params.' };
    }

    if (!req.body.accountId) {
        return { isValid: false, message: 'Error invalid accountId in request body.' };
    }

    if (req.params.accountId !== req.body.accountId) {
        return { isValid: false, message: 'Error invalid accountId in request body doesnt match request params.' };
    }

    if (!req.body.accountId) {
        return { isValid: false, message: 'Error invalid accountId in request body.' };
    }

    return { isValid: true, message: 'Valid account.' };
}

// PUT /foliomon/accounts/:accountId
// Save the Account by accountId UPSERT
exports.saveAccountById = function(req, res) {
    try {
        const reqParamsAccountId = req.params.accountId;
        const reqBodyAccountId = req.body.accountId;

        console.log(`accountController.saveAccountById req.params.accountId: ${reqParamsAccountId} req.body.accountId: ${reqBodyAccountId}`);

        const reqValidation = isValidAccountRequest(req);

        if (!reqValidation.isValid) {
            console.log(`accountController.saveAccountById ${reqValidation.message}`);
            res.status(404).send({ error: reqValidation.message });
        } else {

            let conditions = { accountId: reqParamsAccountId };

            let update = req.body;
            update.updateDate = new Date(); // date time now

            let options = {
                new: true,
                upsert: true
            };

            Account.findOneAndUpdate(conditions, update, options).exec()
                .then(function(savedAccount) {
                    console.log(`accountController.saveAccountById Saved account: ${savedAccount}`)
                    res.status(200).send({ account: savedAccount })
                })
                .catch(function(err) {
                    console.log(`Error in accountController.saveAccountById Unable to save account to database: ${err}`)
                    res.status(500).send({ error: 'Unable to save account to database.' })
                });
        }

    } catch (err) {
        console.log(`Error in accountController.saveAccountById ${err}`);
        res.status(500).send({ error: 'Unable to save account to database.' });
    }
};

function isValidMultipleAccountRequest(req) {

    // expected request body { accounts: [{...}] }
    if (!req.body.accounts) {
        return { isValid: false, message: 'Error invalid accounts in request body.' };
    }

    if (!Array.isArray(req.body.accounts)) {
        return { isValid: false, message: 'Error invalid accounts array in request body.' };
    }

    const accounts = req.body.accounts; //JSON.parse(JSON.stringify(req.body.accounts));

    //console.log(`accountController.isValidMultipleAccountRequest accounts: ${JSON.stringify(accounts)}`);

    for (let index in accounts) {
        if (accounts.hasOwnProperty(index)) {

            let account = accounts[index];
            //console.log(`accountController.isValidMultipleAccountRequest account: ${JSON.stringify(account)}`);

            if (!account.accountId) {
                console.log(`accountController.isValidMultipleAccountRequest Error invalid accountId in request body.`);
                return { isValid: false, message: 'Error invalid accountId in request body.' };
            }
        }
    }

    return { isValid: true, message: 'Valid accounts.' };
}

// PUT /foliomon/accounts/
// Save multiple Accounts to db
exports.saveMultipleAccounts = function(req, res) {
    try {

        const reqValidation = isValidMultipleAccountRequest(req);

        if (!reqValidation.isValid) {
            console.log(`accountController.saveMultipleAccounts ${reqValidation.message}`);
            res.status(404).send({ error: reqValidation.message });
        } else {

            let options = {
                new: true,
                upsert: true
            };

            var savedAccounts = []; // to send back in OK 200 response

            const accounts = req.body.accounts;

            for (let index in accounts) {
                if (accounts.hasOwnProperty(index)) {

                    let account = accounts[index];
                    console.log(`accountController.isValidMultipleAccountRequest account: ${JSON.stringify(account)}`);

                    let conditions = { accountId: account.accountId };

                    let update = account;
                    update.updateDate = new Date(); // date time now

                    Account.findOneAndUpdate(conditions, update, options).exec()
                        .then(function(savedAccount) {
                            console.log(`Saved account: ${savedAccount}`);
                        })
                        .catch(function(err) {
                            console.log(`Unable to save account to database: ${err}`);
                            res.status(500).send({ error: 'Unable to save account to database.' });
                        });

                    savedAccounts.push(account);
                }
            }
            res.status(200).send({ accounts: savedAccounts });
        }
    } catch (err) {
        console.log(`Error in accountController.saveMultipleAccounts ${err}`);
        res.status(500).send({ error: 'Unable to save accounts to database.' });
    }
};

// DELETE /foliomon/accounts/:accountId
// Delete single Account by accountId
exports.deleteAccountById = function(req, res) {
    const accountId = req.params.accountId;
    if (accountId) {
        Account.deleteOne({ accountId: accountId }).exec()
            .then(function(foundAccount) {
                if (foundAccount) {
                    console.log(`accountController.deleteAccountById Found account to delete: ${foundAccount}`)
                    res.status(200).send({ account: foundAccount })
                } else {
                    console.log(`Error in accountController.deleteAccountById No account id ${accountId} found in database.`)
                    res.status(404).send({ error: `No account id ${accountId} found in database.` })
                }
            })
            .catch(function(err) {
                console.log(`Error in accountController.deleteAccountById deleting account from database: ${err}`)
                res.status(500).send({ error: `Error deleting account id ${accountId} from database.` })
            });
    } else {
        console.log(`Error in accountController.deleteAccountById deleting account from database: invalid account id ${accountId}`)
        res.status(404).send({ error: `Error invalid account id ${accountId}` })
    }
};

// DELETE /foliomon/accounts
// Delete all Accounts
exports.deleteAllAccounts = function(req, res) {
    Account.deleteMany().exec()
        .then(function(foundAccounts) {
            if (foundAccounts) {
                console.log(`accountController.deleteAllAccounts Found accounts to delete: ${foundAccounts}`)
                res.status(200).send({ accounts: foundAccounts })
            } else {
                console.log('Error in accountController.deleteAllAccounts No accounts found in database.')
                res.status(404).send({ error: 'No accounts found in database.' })
            }
        })
        .catch(function(err) {
            console.log(`Error in accountController.deleteAllAccounts deleting all accounts from database: ${err}`)
            res.status(500).send({ error: 'Error deleting all accounts from database.' })
        });
};

// GET /foliomon/accounts/init
// request all accounts data from TD using access token
exports.initialize = async(req, res) => {
    try {
        console.log('accountController.initialize begin');

        var tokenType = null;
        var accessToken = null;

        accessToken = await AccessToken.findOne().exec()
            .then(function(foundToken) {
                if (foundToken.accessToken) {
                    console.log(`Found access token: ${foundToken.accessToken}`);
                    return foundToken.accessToken;
                } else {
                    console.log('No valid access token found in database.');
                    res.status(404).send({ error: 'No valid access token found in database.' });
                }
            })
            .catch(function(err) {
                console.log(`Error fetching access token from database: ${err}`);
                res.status(500).send({ error: 'Error fetching access token from database.' });
            });

        var options = {
            method: 'POST',
            url: config.auth.tokenUrl,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            // POST Body params
            form: {
                'grant_type': 'refresh_token', // The grant type of the oAuth scheme. Possible values are authorization_code, refresh_token 
                'refresh_token': refreshToken, // Required only if using refresh token grant 
                'access_type': 'offline', // Set to offline to also receive a refresh token 
                'client_id': config.auth.clientId // OAuth User ID of the application 
            }
        };

        // do Post Access Token request to TD
        request(options)
            .then(function(body) { // reply body parsed with implied status code 200 from TD
                // see Post Access Token response summary
                var authReply = JSON.parse(body);

                console.log(`authController.reauthorize Post Access Token response body: ${body}`);

                if (!authReply.token_type) {
                    console.log('authController.reauthorize Error invalid token_type in response body.');
                    res.status(400).send({ error: 'Error invalid token_type in response body.' });
                }

                if (!authReply.access_token) {
                    console.log('authController.reauthorize Error invalid access_token in response body.');
                    res.status(400).send({ error: 'Error invalid access_token in response body.' });
                }

                if (!authReply.expires_in) {
                    console.log('authController.reauthorize Error invalid expires_in in response body.');
                    res.status(400).send({ error: 'Error invalid expires_in in response body.' });
                }

                if (!authReply.refresh_token) {
                    console.log('authController.reauthorize Error invalid refresh_token in response body.');
                    res.status(400).send({ error: 'Error invalid refresh_token in response body.' });
                }

                if (!authReply.refresh_token_expires_in) {
                    console.log('authController.reauthorize Error invalid refresh_token_expires_in in response body.');
                    res.status(400).send({ error: 'Error invalid refresh_token_expires_in in response body.' });
                }

                tokenType = authReply.token_type; // "Bearer";
                console.log(`authController.reauthorize Post Access Token response tokenType: ${tokenType}`);

                accessToken = authReply.access_token;
                console.log(`authController.reauthorize Post Access Token response accessToken: ${accessToken}`);

                accessTokenExpiresIn = authReply.expires_in; // 1800;
                console.log(`authController.reauthorize Post Access Token response accessTokenExpiresIn: ${accessTokenExpiresIn}`);

                refreshToken = authReply.refresh_token;
                console.log(`authController.reauthorize Post Access Token response refreshToken: ${refreshToken}`);

                refreshTokenExpiresIn = authReply.refresh_token_expires_in; // 7776000;
                console.log(`authController.reauthorize Post Access Token response refreshTokenExpiresIn: ${refreshTokenExpiresIn}`);

                var grantedDate = new Date(); // date time now it was just granted
                var accessTokenExpirationDate = new Date();
                accessTokenExpirationDate.setTime(grantedDate.getTime() + (accessTokenExpiresIn * 1000));

                var refreshTokenExpirationDate = new Date();
                refreshTokenExpirationDate.setTime(grantedDate.getTime() + (refreshTokenExpiresIn * 1000));

                var conditions = {}; // no filter just replace first one found

                let options = {
                    new: true,
                    upsert: true
                };

                var accessTokenUpdate = {
                    tokenType: tokenType, // "Bearer"
                    accessToken: accessToken,
                    accessTokenExpiresInSeconds: accessTokenExpiresIn, // seconds to expire from now
                    accessTokenGrantedDate: grantedDate, // date time access token was granted
                    accessTokenExpirationDate: accessTokenExpirationDate // date time access token will expire (granted date + expires in)
                };

                var refreshTokenUpdate = {
                    tokenType: tokenType, // "Bearer"
                    refreshToken: refreshToken,
                    refreshTokenExpiresInSeconds: refreshTokenExpiresIn, // seconds to expire from now
                    refreshTokenGrantedDate: grantedDate, // date time refresh token was granted
                    refreshTokenExpirationDate: refreshTokenExpirationDate // date time refresh token will expire (granted_date + expires_in)
                };

                AccessToken.findOneAndUpdate(conditions, accessTokenUpdate, options).exec()
                    .then(function(savedAccessToken) {
                        console.log(`authController.reauthorize Saved access token: ${savedAccessToken}`)
                    })
                    .catch(function(err) {
                        console.log(`Error: in authController.reauthorize unable to save access token to database: ${err}`)
                        res.status(500).send({ error: 'Unable to save access token.' })
                    });

                RefreshToken.findOneAndUpdate(conditions, refreshTokenUpdate, options).exec()
                    .then(function(savedRefreshToken) {
                        console.log(`authController.reauthorize Saved refresh token: ${savedRefreshToken}`)
                    })
                    .catch(function(err) {
                        console.log(`Error in authController.reauthorize Unable to save refresh token to database: ${err}`)
                        res.status(500).send({ error: 'Unable to save refresh token.' })
                    });

                var responseObject = {
                    tokenType: tokenType,
                    accessToken: accessToken,
                    accessTokenExpiresInSeconds: accessTokenExpiresIn,
                    accessTokenGrantedDate: grantedDate,
                    accessTokenExpirationDate: accessTokenExpirationDate,
                    refreshToken: refreshToken,
                    refreshTokenExpiresInSeconds: refreshTokenExpiresIn,
                    refreshTokenGrantedDate: grantedDate,
                    refreshTokenExpirationDate: refreshTokenExpirationDate
                };

                console.log(`Received. access token expires: ${accessTokenExpirationDate} refresh token expires: ${refreshTokenExpirationDate}`);
                res.status(200).send(responseObject);
            })
            .catch(function(err) { // handle all response status code other than OK 200
                console.log(`Error in authController.reauthorize error received from Post Access Token request: ${err}`)
                res.status(500).send({ error: `Error response received from Post Access Token request: ${err}` })
            });

        console.log('authController.reauthorize end');
    } catch (err) {
        console.log(`Error in authController.reauthorize: ${err}`);
        res.status(500).send('Internal Server Error during Post Access Token reauthorize request.');
    }
}