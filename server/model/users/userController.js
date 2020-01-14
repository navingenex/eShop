const User = require('./user')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CONSTANT = require('../../constants');

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
                            module.exports.authenticate(user, userData.password, (err, res) => {
                                if (err)
                                    callback(err)
                                else {
                                    module.exports.update(user.id, res, (err, response) => {
                                        if (err)
                                            callback(err)
                                        else
                                            callback(null,response)
                                    });
                                }
                            });
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
                callback(null, null)
            else {
                if (bcrypt.compareSync(plainPassword, data.password)) {
                    const token = jwt.sign({ id: data._id }, CONSTANT.SECRET, { expiresIn: '30d' });
                    callback(null, token)
                } else {
                    const err=new Error('Password is wrong')
                    callback(err)
                }
            }
        })
    },

    update: async function update(_id, token, callback) {
        if (_id) {
            User.findOneAndUpdate({ _id: _id }, { accessToken: token },{} , (err, data) => {
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
            User.findOneAndUpdate({_id:user},{image:imageD},{},(err, data) => {
                if (err)
                    callback(err)
                else
                    callback(null, data);
            })
        }
    }
}

