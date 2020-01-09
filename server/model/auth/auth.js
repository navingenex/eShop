const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Auth = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    accessToken: {
        type: String,
        default: null,
        trim: true
    }
}, {
    timestamps:true
});

module.exports=mongoose.model('auth',Auth)