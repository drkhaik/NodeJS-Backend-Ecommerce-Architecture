'use strict'

const { cart } = require('../models/cart.model');
const { BadRequestError, NotFoundError } = require("../core/error.response");
const {
    createCart,
    updateQuantityProductInCart
} = require('../models/repositories/cart.repo');
const { findProductById } = require('../models/repositories/product.repo');

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

    // update cart
    /* 
        shop_order_ids [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
    */
    static async updateCartItem({ userId, shop_order_ids }) {
        const { product_id, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
        // check product
        const foundProduct = await findProductById({ product_id });
        if(!foundProduct) throw new NotFoundError('Error: Product not found!');
        console.log('foundProduct', foundProduct);
        // compare product_owner with shop_owner
        if (foundProduct.product_owner.toString() !== shop_order_ids[0].shop_owner) throw new BadRequestError('Error: Product does not belong to this shop!');
        
        if(quantity < 1){
            // deleted product from cart
        }

        return await updateQuantityProductInCart({ 
            model: cart, 
            userId,
            product: { product_id, quantity: quantity - old_quantity }
        });
    }

    static async deleteCartItem ({ userId, product_id }) {
        const query = {
            cart_user_id: userId,
            cart_status: 'active'
        },
        updateSet = {
            $pull: {
                cart_products: { product_id }
            }
        }

        const deletedItem = await cart.findOneAndUpdate(query, updateSet, { new: true });
        return deletedItem;
    }

    static async getListCart({ userId }) {
        return await cart.findOne({ cart_user_id: userId }).lean();
    }
}

module.exports = CartService;