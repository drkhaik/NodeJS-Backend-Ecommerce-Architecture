'use strict'

const { uploadImageURL, uploadImageFromLocal } = require('../services/upload.service');
const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require('../core/error.response');

class UploadController {

    uploadFile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Upload File Success!',
            metadata: await uploadImageURL(),
        }).send(res);
    }

    uploadFileThumb = async (req, res, next) => {
        const {file} = req;
        if (!file) throw new BadRequestError('File not found');
        
        new SuccessResponse({
            message: 'Upload File thumb Success!',            
            metadata: await uploadImageFromLocal({ path: file.path }), 
        }).send(res);
    }

}

module.exports = new UploadController();