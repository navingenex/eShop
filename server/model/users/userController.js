const User=require('./user')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CONSTANT = require('../../constants');
async function create(userData, callback) {
    if (userData.userName && userData.email) {
        const user = new User({
            userName: userData.userName,
            email: userData.email,
            password: userData.password,
            name: userData.name
        });        
        user.save((err, data) => {
            if (err)
                callback(err);
            else {
                authenticate(user,userData.password, (err, res) => {
                    if (err)
                        callback(err)
                    else {
                        update(user.email, res, (err, response) => {
                            if (err)
                                callback(err)
                            else
                                callback(response)
                        });
                    }                        
                });
            }
                
        });
    }
}


async function authenticate(user,plainPassword,callback) {
    User.findOne({ email: user.email }, (err, data) => {
        if (err)
            callback(err)
        else if (!data)
            callback(null,null)
        else {
            if (bcrypt.compareSync(plainPassword, data.password)) {
                const token = jwt.sign({ id: data._id }, CONSTANT.SECRET, { expiresIn: '30d' });
                callback(null,token)
            }
        }
    })
}

async function update(email,token,callback) {
    if (email) {
        User.findOneAndUpdate({ email: email }, { $set: { accessToken: token } }, (err, data) => {
            if (err)
                callback(err);
            else
                callback(null,data)
        })
    }
}
async function getUser(callback) {
    const users = User.find((err, data) => {
        if (err)
            callback(err);
        else
            callback(null, data);
    });
}

module.exports = { getUser,create,authenticate,update };