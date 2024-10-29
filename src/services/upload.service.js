'use strict'

const cloudinary = require("../configs/cloudinary.config");
const crypto = require('crypto');
const { 
    s3Client, 
    PutObjectCommand, 
    GetObjectCommand,
    DeleteObjectCommand
} = require("../configs/s3Client.config");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const randomFileName = () => crypto.randomBytes(20).toString('hex');
const cloudfrontDistributionDomain = process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN; // get from aws cloudfront distribution domain

// Upload file use S3 Client

// upload from local
const uploadFileFromLocalS3 = async ({
    file
}) => {
    try {
        
        const imageName = randomFileName();
        console.log("check file", file);
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName, // file.originalname || 'unknown file name',
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        
        const result = await s3Client.send(command);
        console.log("check result", result);

        // export url
        const signedUrl = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
        });
        // signed url with s3
        // const url = await getSignedUrl(s3Client, signedUrl, { expiresIn: 3600 });
        // console.log("check url::", url);

        // signed url with cloudfront
        const url = `${cloudfrontDistributionDomain}/${imageName}`;
        const privateKey = process.env.AWS_CLOUDFRONT_PRIVATE_KEY; // generate in openssl rsa private key
        const keyPairId = process.env.AWS_CLOUDFRONT_PUBLIC_KEYPAIR_ID; // get id public key in aws cloudfront
        const dateLessThan = new Date(Date.now() + 1000 * 60); // 1 minute
        const signedUrlCloudfront = getSignedUrl({
            url,
            keyPairId,
            dateLessThan,
            privateKey,
        });

        /*
            url_with_cloudfront_have_not_key:
            https://dwo9f9aav7p7v.cloudfront.net/53e16b1a75c96c44685b03f438fde0c66793fc9a
            url_signed_cloudfront: exist in 1 minute
            https://dwo9f9aav7p7v.cloudfront.net/2189800db7ad44cdc50531d56da8dc2ab547ee61?
            Expires=1730198273
            &Key-Pair-Id=K239SQLU9NY704
            &Signature=JileCZejiV57UIq7g37DB~rx3f9aw1i8XjP6J0QmYnGzeB9JihW2H1fv3wWa1sro1AwUO029OMnC04x4k4nA4yE00IcCKqK~4D34nCBprtT4hMCPZ9kM9bXZDHnJEu3t5MsRtpvSV-gEoNKi0XEXL4U7x~r5oAc5osF7YVqSxrLfrNHjgjZqO5FHInD525fVbT22ex1VyZQTIh6XajsiMJoXWKE9Wn5JksLlzB6-KWL8~Rcq5H6dWeTWUTuyEfhN7I~1-4W4rQsIXzmkvupf~pa4wZ7uN-eRuQd6PIupCT1EWr9HZ04R68VMId33NGWr58m9jd7s0jb~JrWrsYc1BA__
        */

        return {
            url_with_cloudfront_have_not_key: `${cloudfrontDistributionDomain}/${imageName}`,
            url_signed_cloudfront: signedUrlCloudfront,
            result
        };

    } catch (e) {
        console.error("Error uploading image::", e);
    }
}


// End S3 Service

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
    uploadImageFromLocal,
    uploadFileFromLocalS3
}