const config = require('../config/config.js');
const TokenService = require('../services/TokenService');
const axios = require('axios');
const moment = require('moment');

exports.getAllOrders = async (req, res) => {
    try {
        console.log('orderController.getAllOrders begin');

        const token = await TokenService.getAccessToken();

        const url = `${config.auth.apiUrl}/orders`;

        var currentDate = moment();
        var todayDate = currentDate.format('YYYY-MM-DD');
        var sixtyDaysAgo = currentDate.subtract(60, 'days').format('YYYY-MM-DD');

        //console.log({ currentDate });
        //console.log({ todayDate });
        //console.log({ sixtyDaysAgo });

        const params = {
            //accountId: '487446418', // Account number.
            //maxResults: 100, // The maximum number of orders to retrieve.
            fromEnteredTime: sixtyDaysAgo, // yyyy-MM-dd. Date must be within 60 days from today's date.
            toEnteredTime: todayDate //, // yyyy-MM-dd
            //status: // Specifies that only orders of this status should be returned.
        };

        const options = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token.accessToken}` },
            params: params,
            url
        };

        axios(options)
        .then(function(body) { // reply body parsed with implied status code 200 from TD
            res.status(200).send(body.data);
        })
        .catch(function(err) { // handle all response status code other than OK 200
            //console.log(err.response);
            console.log(`Error in authController.authorize error received from Get All Orders request: ${err.response.message}`);
            res.status(500).send({ error: `Error response received from Get All Orders request: ${err}` });
        });

        console.log('orderController.getAllOrders end');
    } catch (err) {
        console.log(`Error in orderController.getAllOrders: ${err}`);
        res.status(500).send('Internal Server Error during Get All Orders request.');
    }
}