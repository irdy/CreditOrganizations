const mongoose = require('mongoose');
const participantInfoSchema = require('./participantInfo.model');

const Schema = mongoose.Schema;

const creditOrganizationSchema = new Schema({
    BIC: {type: Number, required: true},
    ParticipantInfo: participantInfoSchema
});

const model = mongoose.model('Credit_Organization', creditOrganizationSchema);
module.exports = model;