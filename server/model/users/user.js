const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const CONSTANT = require('../../constants');
const jwt = require("jsonwebtoken");


/**
 * defining user schema
 */
const User = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        required: false,
        default: null
    },
    image: {
        data: Buffer,
        contentType: String
    },
    accessToken: {
        type: String,
        required: false,
        default: null,
        trim: true
    },
    passwordResetToken: {
        type: String,
        required: false,
        trim: true
    },
    phoneVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    emailVerified: {
        type: Boolean,
        required: false,
        default: false
    },
    role: {
        type: String,
        required: false,
        default: null
    }
});

User.pre('save', function (next) {
    const tempPassword = this.password;
    this.password = bcrypt.hashSync(this.password, CONSTANT.saltRounds);
    if (bcrypt.compareSync(tempPassword, this.password)) {
        const token = jwt.sign({ id: this.id, role: this.role }, CONSTANT.SECRET, { expiresIn: '30d' });
        this.accessToken = token;
        next(null, token);
    } else
        next(null)
    next(null, token);
});

module.exports = mongoose.model('users', User);