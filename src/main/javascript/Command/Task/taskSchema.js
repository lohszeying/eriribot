const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    }
})

module.exports = mongoose.model('task', schema, 'task');