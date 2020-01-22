const express = require('express');
const router = express.Router();

const authController = require('./authController');


//login
router.post('/login', (req, res) => {
    authController.signingIn(req.body, (err, data) => {
        if (err)
            res.status(400).send(err);
        else
            res.send(data);
    })
});


//logout
router.put('/logout', authController.authenticate, (req, res) => {
    authController.logout(req.headers.authorization, (err, data) => {
        if (err)
            res.status(400).send(err);
        else
            res.send({ data: [], success: true });
    })
});
router.post('/user/getResetPasswordToken', (req, res) => {
    authController.resetPasswordToken(req.body, (err, data) => {
        if (err)
            res.send(err);
        else
            res.send(data);
    })
});
router.post('/user/verifyPasswordToken', (req, res) => {
    authController.verifyPasswordToken(req.body, (err, verified) => {
        if (err)
            res.send(err);
        else if (!verified)
            res.send('Internel server error');
        else
            res.send({ data: {}, success: true });
    });
});
router.put('/user/resetPassword', (req, res) => {
    authController.resetPassword(req.body, (err, data) => {
        if (err)
            res.send(err);
        else if (!data)
            res.send('Internal server error');
        else
            res.send(data);
    })
});

module.exports = router;