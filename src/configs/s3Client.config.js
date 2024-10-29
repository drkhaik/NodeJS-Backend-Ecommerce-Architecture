"use strict"

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");


const s3Config = {
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY
    }
}

const s3Client = new S3Client(s3Config);

module.exports = {
    s3Client, 
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
}