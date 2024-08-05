'use strict'
const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const { convertToObjectId } = require('../utils');
const { 
    findDiscountByCodeAndShopOwner, 
    getAllDiscountCodeSelect,
    getAllDiscountCodeByUnselect
} = require('../models/repositories/discount.repo');
const { findAllProducts } = require("../models/repositories/product.repo");
/** 
    1. Generator Discount Code [Shop | Admin]
    2. Get all discount code [User | Shop | Admin]
    3. Get all product by discount code [User]
    4. Get discount amount [User]
    5. Delete discount code [Shop | Admin]
    6. Cancel discount code [User]

*/

class DiscountService {
    static async createDiscountCode(payload){
        const { code, start_date, end_date, is_active, shop_owner,
            min_order_value, product_id, apply_to, name, description,
            type, value, max_value, max_use, use_count, max_uses_per_user, users_used
        } = payload;

        if(new Date() > new Date(start_date) || new Date() > new Date(end_date)) throw new BadRequestError('Error: Discount code has expired!');

        if (new Date(start_date) >= new Date(end_date)) throw new NotFoundError('Error: Start date must be less than end date!');

        // Reason why I dont create repo for discount cuz repo are frequently used functions related to schema
        const foundDiscount = await findDiscountByCodeAndShopOwner({code, shop_owner});
        if(foundDiscount && foundDiscount.discount_is_active) throw new BadRequestError('Error: Discount code already exists!');

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_use: max_use,
            discount_use_count: use_count,
            discount_users_used: users_used,
            discount_max_uses_per_users: max_uses_per_user,
            discount_shop_owner: shop_owner,
            discount_is_active: is_active,
            discount_apply_to: apply_to,
            discount_product_id: apply_to === 'all' || product_id,
        })

        return newDiscount;
    }

    static async updateDiscountCode(payload){
        const { code, start_date, end_date, is_active, shop_owner,
            min_order_value, product_id, apply_to, name, description,
            type, value, max_value, max_use, use_count, max_uses_per_user, users_used
        } = payload;

        if(new Date() > new Date(start_date) || new Date() > new Date(end_date)) throw new BadRequestError('Error: Discount code has expired!');

        if(new Date(start_date) >= new Date(end_date)) throw new BadRequestError('Error: Start date must be less than end date!');

        const foundDiscount = await findDiscountByCodeAndShopOwner({ code, shop_owner });
        if(!foundDiscount) throw new NotFoundError('Error: Discount code not found!');

        const updateDiscount = await discount.findOneAndUpdate({
            discount_code: code,
            discount_shop_owner: convertToObjectId(shop_owner),
        }, {
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_use: max_use,
            discount_use_count: use_count,
            discount_users_used: users_used,
            discount_max_uses_per_users: max_uses_per_user,
            discount_shop_owner: shop_owner,
            discount_is_active: is_active,
            discount_apply_to: apply_to,
            discount_product_id: apply_to === 'all' || product_id,
        }, {new: true});

        return updateDiscount;
    }

    static async getAllProductByDiscountCode({
        code, shop_owner, userId, limit, page
    }){
        const foundDiscount = await findDiscountByCodeAndShopOwner({ code, shop_owner });
        if (!foundDiscount || !foundDiscount.discount_is_active) throw new NotFoundError('Error: Discount code not found!');

        const { discount_apply_to, discount_product_id } = foundDiscount;
        let products;
        if(discount_apply_to === 'all'){
            // get all product
            products = await findAllProducts({
                filter: { 
                    product_owner: convertToObjectId(shop_owner),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name', 'product_price']
            })
        }

        if(discount_apply_to === 'specific_products'){
            // get specific product
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_id},
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name', 'product_price']
            })
        }

        return products;
    }

    static async getAllDiscountCodeByShop ({
        shop_owner, limit, page
    }){
        const discounts = await getAllDiscountCodeByUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shop_owner: convertToObjectId(shop_owner),
                discount_is_active: true,
            },
            model: discount,
            unselect: ['__v', 'discount_shop_owner']
        })

        return discounts;
    }
}