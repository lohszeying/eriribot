const mongoose = require('mongoose');

const primogemsUserSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('PrimogemsUserSchema', primogemsUserSchema, 'PrimogemsUserSchema');