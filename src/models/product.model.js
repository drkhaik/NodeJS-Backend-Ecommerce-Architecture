'use strict'
// With strict mode, you can not use undeclared variables.

const { model, Schema, Types } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: { type: String,required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number,required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture', 'Books', 'Others'],},
    product_owner: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    // more
    product_average_rating: { 
        type: Number, 
        default: 4.5, 
        min: [1, 'Rating must be above 1.0'], 
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {type: Array, default: []},
    // Without indexes, MongoDB must scan every document in a collection to return query results. If an appropriate index exists for a query, MongoDB uses the index to limit the number of documents it must scan.
    // Select false means that the field will not be returned in the query result like find, findOne, etc. 
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// Create index for search
productSchema.index({ product_name: 'text', product_description: 'text' });

// Document middleware: run before .save() and .create()...
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

// define the product type = clothing

const clothingSchema = new Schema({
    brand: { type: String, required: true, },
    size: String,
    material: String,
    product_owner: { type: Schema.Types.ObjectId, ref: 'Shop' }
},{
    collection: 'clothes',
    timestamps: true
});

// define the product type = electronics

const electronicSchema = new Schema({
    manufacturer: { type: String, required: true, },
    model: String,
    color: String,
    warranty_period: Number,
    product_owner: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'electronics',
    timestamps: true
});

// define the product type = furniture

const furnitureSchema = new Schema({
    brand: { type: String, required: true, },
    size: String,
    material: String,
    product_owner: { type: Schema.Types.ObjectId, ref: 'Shop' }

}, {
    collection: 'furniture',
    timestamps: true
});

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronics', electronicSchema),
    furniture: model('Furniture', furnitureSchema),
}