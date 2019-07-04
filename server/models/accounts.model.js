const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountsSchema = new Schema({
    Account: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{20}/.test(v);
            },
            message: props => `${props.value} is not a valid account!`
        },
        required: [true, 'account required']
    }
});

module.exports = accountsSchema;