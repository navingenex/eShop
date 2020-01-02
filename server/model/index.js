const express = require("express");

const userRoute = require('./users/userRoute');
const productRoute = require('./product/productRoute');
module.exports = [
    userRoute,
    productRoute
];
