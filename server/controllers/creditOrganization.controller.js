const Credit_Organization = require('../models/creditOrganization.model');

const fields = 'BIC';

const getEntries = (req, res, next) => {
    //res.send('get entries!');
    Credit_Organization.find({}, fields, (err, org) => {
        if (err) return next(err);
        res.send(org);
        next();
    });
};

const getEntry = (req, res, next) => {
    //res.send('get entry!');
    Credit_Organization.find({BIC: req.params.bic}, (err, org) => {
        if (err) return next(err);
        res.send(org);
        next();
    });
};

const createEntry = (req, res, next) => {
    res.send('create entry!');
    next();
};

const updateEntry = (req, res, next) => {
    res.send('update entry');
    next();
};

const deleteEntry = (req, res, next) => {
    res.send('delete entry');
    next();
};

module.exports = {
    getEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry
};