'use strict'

const cartService = require('../services/cart.service');
const { SuccessResponse } = require("../core/success.response");

class CartController {
    /**
     * @description Add product to cart
     * @param {int} userId
     * @param {Object} product
     * @return {JSON}
     * @method POST
     */
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart Success!',
            metadata: await cartService.addToCart(req.body),
        }).send(res);
    }

    updateCartItem = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Cart item Success!',
            metadata: await cartService.updateCartItem(req.body),
        }).send(res);
    }

    deleteCartItem = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart item Success!',
            metadata: await cartService.deleteCartItem(req.body),
        }).send(res);
    }

    getListCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Cart Item Success!',
            metadata: await cartService.getListCart(req.query),
        }).send(res);
    }

}

module.exports = new CartController();