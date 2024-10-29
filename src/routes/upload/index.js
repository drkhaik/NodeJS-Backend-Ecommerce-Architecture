'use strict'

const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');


router.post('/product', asyncHandler(uploadController.uploadFile));
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb));

// upload file to S3
router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadFileFromLocalS3));

module.exports = router;
