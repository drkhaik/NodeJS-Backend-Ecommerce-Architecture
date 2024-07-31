'use strict'
// With strict mode, you can not use undeclared variables.

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: String,
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture', 'Books', 'Others'],
    },
    product_owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// define the product type = clothing

const clothingSchema = new Schema({
    brand: { type: String, required: true, },
    size: String,
    material: String
},{
    collection: 'clothes',
    timestamps: true
});

// define the product type = electronics

const electronicSchema = new Schema({
    manufacturer: { type: String, required: true, },
    model: String,
    color: String,
    warranty_period: Number
}, {
    collection: 'electronics',
    timestamps: true
});

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronics', electronicSchema),
}