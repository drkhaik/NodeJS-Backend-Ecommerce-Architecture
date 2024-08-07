'use strict'
// With strict mode, you can not use undeclared variables.

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, // percentage, fixed_amount
    discount_value: { type: Number, required: true }, // 10.000 10%
    discount_max_value: { type: Number, required: true }, // 10.000 10%
    discount_code: {type: String, required: true},
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_use: { type: Number, required: true }, // how many times this discount can be used
    discount_use_count: { type: Number, required: true }, // how many times this discount has been used
    discount_users_used: { type: Array, default: [] }, // which users have used this discount
    discount_max_use_per_user: { type: Number, required: true }, // how many times this discount can be used by a user
    discount_min_order_value: { type: Number, required: true }, // minimum order value to use this discount
    discount_shop_owner: { type: Schema.Types.ObjectId, ref: 'Shop' }, // which shop this discount belongs to
    discount_is_active: { type: Boolean, default: true },
    discount_apply_to: {type: String, required: true, enum: ['all', 'specific']},
    discount_product_ids: { type: Array, default: [] }, // which products this discount applies to
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


module.exports = model(DOCUMENT_NAME, discountSchema);