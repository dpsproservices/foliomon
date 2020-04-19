const schedule = require('node-schedule');
const config = require('../config/config');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError } = require('../services/errors/ServiceErrors');
const AuthController = require('./AuthController');
const AccountController = require('./AccountController');
const OrderController = require('./OrderController');

const controller = {

    initializeApp: async () => {
        try {
            await AccountController.initializeAccounts();
            await OrderController.initializeOrders();
        } catch (err) {
            console.log(err.message);
        }
    },

    runMarketOpenEvents: async () => {
        const timeNow = new Date();
        console.log(`runMarketOpenEvents START ${timeNow}`);
    },

    runMarketCloseEvents: async () => {
        const timeNow = new Date();
        console.log(`runMarketCloseEvents START ${timeNow}`);
    },

    // Precondition: Run after web server starts and db is running and connected.
    runMainEventLoop: async () => {
        try {
            /*
            RecurrenceRule properties
            second(0 - 59)
            minute(0 - 59)
            hour(0 - 23)
            date(1 - 31)
            month(0 - 11) Jan = 0 , Dec = 11
            year YYYY
            dayOfWeek(0 - 6) Starting with Sunday = 0 , Saturday = 6
            */

            // Run authorize job every weekday M T W TH F every 20 minutes between 8:00 AM and 5:00 PM EST
            // const authorizeRecurrenceRule = { rule: '*/20 8-17 * * 1-5' };

            const authorizeRecurrenceRule = { rule: '*/1 * * * *' };

            const authorizeScheduleJob = schedule.scheduleJob(authorizeRecurrenceRule, async function (jobRunAtDate) {
                console.log('authorizeRecurrenceRule is scheduled to run at ' + jobRunAtDate + ', date time now: ' + new Date());
                let isAppAuthorized = await AuthController.authorizeApp();
            });

            // Run market pre-open job every weekday M T W TH F at 8:15 AM EST
            let marketOpenRecurrenceRule = new schedule.RecurrenceRule();
            marketOpenRecurrenceRule.dayOfWeek = [new schedule.Range(1, 5)];
            marketOpenRecurrenceRule.hour = 8;
            marketOpenRecurrenceRule.minute = 15;
            const marketOpenScheduleJob = schedule.scheduleJob(marketOpenRecurrenceRule, async function (jobRunAtDate) {
                console.log('marketOpenRecurrenceRule is scheduled to run at ' + jobRunAtDate + ', date time now: ' + new Date());

                let isAppAuthorized = await AuthController.authorizeApp();

                if (isAppAuthorized) {
                    await runMarketOpenEvents();
                } else {
                    console.log('marketOpenRecurrenceRule App is not authorized.');
                }
            });

            // Run market close job every weekday M T W TH F at 5:00 PM EST
            let marketCloseRecurrenceRule = new schedule.RecurrenceRule();
            marketCloseRecurrenceRule.dayOfWeek = [new schedule.Range(1, 5)];
            marketCloseRecurrenceRule.hour = 17;
            marketCloseRecurrenceRule.minute = 0;
            const marketCloseScheduleJob = schedule.scheduleJob(marketCloseRecurrenceRule, async function (jobRunAtDate) {
                console.log('marketCloseRecurrenceRule is scheduled to run at ' + jobRunAtDate + ', date time now: ' + new Date());
                let isAppAuthorized = await AuthController.authorizeApp();

                if (isAppAuthorized) {
                    await runMarketCloseEvents();
                } else {
                    console.log('marketCloseRecurrenceRule App is not authorized.');
                }
            });

        } catch (err) {
            console.log(err);
            process.exit(1)
        }
    }

};
module.exports = controller;