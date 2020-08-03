const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    reportResult: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    }
})

module.exports = mongoose.model('Report', reportSchema);