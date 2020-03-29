const config = require('../config/config.js');
const { getAccessToken } = require('./authController.js');
const axios = require('axios');

exports.getAllOrders = async (req, res) => {
    try {
        console.log('orderController.getAllOrders begin');

        const token = await getAccessToken();

        const url = `${config.auth.apiUrl}/orders`;

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