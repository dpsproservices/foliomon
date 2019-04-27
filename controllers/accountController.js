const config = require('../config/config.js');
const request = require('request-promise-native');
request.debug = true;
const Account = require('../models/securitiesAccount/Account');

// GET /foliomon/getAccounts
// Get all Accounts
exports.getAllAccounts = function(req, res) {
    Account.find()
        .then(function(foundAccounts) {
            if (foundAccounts) {
                console.log(`accountController.getAccounts Found accounts: ${foundAccounts}`)
                res.status(200).send({ accounts: foundAccounts })
            } else {
                console.log('Error in accountController.getAccounts No accounts found in database.')
                res.status(404).send({ error: 'No accounts found in database.' })
            }
        })
        .catch(function(err) {
            console.log(`Error in accountController.getAccounts fetching all accounts from database: ${err}`)
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
                    console.log(`accountController.getAccount Found account: ${foundAccount}`)
                    res.status(200).send({ account: foundAccount })
                } else {
                    console.log(`Error in accountController.getAccount No account id ${accountId} found in database.`)
                    res.status(404).send({ error: `No account id ${accountId} found in database.` })
                }
            })
            .catch(function(err) {
                console.log(`Error in accountController.getAccount fetching account from database: ${err}`)
                res.status(500).send({ error: `Error fetching account id ${accountId} from database.` })
            });
    } else {
        console.log(`Error in accountController.getAccount fetching account from database: invalid account id ${accountId}`)
        res.status(404).send({ error: `Error invalid account id ${accountId}` })
    }
};

// PUT /foliomon/accounts/
// Save multiple Accounts to db
exports.saveMultipleAccounts = function(req, res) {
    try {

        if (!req.body.accounts) {
            console.log('accountController.saveMultipleAccounts Error invalid accounts array in request body.');
            res.status(400).send({ error: 'Error invalid accounts array in request body.' });
        }

        var accounts = req.body.accounts;

        let options = {
            new: true,
            upsert: true
        };

        let update = req.body.accounts;
        update.forEach(account => {
            account.updateDate = new Date(); // date time now

            let conditions = { accountId: account.accountId };

            Account.findOneAndUpdate(conditions, update, options).exec()
                .then(function(savedAccount) {
                    console.log(`Saved account: ${savedAccount}`);
                })
                .catch(function(err) {
                    console.log(`Unable to save account to database: ${err}`);
                    res.status(500).send({ error: 'Unable to save account to database.' });
                });
        });

        res.status(200).send({ account: savedAccount });
    } catch (err) {
        console.log(`Error in accountController.saveAccountById ${err}`);
        res.status(500).send({ error: 'Unable to save accounts to database.' });
    }
};

// PUT /foliomon/accounts/:accountId
// Save the Account by accountId UPSERT
exports.saveAccountById = function(req, res) {
    try {
        if (!req.body.accountId || (req.params.accountId !== req.body.accountId)) {
            console.log('accountController.saveAccountById Error invalid accountId in request.');
            return res.status(400).send({ error: 'Error invalid accountId in request.' });
        } else {
            const accountId = req.params.accountId;
            let conditions = { accountId: accountId };

            let update = req.body;
            update.updateDate = new Date(); // date time now

            let options = {
                new: true,
                upsert: true
            };

            Account.findOneAndUpdate(conditions, update, options).exec()
                .then(function(savedAccount) {
                    console.log(`accountController.saveAccountById Saved account: ${savedAccount}`)
                    return es.status(200).send({ account: savedAccount })
                })
                .catch(function(err) {
                    console.log(`Error in accountController.saveAccountById Unable to save account to database: ${err}`)
                    return res.status(500).send({ error: 'Unable to save account to database.' })
                });
        }
    } catch (err) {
        console.log(`Error in accountController.saveAccountById ${err}`);
        res.status(500).send({ error: 'Unable to save account to database.' });
    }
};