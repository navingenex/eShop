const express = require('express');
const router = express.Router();
const path = require('path');

const userController = require('./userController');
const authController = require('../auth/authController');
router.post('/user', (req, res) => {
    userController.create({
        userName: 'navingenex',
        email: 'navin.kiit.nk@gmail.com',
        name: 'Navin kumar',
        password:'tapjam'
    }, (err, data) => {
        if (err) {
            res.status(400);
            res.send(err);
        } else {
            res.send(data);
        }
           
    })
});


router.get('/user', authController.authenticate,(req, res) => {
    userController.getUser((err, data) => {
        if (err)
            res.send('no data');
        else
            res.send(data);
    })
    
});

router.post('/user/imageUpload/:_id', authController.authenticate, (req, res) => {
    // userController.getUserById(req.params._id, (err, data) => {
    //     if (err)
    //         res.send(err);
    //     else {
            userController.uploadImage({
                imagePath: path.join(__dirname + '/qq.png'),
                user:req.params._id
            },(err, data) => {
                if (err)
                    res.send(err);
                else
                    res.send('uploaded');
            })
    //     }
    // });
    
});

module.exports = router;