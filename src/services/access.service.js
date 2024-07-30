'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require("../utils");
const { BadRequestError, ForbiddenError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    /*
        check refresh token used or not
    */

    static handleRefreshToken = async (refreshToken) => {
        // check this refreshToken is in refreshTokenUsed
        const keyToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        if(keyToken){
            // decode refreshToken
            const { userId, email } = await verifyJWT(refreshToken, keyToken.privateKey);
            // delete all token in db
            await KeyTokenService.removeKeyTokenByUserId(userId);
            throw new ForbiddenError('Error: Token used! Pls Re-login!');
        }

        // check refreshToken in db
        const holderKeyToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if (!holderKeyToken) throw new AuthFailureError('Error: Shop not registered!');

        // verify token
        const { userId, email } = await verifyJWT(refreshToken, holderKeyToken.privateKey);
        // console.log(`check userId, email`, userId, email);
        const shop = await findByEmail({email});
        if (!shop) throw new AuthFailureError('Error: Shop not registered 2!'); 
        
        // create new token pair
        const tokens = await createTokenPair({ userId: userId, email }, holderKeyToken.publicKey, holderKeyToken.privateKey);

        // update token
        await holderKeyToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user: { userId: userId, email },
            tokens
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyTokenById(keyStore._id);
        console.log(`Deleted KeyStore:::`, delKey);
        return delKey;
    }

    /*
        1 - check email in dbs   
        2 - match password
        3 - create AT and RT then save
        4 - generate tokens
        5 - get data return login
    */
        
    static login = async ({email, password, refreshToken = null}) => {
        //1.
        const shop = await findByEmail({email});
        if (!shop) throw new BadRequestError('Error: Shop not found!');
        //2.
        const checkPassword = bcrypt.compare(password, shop.password);
        if (!checkPassword) throw new AuthFailureError('Error: Authentication error!');
        //3.
        const publicKey = crypto.randomBytes(32).toString('hex');
        const privateKey = crypto.randomBytes(32).toString('hex');
        //4.
        const {_id: userId} = shop; // object destructuring
        const tokens = await createTokenPair(
            { userId: userId, email },
            publicKey,
            privateKey
        );

        await KeyTokenService.saveKeyToken({
            userId: userId,
            refreshToken: tokens.refreshToken,
            privateKey, publicKey
        });

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: shop }),
            tokens
        }

    }

    static signUp = async ({name, email, password}) => {
        // try{
            // step 1: check email exist
            const holderShop = await shopModel.findOne({email}).lean();

            if (holderShop){
                throw new BadRequestError('Error: Email already exists!');
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            });

            // register success then redirect to login page
            // register success then redirect to home page => USE
            if(newShop){
                // created privateKey, publicKey
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1', // public key cryptography standard 1
                //         format: 'pem',
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem',
                //     },
                // });
                const publicKey = crypto.randomBytes(32).toString('hex');
                const privateKey = crypto.randomBytes(32).toString('hex');
                console.log({privateKey, publicKey});

                const keyStore = await KeyTokenService.saveKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                });

                if (!keyStore){
                    throw new BadRequestError('Error: KeyStore not found!');
                }
                // created token pair
                const tokens = await createTokenPair(
                    {userId: newShop._id, email},
                    publicKey,
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

        // }catch(error){
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService;