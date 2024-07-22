'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({name, email, password}) => {
        try{
            // step 1: check email exist

            const holderShop = await shopModel.findOne({email}).lean();

            if (holderShop){
                return {
                    code: '20002',
                    message: 'Email already registered',
                }
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = new shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            });

            // register success redirect to login page
            // register success redirect to home page => USE
            if(newShop){
                // created privateKey, publicKey
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                });

                console.log({privateKey, publicKey});
            }

        }catch(error){
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = new AccessService();