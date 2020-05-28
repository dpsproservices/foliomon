const fs = require('fs');
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const morgan = require('morgan');
//const passport = require('passport');
const bodyParser = require("body-parser");
const config = require('./config/config');
const routes = require('./routes');
//const AppController = require('./controllers/appController');
//const util = require('util');
//const path = require('path');
require("dotenv").config();

const app = express();
if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
}
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("front-end/build"));

//app.use(passport.initialize());

app.use('/', routes);

const httpsServer = https.createServer(config.webServer.sslKeyCert, app);

const startServer = async () => {
    try {
        console.log("Starting Web Server...");
        // Connect MongoDB
        await mongoose.connect(config.mongodb.url, { useNewUrlParser: true })
            .then(() => {
                console.log('MongoDB connected…')
                // var addr = server.address();
                // var bind = typeof addr === 'string'
                //     ? 'pipe ' + addr
                //     : 'port ' + addr.port;
                // console.log('Database listening on ' + bind + '...');
            })
            .catch(err => {
                //console.log(err)
                if (err.syscall !== 'listen') {
                    throw err;
                }

                // var bind = typeof port === 'string'
                //     ? 'Pipe ' + port
                //     : 'Port ' + port;

                // handle specific listen errors with friendly messages
                switch (err.code) {
                    case 'EACCES':
                        //console.error(bind + ' requires elevated privileges');
                        console.error('port requires elevated privileges');
                        process.exit(1);
                        break;
                    case 'EADDRINUSE':
                        //console.error(bind + ' is already in use');
                        console.error('port is already in use');
                        process.exit(1);
                        break;
                    default:
                        throw err;
                }
            });

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