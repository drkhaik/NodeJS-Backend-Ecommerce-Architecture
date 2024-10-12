'use strict'

const express = require('express');
const router = express.Router();
const CommentController = require('../../controllers/comment.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');

// authentication
router.use(authenticationV2); // authentication per request

router.post('', asyncHandler(CommentController.addComment));
router.delete('', asyncHandler(CommentController.deleteComment));
router.get('', asyncHandler(CommentController.getComments));


module.exports = router;
