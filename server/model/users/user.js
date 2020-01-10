const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const saltRounds = 10;
/**
 * defining user schema
 */
const User = new Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim:true
    },
    userName: {
        type: String,
        required: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        trim:true
    },
    profilePicture: {
        type: String,
        required: false,
        default:null
    },
    image: {
        data: Buffer,
        contentType:String
    },
    accessToken: {
        type: String,
        required: false,
        default:null,
        trim:true
    },
    phoneVerified: {
        type: Boolean,
        required: true,
        default:false
    },
    emailVerified: {
        type: Boolean,
        required: false,
        default:false
    },
    userType: {
        type: Boolean,
        required: false,
        default:null
    }
});

User.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

module.exports = mongoose.model('users', User);