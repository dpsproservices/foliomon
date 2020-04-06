const Account = require('../models/securitiesAccount/Account');
const AccountService = require('../services/AccountService');

// GET /foliomon/accounts
// Get all Accounts from the database
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
// Get single Account by accountId from the database
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

// verify the account request is valid
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
// Save the Account by its accountId into the database. 
// update the Account if it exists (UPSERT)
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


// verify the mu;tiple accounts in the request are valid
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
// Save multiple Accounts into the database
// update them if they exist (UPSERT)
exports.saveAccounts = function(req, res) {
    try {

        const reqValidation = isValidMultipleAccountRequest(req);

        if (!reqValidation.isValid) {
            console.log(`accountController.saveAccounts ${reqValidation.message}`);
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
                    console.log(`accountController.saveAccounts account: ${JSON.stringify(account)}`);

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
        console.log(`Error in accountController.saveAccounts ${err}`);
        res.status(500).send({ error: 'Unable to save accounts to database.' });
    }
};

// DELETE /foliomon/accounts/:accountId
// Delete single Account by its accountId from the database
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
// Delete all Accounts from the database
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
// Get all accounts data which this user can access from TD with access token
// Then save all the accounts into the database, update them if they exist 
exports.initialize = async(req, res) => {
    try {
        console.log('accountController.initialize begin');

        var isAccountsDataAvailable = false;
        var accounts = null;
    
        // Verify the accounts are stored otherwise get them and store them
        try {
            accounts = await AccountService.getDbAccounts();
            isAccountsDataAvailable = true;
            res.status(200).send(accounts);
        } catch(err) {
            console.log(`Error in initializeAccountsData ${err}`);
            isAccountsDataAvailable = false;
        }
    
        if (!isAccountsDataAvailable) {
            console.log('initializeAccountsData No accounts data available. Getting from TD...');
    
            try {
                accounts = await AccountService.getApiAccounts();
                if (accounts && accounts.length > 0)
                    await AccountService.saveDbAccounts(accounts);

                res.status(200).send(accounts);
            } catch(err) {
                console.log(`Error in initializeAccountsData ${err}`);
                res.status(500).send({ error: `Error in initializeAccountsData ${err}` })
            }
           
        }

        console.log('accountController.initialize end');
    } catch (err) {
        console.log(`Error in accountController.initialize: ${err}`);
        res.status(500).send('Internal Server Error during Account Init request.');
    }
}

exports.getPositionsByAccountId = async(req, res) => {
    try {
        console.log('accountController.getPositionsByAccountId begin');

        var accounts = null;
        const accountId = req.params.accountId;
    
        try {
            accounts = await AccountService.getApiAccountPositions(accountId);
            res.status(200).send(accounts);
        } catch(err) {
            console.log(`Error in getPositionsByAccountId ${err}`);
            res.status(500).send({ error: `Error in getPositionsByAccountId ${err}` })
        }

        console.log('accountController.getPositionsByAccountId end');
    } catch (err) {
        console.log(`Error in accountController.getPositionsByAccountId: ${err}`);
        res.status(500).send('Internal Server Error during Account positions request.');
    }
}

exports.getOrdersByAccountId = async (req, res) => {
    try {
        console.log('accountController.getOrdersByAccountId begin');

        var accounts = null;
        const accountId = req.params.accountId;

        try {
            accounts = await AccountService.getApiAccountOrders(accountId);
            res.status(200).send(accounts);
        } catch (err) {
            console.log(`Error in getOrdersByAccountId ${err}`);
            res.status(500).send({ error: `Error in getOrdersByAccountId ${err}` })
        }

        console.log('accountController.getOrdersByAccountId end');
    } catch (err) {
        console.log(`Error in accountController.getOrdersByAccountId: ${err}`);
        res.status(500).send('Internal Server Error during Account orders request.');
    }
}