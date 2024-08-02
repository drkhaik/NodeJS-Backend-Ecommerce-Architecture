'use strict'

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication, authenticationV2} = require('../../auth/authUtils');


// signup & login
// add asyncHandler to catch and handle async errors and reduce 
// try catch of each function inside
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));


// authentication
router.use(authenticationV2); // authentication per request

// logout
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

module.exports = router;
