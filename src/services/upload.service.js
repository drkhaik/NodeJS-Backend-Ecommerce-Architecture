'use strict'

const cloudinary = require("../configs/cloudinary.config");

const uploadImageURL = async() => {
    try{
        const imageURL = "https://upload.wikimedia.org/wikipedia/commons/3/32/Googleplex_HQ_%28cropped%29.jpg";
        const folderName = 'product/shopId', newFileName = 'testdemo';

        const result = await cloudinary.uploader.upload(imageURL, {
            public_id: newFileName,
            folder: folderName,
        });

        console.log(result);
    }catch(e){
        console.error("Error uploading image::", e);
    }
}

// upload multi image
const uploadImageFromLocal = async({
    path,
    folderName = 'product/shopId'
})=> {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName,
        })
        console.log("check result", result);
        return {
            image_url: result.secure_url,
            // shopId: 8088,
            thumb_url: await cloudinary.url(result.public_id, {
                width: 200,
                height: 200,
                format: 'jpg'
            })
        }
    }catch(e){
        console.error("Error uploading image::", e);
    }
}

module.exports = {
    uploadImageURL,
    uploadImageFromLocal
}