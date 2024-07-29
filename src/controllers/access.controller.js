'use strict'

const AccessService = require("../services/access.service");

const { OK, CREATED, SuccessResponse } = require("../core/success.response");


class AccessController {
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success',
            metadata: await AccessService.logout(req.keyStore),
        }).send(res);
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body), // req.body is object
        }).send(res);
    }

    signUp = async (req, res, next) => {
        // return res.status(200).json({
        //     message: 'success',
        //     metadata:
        // });
        new CREATED({
            message: 'Registered Success',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res);

    }
}

module.exports = new AccessController();