const { convertToObjectId } = require('../../utils');
const {cart} = require('../cart.model');

const createCart = async ({ model, userId, product }) => {
    const query = { cart_user_id: userId, cart_status: 'active' },
        updateOrInsert = {
            $addToSet: {
                cart_products: product // {cart_products: {product_id,...} } / cart_products: [{}, {}, {}]
            }
        },
        options = { new: true, upsert: true };

    return await model.findOneAndUpdate(query, updateOrInsert, options);
}

const updateQuantityProductInCart = async ({ model, userId, product }) => {
    const { product_id, quantity } = product;
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

const findCartById = async ({ cart_id }) => {
    return await cart.findOne({ _id: convertToObjectId(cart_id), cart_status: 'active' }).lean();

}
module.exports = {
    createCart,
    updateQuantityProductInCart,
    findCartById
}