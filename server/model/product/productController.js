
const Product = require('./product');


async function create(payload, callback) {
    if (payload.pN && payload.pP) {
        const product = new Product({
            pN: payload.pN,
            pP: payload.pP
        });
            product.save((err, data) => {
            if (err)
                callback(err);
            else
                callback(null, data);
        });
    } else {
        callback('please send data')
    }
}




async function getProducts(callback) {
    callback(null,'ok product')
}


module.exports = { create,getProducts };