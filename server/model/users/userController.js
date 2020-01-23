const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//local modules
const User = require('./user')
const CONSTANT = require('../../constants');
const databaseFunctions = require("../../shared/dabaseFunctions");
const universalFunctions = require("../../shared/universalFunctions");
const fs = require('fs');

module.exports = {
    create: async function create(userData, callback) {
        if (userData.userName && userData.email) {
            const user = new User({
                userName: userData.userName,
                email: userData.email,
                password: userData.password,
                name: userData.name
            });
            User.findOne({ email: userData.email }, (err, record) => {
                if (err)
                    callback(err);
                else if (record)
                    callback('user already exists');
                else {
                    user.save((err, data) => {
                        if (err)
                            callback(err);
                        else {
                            var msg = {
                                to: data.email,
                                from: CONSTANT.FORGOTPASSWORDMAILID,
                                subject: 'Verify email',
                                text: 'Verify email ',
                                html: `
                                    <div>
                                        <a href="http://localhost:4200/verify-userEmail/${data.id}">Click here to verify your email</a>
                                    </div>
                                `
                            };
                            universalFunctions.sendMail(msg, (err, response) => {
                                if (err)
                                    console.log(err);
                                else
                                    callback(null, data)
                            })

                        }

                    });
                }
            })

        }
    },


    authenticate: async function authenticate(user, plainPassword, callback) {
        User.findOne({ email: user.email }, (err, data) => {
            if (err)
                callback(err)
            else if (!data)
                callback({
                    error: [
                        { message: 'No user found by this email' }
                    ], success: false
                });
            else {
                if (bcrypt.compareSync(plainPassword, data.password)) {
                    const token = jwt.sign({ id: data._id }, CONSTANT.SECRET, { expiresIn: '30d' });
                    databaseFunctions.updateOne(User, { _id: data.id }, { accessToken: token }, { new: true }, (error, userData) => {
                        if (error)
                            callback(error)
                        else
                            callback(null, userData)
                    });
                } else {
                    callback({
                        error: [
                            { message: 'Wrong password' }
                        ], success: false
                    });
                }
            }
        })
    },

    update: async function update(_id, token, callback) {
        if (_id) {
            User.findOneAndUpdate({ _id: _id }, { accessToken: token }, {}, (err, data) => {
                if (err)
                    callback(err);
                else
                    callback(null, data)
            })
        }
    },
    getUser: async function getUser(callback) {
        const users = User.find((err, data) => {
            if (err)
                callback(err);
            else
                callback(null, data);
        });
    },
    getUserById: async function getUserById(_id, callback) {
        if (_id) {
            User.findById({ _id: _id }, {}, {}, (err, data) => {
                if (err)
                    callback(err);
                else
                    callback(null, data);
            });
        } else {
            callback('Please send userId');
        }
    },
    uploadImage: async function uploadImage(payload, callback) {
        if (payload) {
            var user = payload.user;
            var imageD = {}
            imageD.data = fs.readFileSync(payload.imagePath);
            imageD.contentType = "image/png";
            User.findOneAndUpdate({ _id: user }, { image: imageD }, {}, (err, data) => {
                if (err)
                    callback(err)
                else
                    callback(null, data);
            })
        }
    },
    verifyEmail: function verifyEmail(payload, callback) {
        databaseFunctions.find(User, payload, {}, {}, (err, data) => {
            if (err)
                callback(err);
            else if (!data)
                callback({ data: [], success: false });
            else if (data[0].emailVerified)
                callback(null, data)
            else {
                databaseFunctions.updateOne(User, { _id: data[0].id }, { emailVerified: true }, { new: true }, (err, response) => {
                    if (err)
                        callback(err);
                    else
                        callback(null, response)
                })
            }
        });
    }
}

