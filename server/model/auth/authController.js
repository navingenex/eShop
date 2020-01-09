const Auth = require('./auth');
const Error = require('http-errors');
const userController = require('../users/userController');


module.exports = {
    signingIn: async function signingIn(payload, callback) {
    if (payload.email && payload.password) {
        userController.authenticate(payload, payload.password, (err, token) => {
            if (err)
                callback(err);
            else if(!token)
                callback(null, token)
            else {
                const auth = new Auth({
                    email: payload.email,
                    accessToken: token
                });
                auth.save().then(() => callback(null,auth)).catch(err => callback(err));
            }
                
        })
    } else
        callback(null)
    },
    logout: async function logout(req, callback) {
        if (req)
            Auth.findOne({ accessToken: req }, (err, data) => {
                if (err)
                    callback(err)
                else if (!data)
                    callback(null,null)
                else {
                    Auth.deleteOne({ _id: data.id }, (err, res) => {
                        if (err)
                            callback(err);
                        else
                            callback(null,res)
                    })
                }                    
            })
    },
    //authenticate the requested call
    authenticate: async function authenticate(req, res,next) {
        if (req)
             Auth.findOne({ accessToken: req.headers.authorization}, (err, data) => {
                if (!data)
                    next({ message: new Error('Not authorised') });
                else {
                    return next();
                }                    
            })
    }
    

}



