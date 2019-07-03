const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* model example:
    "ParticipantInfo" : {
        "NameP" : "ФИНАНСОВЫЙ Д-Т БАНКА РОССИИ",
        "Rgn" : "45",
        "Ind" : "107016",
        "Tnp" : "г.",
        "Nnp" : "Москва 701",
        "Adr" : "ул Неглинная, 12",
        "PrntBIC" : "044537002",
        "DateIn" : "1994-01-20",
        "PtType" : "15",
        "Srvcs" : "3",
        "XchType" : "1",
        "UID" : "4536002000",
        "NPSParticipant" : "1",
        "ParticipantStatus" : "PSAC"
    }
 */

// {type: Number, required: true}

const participantInfoSchema = new Schema({
    "NameP" : {type: String, required: true},
    "Rgn" : {type: Number, required: true},
    "Ind" : {type: Number, required: true},
    "Tnp" : {type: String, required: true},
    "Nnp" : {type: String, required: true},
    "Adr" : {type: String, required: true},
    "PrntBIC" : {type: Number, required: true},
    "DateIn" : {type: String, required: true},
    "PtType" : {type: Number, required: true},
    "Srvcs" : {type: Number, required: true},
    "XchType" : {type: Number, required: true},
    "UID" : {type: Number, required: true},
    "NPSParticipant" : {type: Number, required: true},
    "ParticipantStatus" : {type: String, required: true}
    // "NameP" : {type: String, required: true},
    // "Rgn" : {type: String, required: true},
    // "Ind" : {type: String, required: true},
    // "Tnp" : {type: String, required: true},
    // "Nnp" : {type: String, required: true},
    // "Adr" : {type: String, required: true},
    // "PrntBIC" : {type: String, required: true},
    // "DateIn" : {type: String, required: true},
    // "PtType" : {type: String, required: true},
    // "Srvcs" : {type: String, required: true},
    // "XchType" : {type: String, required: true},
    // "UID" : {type: String, required: true},
    // "NPSParticipant" : {type: String, required: true},
    // "ParticipantStatus" : {type: String, required: true}
});

module.exports = participantInfoSchema;