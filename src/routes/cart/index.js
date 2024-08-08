'use strict'

const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');


router.post('', asyncHandler(cartController.addToCart));
router.get('', asyncHandler(cartController.getListCart));
router.post('/update', asyncHandler(cartController.updateCartItem));
router.delete('', asyncHandler(cartController.deleteCartItem));

module.exports = router;
