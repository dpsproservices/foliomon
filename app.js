const fs = require('fs');
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const morgan = require('morgan');
const bodyParser = require("body-parser");
const config = require('./config');
const routes = require('./routes');
//const AppController = require('./controllers/appController');

const app = express();
if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
}
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("front-end/build")); 
app.use('/', routes);

const httpsServer = https.createServer(config.webServer.sslKeyCert, app);

// Gracefully stop the app server close db connection and exit
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    httpsServer.close(() => {
        console.log('https server closed.');
        // boolean means [force], see in mongoose doc
        mongoose.connection.close(false, () => {
            console.log('MongoDb connection closed.');
            process.exit(0);
        });
    });
});

try {
    console.log("Starting Web Server...");

    // Connect MongoDB
    
    mongoose.connect(config.mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('MongoDB connected…');
        })
        .catch(err => {
            console.error(err);
            throw err;
        });

    httpsServer.listen(config.webServer.httpsPort, (err) => {

        if(err) {
            console.error(err);
            throw err;  
        }

        console.log(`Web Server running at https://${config.webServer.hostname}:${config.webServer.httpsPort}/`);

    });

    // run the app scheduled jobs
    //await AppController.runMainEventLoop();

} catch (err) {
    console.error(err);
    process.exit(1);
}