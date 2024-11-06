'use strict'
// With strict mode, you can not use undeclared variables.

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new Schema({
    user_id: { type: Number, required: true }, // global,
    user_slug: { type: String, required: true }, // virtual id of user (asd34ascad)
    user_name: { type: String, default: '' },
    user_password: { type: String, default: '' },
    user_salf: { type: String, default: '' },
    user_email: { type: String, required: true },
    user_phone: { type: String, default: '' },
    user_sex: { type: String, default: '' },
    user_avatar: { type: String, default: '' },
    user_dob: { type: Date, default: null },
    user_role: { type: Schema.Types.ObjectId, ref: 'Role' }, // admin, user, shop
    user_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block']}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports =  model(DOCUMENT_NAME, userSchema)