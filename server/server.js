const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/creditOrganization.route');
const mongoose = require('mongoose');

const app = express();
const APP_PORT = 3002;

// mount the router on the app
app.use('/', router);

// connection with database
const DB_URL = 'mongodb://admin:admin@localhost/cod';
mongoose.connect(DB_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let { connection } = mongoose;
connection.on('connected', () => {console.log('successfully connected to database')});
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// apply bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.listen(APP_PORT, () => {
    console.log(`server is running on port ${APP_PORT}`);
});