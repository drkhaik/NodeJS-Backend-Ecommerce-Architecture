'use strict'

const { inventory } = require('../models/inventory.model');
const { findProductById } = require('../models/repositories/product.repo');
const { BadRequestError } = require('../core/error.response');

class InventoryService {
    static async addStockToInventory({ product_id, shop_owner, stock, location = 'unknown' }) {
        const product = await findProductById({ product_id });
        if(!product) throw new BadRequestError('Product does not exist!');

        const query = { inven_product_id: product_id, inven_shop_owner: shop_owner },
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            },
        }, options = { new: true, upsert: true };

        return await inventory.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService;