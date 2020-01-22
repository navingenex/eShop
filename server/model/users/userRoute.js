const express = require('express');
const router = express.Router();
const path = require('path');

const CONSTANT = require('../../constants');





// const io = require('../../server').io;
const userController = require('./userController');
const authController = require('../auth/authController');
router.post('/user', (req, res) => {
    userController.create(req.body, (err, data) => {
        if (err) {
            res.status(400);
            res.send(err);
        } else {
            let io = req.app.get('socketio');
            io.emit('getuser', data)
            res.send(data);
        }

    })
});

router.get('/user', authController.authenticate, (req, res) => {
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
        user: req.params._id
    }, (err, data) => {
        if (err)
            res.send(err);
        else
            res.send('uploaded');
    })
    //     }
    // });
});

router.post('/user/forgotPassword', (req, res) => {
    userController.forgotPassword(req.body, (err, data) => {
        if (err)
            res.send(err);
        else if (!data)
            res.send({ message: new Error('You are not registered with us.') });
        else
            res.send(data);
    })
});

module.exports = router;