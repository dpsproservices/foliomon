const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const morgan = require('morgan');
const bodyParser = require("body-parser");
const config = require('./config/config');
const routes = require('./routes/routes');
const AppController = require('./controllers/appController');
const util = require('util');
const path = require('path');
require("dotenv").config();

const app = express();
if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
}
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.use(express.static("front-end/build"));

const httpsServer = https.createServer(config.webServer.sslKeyCert, app);

async function startServer() {
    try {
        console.log("Starting Web Server...");
        // Connect MongoDB
        await mongoose.connect(config.mongodb.url, { useNewUrlParser: true })
            .then(() => console.log('MongoDB connected…'))
            .catch(err => console.log(err));

        /*
        httpServer.listen(config.webServer.httpPort, () => {
            console.log(`httpServer running at http://${config.webServer.hostname}:${config.webServer.httpPort}/`)
        });
        */

        await httpsServer.listen(config.webServer.httpsPort, () => {
            console.log(`Web Server running at https://${config.webServer.hostname}:${config.webServer.httpsPort}/`);
        });
       
        // run the app scheduled jobs
        //await AppController.runMainEventLoop();

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

// Gracefully stop the app server close db connection and exit
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    httpsServer.close(() => {
        console.log('Https server closed.');
        // boolean means [force], see in mongoose doc
        mongoose.connection.close(false, () => {
            console.log('MongoDb connection closed.');
            process.exit(0);
        });
    });
});

startServer();