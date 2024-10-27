'use strict'

const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');
const { uploadDisk } = require('../../configs/multer.config');


router.post('/product', asyncHandler(uploadController.uploadFile));
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb));

module.exports = router;
