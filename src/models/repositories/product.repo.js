'use strict'

const { product, clothing, electronic, furniture } = require('../product.model');
const {Types} = require('mongoose');

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_owner', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}

const findAllDraftsForShop = async({query, limit, skip}) => {
    return await queryProduct({ query, limit, skip });
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

const publishProductByShop = async ({ product_id, product_owner }) => {
    const foundShop = await product.findOne({ 
        _id: new Types.ObjectId(product_id),
        product_owner: new Types.ObjectId(product_owner),
    });
    if(!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    await foundShop.save();

    return foundShop;
}

const unPublishProductByShop = async ({ product_id, product_owner }) => {
    const foundShop = await product.findOne({ 
        _id: new Types.ObjectId(product_id),
        product_owner: new Types.ObjectId(product_owner),
    });
    if(!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;
    await foundShop.save();

    return foundShop;
}

// https://anonystick.com/blog-developer/full-text-search-mongodb-chi-mot-bai-viet-khong-can-nhieu-2022012063033379
const searchProductByUser = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch);
    const result = await product.find(
        { isPublished: true, $text: { $search: regexSearch }},
        {score: { $meta: 'textScore' }}
    ).sort({ score: { $meta: 'textScore' } })
    .lean();

    return result;
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser
}