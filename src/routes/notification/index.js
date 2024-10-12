'use strict'

const express = require('express');
const router = express.Router();
const NotificationController = require('../../controllers/notification.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');

// here are user not login
// authentication
router.use(authenticationV2); // authentication per request

router.get('', asyncHandler(NotificationController.listNotiByUser));


module.exports = router;
