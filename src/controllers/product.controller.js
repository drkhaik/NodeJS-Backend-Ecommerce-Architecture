'use strict'

const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");

const { SuccessResponse } = require("../core/success.response");


class ProductController {

    createProduct = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Create new Product Success',
        //     metadata: await ProductService.createProduct(
        //         req.body.product_type,
        //         {
        //             ...req.body,
        //             product_owner: req.user.userId
        //         }
        //     ),
        // }).send(res);

        new SuccessResponse({
            message: 'Create new Product Success',
            metadata: await ProductServiceV2.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_owner: req.user.userId
                }
            ),
        }).send(res);
    }

}

module.exports = new ProductController();