const  express = require('express');
const router = express.Router();

const authController = require('./authController');


//login
router.post('/login', (req, res) => {
    authController.signingIn(req.body, (err, data) => {
        res.send(data);
    })
});


//logout
router.put('/logout', (req, res) => {
    authController.logout(req.headers.authorization, (err, data) => {
        if (err)
            res.status(400).send(err);
        else
            res.send(data);
    })
});

module.exports = router;