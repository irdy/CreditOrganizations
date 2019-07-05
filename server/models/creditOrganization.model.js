const mongoose = require('mongoose');
const participantInfoSchema = require('./participantInfo.model');
const accountsSchema = require('./accounts.model');

const Schema = mongoose.Schema;

const creditOrganizationSchema = new Schema({
    BIC: {
        type: String,
        match: [/^\d{9}$/, 'BIC must be 9 digits'],
        required: true
    },
    ParticipantInfo: {type: participantInfoSchema, required: true},
    Accounts: [{type: accountsSchema, required: true}]
});

const model = mongoose.model('Credit_Organization', creditOrganizationSchema);
module.exports = model;