'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication, authenticationV2 } = require('../../auth/authUtils');

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('', asyncHandler(productController.findAllProducts));
router.get('/:id', asyncHandler(productController.findProduct));

// authentication
router.use(authenticationV2); // authentication per request

router.post('', asyncHandler(productController.createProduct));
router.patch('/:id', asyncHandler(productController.updateProduct));
router.post('/published/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublished/:id', asyncHandler(productController.unPublishProductByShop));

// QUERY //
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishForShop));
// END QUERY //

module.exports = router;
