'use strict'

const { cart } = require('../models/cart.model');
const { BadRequestError, NotFoundError } = require("../core/error.response");
const {
    createCart,
    updateQuantityProductInCart
} = require('../models/repositories/cart.repo');

/**
    Key features: Cart Service
    - add product to cart [user]
    - reduce product quantity by one [user]
    - increase product quantity by one [user]
    - get cart [user]
    - delete cart [user]
    - delete cart item [user]
*/
class CartService {
    static async addToCart({ userId, product = {} }) {
        // check cart exist or not
        const foundCart = await cart.findOne({ cart_user_id: userId });
        if (!foundCart){
            // create cart for User
            return await createCart({ model: cart, userId, product})
        }
        // if cart exist but doesnt have product
        if(foundCart.cart_products.length === 0){
            foundCart.cart_products.push(product);
            return await foundCart.save();
        }
        // if cart exist and have product, update quantity
        return await updateQuantityProductInCart({ model: cart, userId, product });
    }
}

module.exports = CartService;