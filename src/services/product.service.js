'use strict'

const {product, clothing, electronic} = require('../models/product.model');
const { BadRequestError } = require("../core/error.response");

// define Factory class to create product
class ProductFactory {
    /**
     * type: 'Clothing' | 'Electronic',
     * payload
     * 
     */
    static async createProduct(type, payload) {
        switch (type) {
            case 'Clothing':
                return await new Clothing(payload).createProduct();
            case 'Electronics':
                return await new Electronic(payload).createProduct();
            default:
                throw new BadRequestError(`Error: Invalid Product Type!, ${type}`);
        }
    }
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
}

module.exports = ProductFactory;