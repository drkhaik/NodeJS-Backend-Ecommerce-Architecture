'use strict'

const discountService = require('../services/discount.service');
const { SuccessResponse } = require("../core/success.response");

class DiscountController {
    createDiscountCode = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create new Discount Code Success',
            metadata: await discountService.createDiscountCode({
                ...req.body,
                shop_owner: req.user.userId
            }),
        }).send(res);
    }

    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all Discount Code Success',
            metadata: await discountService.getAllDiscountCodeByShop({
                ...req.query,
                shop_owner: req.user.userId
            }),
        }).send(res);
    }

    checkDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Apply Discount Code Success',
            metadata: await discountService.checkDiscountAmount({
                ...req.body,
                // shop_owner: req.user.userId
            }),
        }).send(res);
    }

    getAllProductByDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all Product by Discount Code Success',
            metadata: await discountService.getAllProductByDiscountCode({
                ...req.query,
            }),
        }).send(res);
    }

    deleteDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Deleted Discount Code Success',
            metadata: await discountService.deleteDiscountCode({
                ...req.query,
                shop_owner: req.user.userId
            }),
        }).send(res);
    }


}

module.exports = new DiscountController();