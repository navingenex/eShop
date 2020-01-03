const express = require('express');
const router = express.Router();

const userController = require('./userController');

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


router.get('/user', (req, res) => {
    userController.getUser((err, data) => {
        if (err)
            res.send('no data');
        else
            res.send(data);
    })
    
});

module.exports = router;