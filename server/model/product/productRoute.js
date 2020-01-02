const express = require('express');
const router = express.Router();

const productController = require('./productController');


router.post('/products', (req, res) => {
    productController.create(req.body, (err, data) => {
        if (err)
            res.send(err);
        else
            res.send(data);
    });
});

router.get('/products', (req, res) => {
    productController.getProducts((err, data) => {
        if (err)
            res.send(err);
        else
            res.send(data);
    });
});



module.exports = router;
