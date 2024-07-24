'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require("../utils");
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

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            });

            // register success then redirect to login page
            // register success then redirect to home page => USE
            if(newShop){
                // created privateKey, publicKey
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1', // public key cryptography standard 1
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                });

                console.log({privateKey, publicKey});

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                });

                if(!publicKeyString){
                    return {
                        code: '20003',
                        message: 'publicKeyString Error'
                    }
                }
                console.log(`publicKeyString::: ${publicKeyString}`);

                const publicKeyObject = crypto.createPublicKey(publicKeyString);
                console.log(`publicKeyObject:::`, publicKeyObject);

                // created token pair
                const tokens = await createTokenPair(
                    {userId: newShop._id, email},
                    publicKeyObject,
                    privateKey
                );
                console.log(`Created Token Success:::`, tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id','name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
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

module.exports = AccessService;