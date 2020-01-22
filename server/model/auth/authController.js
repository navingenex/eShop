const Auth = require('./auth');
const Error = require('http-errors');
const jwt = require("jsonwebtoken");

const User = require('../users/user');
const CONSTANT = require('../../constants');
const userController = require('../users/userController');
const databaseFunctions = require('../../shared/dabaseFunctions');
const universalFunctions = require('../../shared/universalFunctions');

const authService = require('./auth.service');
module.exports = {
    signingIn: async function signingIn(payload, callback) {
        if (payload.email && payload.password) {
            userController.authenticate(payload, payload.password, (err, user) => {
                if (err)
                    callback(err);
                else if (!user)
                    callback(new Error('Internal server error'))
                else {
                    callback(null, user)
                }

            })
        } else
            callback(null)
    },
    logout: async function logout(req, callback) {
        if (req)
            User.findOne({ accessToken: req }, (err, data) => {
                if (err)
                    callback(err)
                else if (!data)
                    callback(null, null)
                else {
                    databaseFunctions.updateOne(User, { _id: data.id }, { accessToken: null }, { new: true }, (error, response) => {
                        if (error)
                            callback(error);
                        else
                            callback(null, response);
                    });
                }
            })
    },
    //authenticate the requested call
    authenticate: async function authenticate(req, res, next) {
        if (req.headers.authorization) {
            module.exports.verifyToken(req, (err, isVerified) => {
                if (err)
                    next({ message: new Error('Not authorised') });
                else {
                    databaseFunctions.find(User, { accessToken: req.headers.authorization }, {}, {}, (error, response) => {
                        if (error)
                            next({ message: new Error('Access denide. token unavailable') });
                        else
                            next(null, response);
                    })
                }
            })

        } else
            next({ message: new Error('Access denide. token unavailable') })

    },
    //verifing token 
    verifyToken: async function verifyToken(req, callback) {
        jwt.verify(req.headers.authorization, CONSTANT.SECRET, (err, decoded) => {
            if (err)
                callback(err);
            else {
                const user = User.findOne({ accessToken: req.headers.authorization });
                if (!user)
                    callback('Internal server error')
                else
                    callback(null, user)
            }

        });
    },
    resetPasswordToken: async function resetPasswordToken(payload, callback) {
        if (payload.email) {
            databaseFunctions.find(User, payload, {}, {}, (err, data) => {
                if (err)
                    callback(err);
                else if (!data)
                    callback(null, null);
                else {

                    var msg = {
                        to: payload.email,
                        from: CONSTANT.FORGOTPASSWORDMAILID,
                        subject: 'Reset password link',
                        text: 'Forgot password reset link',
                    };
                    authService.generateResetPasswordToken(payload, (err, token) => {
                        if (err)
                            callback(err);
                        else {
                            msg.html = `
                            <div>
                                <a href="http://localhost:4200/passwordToken/${token}">Click here</a>
                            </div>
                            `;
                            universalFunctions.sendMail(msg, (err, response) => {
                                if (err)
                                    callback(err);
                                else
                                    callback(null, { data: { passwordResetToken: token } })
                            })
                        }
                    });
                }
            });
        } else
            callback({ message: new Error('') })
    },
    verifyPasswordToken: async function verifyPasswordToken(payload, callback) {
        authService.verifyPasswordToken(User, payload, (err, verified) => {
            if (verified)
                callback(null, verified);
            else
                callback(err)
        });
    },
    resetPassword: function resetPassword(payload, callback) {
        if (payload.password && payload.passwordResetToken) {
            authService.verifyPasswordToken(User, payload, (err, user) => {
                if (user) {
                    authService.hashPassword(payload, (err, hash) => {
                        databaseFunctions.updateOne(User, { email: user.email }, { password: hash }, {}, (error, data) => {
                            if (error)
                                callback(error)
                            else
                                callback(null, data)
                        })
                    })

                }

                else
                    callback(err)
            })
        } else
            callback(new Error('please send password reset token and password'))
    }


}



