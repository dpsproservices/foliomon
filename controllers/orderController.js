const config = require('../config/config.js');
//const Order = require('../models/auth/Order');
const AccessToken = require('../models/auth/AccessToken');
const axios = require('axios');

const getToken = () => {
    return AccessToken.findOne().exec()
    .then(function(foundToken) {
        if (foundToken) {
            console.log(`Found access token: ${foundToken}`)
            return foundToken;
        } else {
            console.log('No access token found in database.')
        }
    })
    .catch(function(err) {
        console.log(`Error fetching access token from database: ${err}`)
    });
}

exports.getAllOrders = async (req, res) => {
    try {
        console.log('orderController.getAllOrders begin');

        const token = await getToken();

        const url = `${config.auth.baseUrl}/orders`;

        const data = {
            //accountId: Account number.
            //maxResults: The maximum number of orders to retrieve.
            //fromEnteredTime: yyyy-MM-dd. Date must be within 60 days from today's date.
            //toEnteredTime:
            //status: Specifies that only orders of this status should be returned.
        };

        const options = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token.accessToken}` },
            data,
            url,
        };

        axios(options)
        .then(function(body) { // reply body parsed with implied status code 200 from TD
            console.log("Order response:");
            console.log(body);
            res.status(200).send(body.data);
        })
        .catch(function(err) { // handle all response status code other than OK 200
            console.log(err.response);
            console.log(`Error in authController.authorize error received from Get All Orders request: ${err}`);
            res.status(500).send({ error: `Error response received from Get All Ordersrequest: ${err}` });
        });

        console.log('orderController.getAllOrders end');
    } catch (err) {
        console.log(`Error in orderController.getAllOrders: ${err}`);
        res.status(500).send('Internal Server Error during Get All Orders request.');
    }
}