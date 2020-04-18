const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const UserService = require('../services/UserService');

/*=============================================================================
Foliomon User Info and Preferences endpoints controller
=============================================================================*/

controller = {

    // Get User Principals details from TD API
    getUserPrincipals: async (req, res) => {
        try {
            var userData = await UserService.api.getUserPrincipals();
            res.status(200).send(userData);
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof BadRequestError) {
                status = 400;
                error = `Bad Request ${err.message}`;
            } else if (err instanceof UnauthorizedError) {
                status = 401;
                error = `Invalid Access Token: ${err.message}`;
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

    // Get Streamer Subscription Keys
    getStreamerSubscriptionKeys: async (req, res) => {
        let accountIds = req.params.accountIds;
        try {
            var subscriptionKeys = await UserService.api.getStreamerSubscriptionKeys(accountIds);
            res.status(200).send(subscriptionKeys);
        } catch (err) {
            var status = 500; // default
            var error = err.message;
            if (err instanceof BadRequestError) {
                status = 400;
                error = `Bad Request ${err.message}`;
            } else if (err instanceof UnauthorizedError) {
                status = 401;
                error = `Invalid Access Token: ${err.message}`;
            } else if (err instanceof InternalServerError) {
                status = 500;
                error = `Internal Server Error: ${err.message}`;
            } else if (err instanceof ServiceUnavailableError) {
                status = 503;
                error = `Service Unavailable: ${err.message}`;
            }
            res.status(status).send({ error: error });
        }
    }

};
module.exports = controller;