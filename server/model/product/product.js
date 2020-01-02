const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    pN: {
        type: String,
        required: true,
        trim: true,
    },
    pP: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    cA: {
        type: Date,
        required: true,
        default: Date.now
    },
    uA: {
        type: Date,
        required: true,
        default: Date.now,
    },
    pImg: {
        type: String,
        default: null,
    }
});

module.exports = mongoose.model('products', Product);