const Auth = require('./auth');
const Error = require('http-errors');
const jwt = require("jsonwebtoken");

const User = require('../users/user');
const CONSTANT = require('../../constants');
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
                auth.save().then(() => {                    
                    callback(null, auth)
                }).catch(err => callback(err));
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
        if (req.headers.authorization) {
            module.exports.verifyToken(req, (err, isVerified) => {
                if (err)
                    next({ message: new Error('Not authorised') });
                else {
                    next(null, isVerified)
                }
            })
            
        } else
            next({message:new Error('Access denide. token unavailable')})
             
    },
    //verifing token 
    verifyToken:async function verifyToken(req,callback){
        const decoded = jwt.verify(req.headers.authorization, CONSTANT.SECRET);
        try {
            const user = await Auth.findOne({ accessToken: req.headers.authorization });
            if (!user)
                throw new Error({message:"not authorised"});
            callback(null,true)
        } catch (error) {
            callback(error)
        }
    }
    

}



