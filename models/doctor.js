const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    worksIn: {
        type: String,
        required: true
    },
    state: {
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

module.exports = mongoose.model('Doctor', doctorSchema);