'use strict'

// const inventoryService = require('../services/inventory.service');
const { SuccessResponse } = require("../core/success.response");

const dataProfiles = [
    {
        user_id: 1,
        user_name: 'drkhaik',
        user_avt : 'image_drkhaik.jpg',
    },
    {
        user_id: 2,
        user_name: 'ronaldo',
        user_avt : 'image_ronaldo.jpg',
    },
    {
        user_id: 3,
        user_name: 'messi',
        user_avt : 'image_messi.jpg',
    }
]

class ProfileController {

    // admin
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Profiles Success!',
            metadata: dataProfiles,
        }).send(res);
    }

    // shop
    profile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Profile Success!',
            metadata: {
                user_id: 1,
                user_name: 'drkhaik',
                user_avt : 'image_drkhaik.jpg',
            }
        }).send(res);
    }
}

module.exports = new ProfileController();