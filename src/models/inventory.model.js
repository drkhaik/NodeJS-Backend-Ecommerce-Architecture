'use strict'
// With strict mode, you can not use undeclared variables.

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema({
    inven_product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    inven_location: { type: String, default: 'unknown' },
    inven_stock: { type: Number, required: true },
    inven_shop_owner: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_reservations: { type: Array, default: [] },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}