'use strict'

const { order } = require("../models/order.model");
const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { checkDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

/*
    1. Create New Order [User]
    2. Query Orders [User]
    3. Query Order Using It's ID [User]
    4. Cancel Order [User]
    5. Update Order Status [Admin]
*/

/*
    {
        cart_id,
        userId,
        shop_order_ids: [
            {
                shop_owner,
                shop_discounts: [],
                item_products: [
                    {
                        price,
                        quantity,
                        product_id
                    }
                ]
            },
            {
                shop_owner,
                shop_discounts: [
                    {

                    }
                ],
                item_products: [
                    {
                        price,
                        quantity,
                        product_id
                    }
                ]
            }
        ]
    }
*/

class CheckoutService {

    static async checkoutReview({ cart_id, userId, shop_order_ids = [] }) {
        const foundCart = await findCartById({ cart_id });
        if (!foundCart) throw new BadRequestError("Cart does not exist!");

        const checkoutOrder = {
            totalPrice: 0,
            shippingFee: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        };

        const shop_order_ids_new = [];
        // cal the total bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shop_owner, shop_discounts = [], item_products = [] } = shop_order_ids[i];
            const checkProductServer = await checkProductByServer(item_products);

            // if (!checkProductServer[0]) throw new BadRequestError("Order wrong!");

            if (checkProductServer.length !== item_products.length) throw new BadRequestError("Order wrong 2!");

            const originalPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0);

            console.log("check original price", originalPrice);

            checkoutOrder.totalPrice += originalPrice;

            const itemCheckout = {
                shop_owner,
                shop_discounts,
                originalPrice: originalPrice,
                discountedPrice: originalPrice,
                // discountedAmount: originalPrice,
                item_products: checkProductServer,
            }

            if (shop_discounts.length > 0) {
                const { discountAmount = 0, totalOrderAfterApplyDiscount = 0 } = await checkDiscountAmount({
                    code: shop_discounts[0].code,
                    userId,
                    shop_owner,
                    products: checkProductServer
                });

                checkoutOrder.totalDiscount += discountAmount;

                if (discountAmount > 0) {
                    itemCheckout.discountedPrice = totalOrderAfterApplyDiscount
                }
            }

            checkoutOrder.totalCheckout += itemCheckout.discountedPrice;
            shop_order_ids_new.push(itemCheckout);

        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkoutOrder
        }
    }
    
    static async orderByUser({ shop_order_ids, cart_id, userId, user_address = {}, user_payment = {} }){
        const { shop_order_ids_new, checkoutOrder } = await this.checkoutReview({ cart_id, userId, shop_order_ids });

        // check inventory again to see if there is excess product
        /**
         *  const words = ['hello', 'world'];
            const result2 = words.flatMap(word => word.split(''));
            console.log(result2); // Output: ['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd']
         */
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        // console.log("check products", products);
        const acquireProduct = [];
        for (let i = 0; i < products.length; i++) {
            const {product_id, quantity} = products[i];
            const keyLock = await acquireLock(product_id, quantity, cart_id);
            acquireProduct.push(keyLock ? true : false);
            if(keyLock){
                await releaseLock(keyLock);
            }
        }

        // check again if there is any product that is out of inventory
        if (acquireProduct.includes(false)) throw new BadRequestError("Some products have been updated, please return to cart.!");

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkoutOrder,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        });
        // if success, remove product that has been purchased from the cart
        if(newOrder){
            // remove product from cart
        }
        return newOrder;
    }

    /* 
        Query Orders [Users]
    */
    static async getOrderByUser({ userId }) {
        
    }

    /*
       Query Order Using Id [Users]
    */
    static async getOneOrderByUser({ userId }) {

    }

    /*
       Cancel Order [Users]
    */
    static async cancelOrderByUser({ userId }) {

    }

    /*
       Update Order Status [Shop | Admin]
    */
    static async updateOrderStatus({ userId }) {

    }
}

module.exports = CheckoutService;