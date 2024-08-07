const { getSelectData, getUnselectData } = require('../../utils');

const createCart = async ({ model, userId, product }) => {
    const query = {cart_user_id: userId, cart_status: 'active'},
    updateOrInsert = {
        $addToSet: {
            cart_products: product // {cart_products: {product_id,...} } / cart_products: [{}, {}, {}]
        }
    },
    options = {new: true, upsert: true};

    return await model.findOneAndUpdate(query, updateOrInsert, options);
}

const updateQuantityProductInCart = async ({ model, userId, product }) => {
    const {product_id, quantity} = product;
    const query = {
        cart_user_id: userId,
        'cart_products.product_id': product_id, // find product_id in cart_products array
        cart_status: 'active'
    }, 
    updateSet = {
        $inc: { 
            'cart_products.$.quantity': quantity, 
            // using $ to update the matched product_id, $ is the product_id matched in query
        }
    },
    options = { new: true, upsert: true };

    return await model.findOneAndUpdate(query, updateSet, options);
}

const getAllDiscountCodeSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return discounts;
}

const getAllDiscountCodeByUnselect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unselect, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnselectData(unselect))
        .lean();

    return discounts;
}

module.exports = {
    createCart,
    updateQuantityProductInCart,
    getAllDiscountCodeSelect,
    getAllDiscountCodeByUnselect
}