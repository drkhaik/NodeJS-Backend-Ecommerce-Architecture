'use strict'

const inventoryService = require('../services/inventory.service');
const { SuccessResponse } = require("../core/success.response");

class CartController {

    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add stock to Inventory Success!',
            metadata: await inventoryService.addStockToInventory(req.body),
        }).send(res);
    }

}

module.exports = new CartController();