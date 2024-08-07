'use strict'

const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');

router.post('/amount', asyncHandler(discountController.checkDiscountAmount));
router.get('/get-list-product', asyncHandler(discountController.getAllProductByDiscountCode));

// add asyncHandler to catch and handle async errors and reduce 
// try catch of each function inside
router.use(authenticationV2); // authentication per request

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCode));
router.delete('/:code', asyncHandler(discountController.deleteDiscountCode));

module.exports = router;
