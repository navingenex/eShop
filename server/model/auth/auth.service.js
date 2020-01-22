const jwt = require("jsonwebtoken");
const CONSTANT = require("../../constants");
const Error = require("http-errors");
const databaseFunctions = require('../../shared/dabaseFunctions');
const bcrypt = require('bcrypt');
const schemaIndex = require("../../shared/schemaIndex");
module.exports = {
    generateResetPasswordToken: async function generateResetPasswordToken(payload, callback) {
        if (payload.email) {
            const token = jwt.sign({ email: payload.email }, CONSTANT.SECRET, { expiresIn: '10m' });
            databaseFunctions.updateOne(schemaIndex.User, payload, { passwordResetToken: token }, {}, (err, data) => {
                if (err)
                    callback(err);
                else
                    callback(null, token)
            });
        } else
            callback({ message: 'something went wrong' })
    },
    verifyPasswordToken: async function verifyPasswordToken(schema, payload, callback) {
        jwt.verify(payload.passwordResetToken, CONSTANT.SECRET, (err, decodedToket) => {
            if (err)
                callback(err);
            else {
                databaseFunctions.find(schema, { email: decodedToket.email }, {}, {}, (err, data) => {
                    if (data)
                        callback(null, data[0]);
                    else if (err || !data)
                        callback(new Error('Password verification link has been expired'));

                });
            }

        });
    },
    hashPassword: function hashPassword(payload, callback) {
        callback(null, bcrypt.hashSync(payload.password, CONSTANT.saltRounds))

    }
}