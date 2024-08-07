'use strict'

const {model, Schema} = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema({
    cart_status: { type: String, required: true, enum: ['active', 'completed', 'failed', 'pending'], default: 'active' },
    cart_products: { type: Array, required: true, default: [] },
    /**
        [
            {
                product_id,
                shop_owner,
                quantity,
                name,
                price,
            }
        ]
    */
    cart_count_product: { type: Number, required: true, default: 0 },
    cart_user_id: {type: Number, required: true},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema),
};