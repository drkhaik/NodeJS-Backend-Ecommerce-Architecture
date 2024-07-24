'use strict'
const JWT = require('jsonwebtoken');

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

module.exports = {
    createTokenPair
}