'use strict'
// With strict mode, you can not use undeclared variables.

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Resource';
const COLLECTION_NAME = 'Resources';

const resourceSchema = new Schema({
    src_name: { type: String, required: true },
    src_slug: { type: String, required: true },
    src_description: { type: String, default: '' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, resourceSchema)
