const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * defining user schema
 */
const User = new Schema({
    userName: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim:true
    }
});

module.exports = mongoose.model('users', User);