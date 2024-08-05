'use strict'

const {product, clothing, electronic, furniture} = require('../models/product.model');
const { BadRequestError } = require("../core/error.response");
const { 
    findAllDraftsForShop,
    findAllPublishForShop, 
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
} = require('../models/repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');

// define Factory class to create product
class ProductFactory {
    /**
     * type: 'Clothing' | 'Electronic',
     * payload
     * 
     */

    static productRegistry = {} // key-class

    static registerProductType(type, productClass) {
        ProductFactory.productRegistry[type] = productClass;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Error: Invalid Product Type!, ${type}`);

        return new productClass(payload).createProduct();
    }

    static async updateProduct(type, payload, product_id) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Error: Invalid Product Type!, ${type}`);

        return new productClass(payload).updateProduct(product_id);
    }

    // QUERY // 
    static async findAllDraftsForShop({ product_owner, limit = 50, skip = 0 }) {
        const query = {product_owner, isDraft: true};
        return await findAllDraftsForShop({query, limit, skip});
    }

    static async findAllPublishForShop({ product_owner, limit = 50, skip = 0 }) {
        const query = { product_owner, isPublished: true};
        return await findAllPublishForShop({query, limit, skip});
    }

    static async searchProducts({keySearch}){
        return await searchProductByUser({keySearch});
    }
    
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true} }) {
        return await findAllProducts({ limit, sort, page, filter, 
            select: ['product_name', 'product_price', 'product_thumb']
        });
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, 
            unselect: ['__v']
        });
    }
    // END QUERY //

    // PUT // 
    static async publishProductByShop({ product_id, product_owner }) {
        return await publishProductByShop({ product_id, product_owner });
    }
    
    static async unPublishProductByShop({ product_id, product_owner }) {
        return await unPublishProductByShop({ product_id, product_owner });
    }
    // END PUT //
}

// define base class for product
class Product{
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_owner, product_attributes }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_owner = product_owner;
        this.product_attributes = product_attributes;
    }

    async createProduct(product_id) {
        return await product.create({...this, _id: product_id});
    }

    async updateProduct(product_id, payload) {
        return await updateProductById({ product_id, payload, model: product });
    }
}

// Define sub-class for product types Clothing
class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_owner: this.product_owner
        });
        if (!newClothing) throw new BadRequestError('Error: Create Clothing failed!');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('Error: Create Product failed!');

        return newProduct; 
    }

    async updateProduct(product_id) {
        // 1. remove attr has null and undefined
        const objectParams = removeUndefinedObject(this);
        // 2. check attr has value then update the attr and product, otherwise just update the product
        if (objectParams.product_attributes) {
            // update the attr
            await updateProductById({
                product_id,
                payload: updateNestedObjectParser(objectParams.product_attributes),
                model: clothing
            });
        }

        const updatedProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams));
        return updatedProduct;
    }
}

// Define sub-class for product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_owner: this.product_owner
        });
        if (!newElectronic) throw new BadRequestError('Error: Create Electronics failed!');
        
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('Error: Create Product failed!');

        return newProduct;
    }

    async updateProduct(product_id) {
        // 1. remove attr has null and undefined
        const objectParams = removeUndefinedObject(this);
        // 2. check attr has value then update the attr and product, otherwise just update the product
        if (objectParams.product_attributes) {
            // update the attr
            await updateProductById({
                product_id,
                payload: updateNestedObjectParser(objectParams.product_attributes),
                model: clothing
            });
        }

        const updatedProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams));
        return updatedProduct;
    }
}

// Define sub-class for product types Electronic
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_owner: this.product_owner
        });
        if (!newFurniture) throw new BadRequestError('Error: Create newFurniture failed!');

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('Error: Create Product failed!');

        return newProduct;
    }

    async updateProduct(product_id) {
        // 1. remove attr has null and undefined
        const objectParams = removeUndefinedObject(this);
        // 2. check attr has value then update the attr and product, otherwise just update the product
        if (objectParams.product_attributes) {
            // update the attr
            await updateProductById({ 
                product_id, 
                payload: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing 
            });
        }

        const updatedProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams));
        return updatedProduct;
    }
}

// register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;