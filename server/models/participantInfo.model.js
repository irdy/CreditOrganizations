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

const participantInfoSchema = new Schema({
    "NameP" : {type: String, required: true},
    "Rgn" : {type: String},
    "Ind" : {type: String},
    "Tnp" : {type: String, required: true},
    "Nnp" : {type: String, required: true},
    "Adr" : {type: String, required: true},
    "PrntBIC" : {type: String},
    "DateIn" : {type: String},
    "PtType" : {type: String},
    "Srvcs" : {type: String},
    "XchType" : {type: String},
    "UID" : {type: String},
    "NPSParticipant" : {type: String},
    "ParticipantStatus" : {type: String}
});

module.exports = participantInfoSchema;