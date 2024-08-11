'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /**
        order_checkout = {
            totalPrice,
            shippingFee,
            totalDiscount,
            totalCheckout,
        };
    */
    order_shipping: { type: Object, default: {} },
    /**
        order_shipping = {
            street,
            city,
            state,
            country,
        };
    */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_tracking_number: { type: String, default: '#0000112082024' },
    order_status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'canceled'], default: 'pending' },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema),
};