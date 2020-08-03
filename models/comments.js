const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Comment', commentSchema);