'use strict'
const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try{
        // accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        // refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        //

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if(err){
                console.error(`error verify:::`,err);
            }else{
                console.log(`decoded verify:::`, decoded);
            }
        })

        return {
            accessToken,
            refreshToken
        }

    }catch(error){
        return error;
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1. Check userId missing??
        2. Get AT
        3. Verify token
        4. Check user in dbs
        5. Check keyStore with this userId
        6. Ok all => return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) throw new AuthFailureError('Error: Invalid Request!');

    const keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Error: KeyStore not found!');

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Error: Invalid Request!');

    try{
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if(userId !== decodeUser.userId) throw new AuthFailureError('Error: Invalid UserId!');
        req.keyStore = keyStore;
        return next();
    }catch(error){
        return error;
    }

})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}