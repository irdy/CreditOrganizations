const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/creditOrganization.route');
const mongoose = require('mongoose');
//const formidableMiddleware = require('express-formidable');
const { getErrorStatus } = require('./errorStatuses');

const app = express();
const APP_PORT = 3002;

// connection with database
const DB_URL = 'mongodb://admin:admin@localhost/cod';
mongoose.connect(DB_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let { connection } = mongoose;
connection.on('connected', () => {console.log('successfully connected to database')});
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// apply bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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