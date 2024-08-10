'use strict'

const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { checkDiscountAmount } = require("./discount.service");

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
            console.log("check item_products", item_products);
            const checkProductServer = await checkProductByServer(item_products);
            console.log("check checkProductServer", checkProductServer);
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
}

module.exports = CheckoutService;