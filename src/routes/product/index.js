'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');

// authentication
router.use(authentication); // authentication per request

// logout
router.post('', asyncHandler(productController.createProduct));

module.exports = router;
