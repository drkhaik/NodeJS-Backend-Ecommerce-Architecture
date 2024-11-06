'use strict'
// With strict mode, you can not use undeclared variables.

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

/* 
const role_grants_of_admin = [
    {
        resource: profile,
        actions: ['create', 'read', 'update:any', 'delete'],
        attributes: 'name, age, phone, address'  // Chỉ cho phép truy cập vào thuộc tính name, age, phone, address của profile
    },
    {
        resource: balance,
        actions: ['read', 'update:any'],
        attributes: '*, !amount'  // Cho phép truy cập vào tất cả các thuộc tính của đơn hàng
    }
]

const role_grants_of_shop = [
    {
        resource: profile,
        actions: ['read', 'update:own', 'delete'],
        attributes: '*'  // Cho phép truy cập vào tất cả các thuộc tính của profile
    },
    {
        resource: balance,
        actions: ['read', 'update:own'],
        attributes: '*'  // Cho phép truy cập vào tất cả các thuộc tính của balance
    }
]

*/

const roleSchema = new Schema({
    role_name: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] },
    role_slug: { type: String, required: true }, // 000012
    role_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    role_description: { type: String, default: '' },
    role_grants: [
        {
            resource: { type: Schema.Types.ObjectId, ref: 'Resource' },
            actions: [{ type: String, required: true}],
            attributes: { type: String, default: '*'}
        }
    ]
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, roleSchema)
