'use strict'

const checkoutService = require('../services/checkout.service');
const { SuccessResponse } = require("../core/success.response");

class CheckoutController {

    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Checkout Success',
            metadata: await checkoutService.checkoutReview(req.body),
        }).send(res);
    }

}

module.exports = new CheckoutController();