'use strict'

const express = require('express');
const router = express.Router();
const {
    getResourceList,
    newResource,
    getRoleList,
    newRole
} = require('../../controllers/rbac.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');



router.post('/resource', asyncHandler(newResource));
router.get('/resources', asyncHandler(getResourceList));


router.post('/role', asyncHandler(newRole));
router.get('/roles', asyncHandler(getRoleList));

module.exports = router;
