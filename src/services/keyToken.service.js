'use strict'

const { filter } = require("compression");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {

    static saveKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const publicKeyString = publicKey.toString();
            // const tokens = await keytokenModel.create({
            //     user: userId, 
            //     publicKey,
            //     privateKey
            // });

            // level xxx
            const filter = { user: userId }, update = { 
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true };
            // upsert set true meaning if find data then update, otherwise create new one
            // new set true meaning return back the data updated
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null;            
        } catch (error) {
            return error;
        }
    }
}

module.exports = KeyTokenService;