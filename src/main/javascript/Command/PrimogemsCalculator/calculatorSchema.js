const mongoose = require('mongoose');

const primogemsCalculationSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PrimogemsUserSchema"
    }
})

module.exports = mongoose.model('PrimogemsCalculationSchema', primogemsCalculationSchema, 'PrimogemsCalculationSchema');