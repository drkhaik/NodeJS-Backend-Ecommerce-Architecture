'use strict'

const keyTokenModel = require("../models/keytoken.model");
const {Types} = require('mongoose');

class KeyTokenService {

    static saveKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const publicKeyString = publicKey.toString();
            // const tokens = await keyTokenModel.create({
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
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null;            
        } catch (error) {
            return error;
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    }

    static removeKeyTokenById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: new Types.ObjectId(id) });
    }
    
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    }
    
    static removeKeyTokenByUserId = async (userId) => {
        return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) });
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    }
}

module.exports = KeyTokenService;