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

    // QUERY
    /**
     * @description Get all Draft Products
     * @param {Object} product_owner 
     * @param {Number} limit 
     * @param {Number} skip
     * @return {JSON} 
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all Draft Products Success',
            metadata: await ProductServiceV2.findAllDraftsForShop({ product_owner: req.user.userId }),
        }).send(res);
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all Publish Products Success',
            metadata: await ProductServiceV2.findAllPublishForShop({ product_owner: req.user.userId }),
        }).send(res);
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search Products Success',
            metadata: await ProductServiceV2.searchProducts({ keySearch: req.params.keySearch }),
            // metadata: await ProductServiceV2.searchProducts(req.params),
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find All Products Success',
            metadata: await ProductServiceV2.findAllProducts(req.query),
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find Product Success',
            metadata: await ProductServiceV2.findProduct({ product_id: req.params.id }),
        }).send(res);
    }
    // END QUERY

    // PUT
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish Product Success',
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_owner: req.user.userId
            }),
        }).send(res);
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish Product Success',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_owner: req.user.userId
            }),
        }).send(res);
    }
    // END PUT

}

module.exports = new ProductController();