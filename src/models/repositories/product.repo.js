'use strict'

const { product, clothing, electronic, furniture } = require('../product.model');
const { Types } = require('mongoose');
const { getSelectData, getUnselectData, convertToObjectId } = require('../../utils');

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_owner', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
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
    if (!foundShop) return null;

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
    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;
    await foundShop.save();

    return foundShop;
}

// https://anonystick.com/blog-developer/full-text-search-mongodb-chi-mot-bai-viet-khong-can-nhieu-2022012063033379
const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const result = await product.find(
        { isPublished: true, $text: { $search: regexSearch } },
        { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } })
        .lean();

    return result;
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return products;
}

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id)
        .select(getUnselectData(unSelect))
        .lean();
}

const updateProductById = async ({ product_id, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(product_id, payload, { new: isNew });
}

const findProductById = async ({ product_id }) => {
    return await product.findById(product_id).lean();
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await findProductById({ product_id: product.product_id });
        console.log("foundProduct", foundProduct);
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                product_id: product.product_id
            }
        }
    }))
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    findProductById,
    checkProductByServer
}