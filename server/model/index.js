const express = require("express");

const userRoute = require('./users/userRoute');
const productRoute = require('./product/productRoute');
const authRoute = require('../model/auth/authRoutes');

module.exports = [
    userRoute,
    productRoute,
    authRoute
];
