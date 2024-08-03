'use strict'

const { findById } = require("../services/apikey.service");

const HEADER = {
    API_KEY: 'x-api-key', // x-api-key is not used by user but by proxy. user -> proxy -> backend.
    AUTHORIZATION: 'authorization',
}

const apiKey = async(req, res, next) => {  
    try{
        const key = req.headers[HEADER.API_KEY]?.toString();
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            });
        }
        console.log('check key:::', key);
        // check objKey
        const objKey = await findById(key);
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden Error'
            });
        }
        // console.log('check objKey:::', objKey);
        req.objKey = objKey;

        return next();

    }catch(error){
        return error;
    }
}

const permission = (permissions) => { 
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission Denied'
            });
        }

        console.log('check permission:::', req.objKey.permissions);
        const validPermissions = req.objKey.permissions.includes(permissions);
        if(!validPermissions){
            return res.status(403).json({
                message: 'Permission Denied'
            });
        } 
        return next();
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandler
}