// import getAWSConfig from './aws-config';
// import dotenv from 'dotenv';
import AWS from 'aws-sdk';

// AKIAROY2ZL6PJFJ2RYOS access key
// Nv2OfvaTt3zeMAHsSP6a1cER74WCD3Od3T1PTcVV secret key
// dotenv.config();

export function createBucket(){
    const region = "ap-south-1"
    // const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
    // const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    // console.log(process.env);
    // const SESConfig = {
    //     apiVersion: "2006-03-01",
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    //     region: region
    // }
    // AWS.config.update(SESConfig);
    AWS.config.loadFromPath('./aws-config.json');
    // AWS.config.update({region: 'ap-south-1', credentials: { key: "AKIAROY2ZL6PJFJ2RYOS", secret: "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"}})
        // AWS.config.update({region: 'ap-south-1'})
        console.log(AWS.config);
    
    // Create S3 service object
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01'
    });

    // Create the parameters for calling createBucket
    var bucketParams = {
        Bucket : "kohinoor"
    };
    
    console.log("avout to create");
    // call S3 to create the bucket
    s3.createBucket(bucketParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Location);
        }
    });
}

// import AWS from 'aws-sdk';

// export default function getAWSConfig(){
//     // Set the regionnnnn
//     AWS.config.update({region: 'ap-south-1', credentials: { key: "AKIAROY2ZL6PJFJ2RYOS", secret: "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"}})
//     return new AWS;
// }
 
