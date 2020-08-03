const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Patient', patientSchema);