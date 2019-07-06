const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/creditOrganization.route');
const mongoose = require('mongoose');
//const formidableMiddleware = require('express-formidable');
const { getErrorStatus } = require('./errorStatuses');
const formData = require("express-form-data");

const app = express();
const APP_PORT = 3002;

// connection with database
const DB_URL = 'mongodb://admin:admin@localhost/cod';
mongoose.connect(DB_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let { connection } = mongoose;
connection.on('connected', () => {console.log('successfully connected to database')});
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// CORS - https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


// apply bodyParser
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

// apply FormData
app.use(formData.parse({}));

// mount the router on the app
app.use('/', router);

// error handler
function errorHandler(err, req, res, next) {
    let error = {
        name: err.name,
        message: err._message
    };

    res.status(err.status || getErrorStatus(err) || 500);
    console.log(error);
    res.json(error);
}

app.use(errorHandler);

app.listen(APP_PORT, () => {
    console.log(`server is running on port ${APP_PORT}`);
});