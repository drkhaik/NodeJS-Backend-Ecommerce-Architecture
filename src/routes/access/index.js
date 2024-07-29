'use strict'

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');

// authentication
router.use(authentication); // authentication per request

// signup & login
// add asyncHandler to catch and handle async errors and reduce 
// try catch of each function inside
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// logout
router.post('/shop/logout', asyncHandler(accessController.logout));

module.exports = router;
