'use strict'

const express = require('express');
const { profiles, profile } = require('../../controllers/profile.controller');
const { grantAccess } = require('../../middlewares/rbac');
const router = express.Router();

// profile
// admin
router.get('/viewAny', grantAccess('readAny', 'profile'), profiles);

router.get('/viewOwn', grantAccess('readOwn', 'profile'), profile);

module.exports = router;
