import S3FileUpload from 'react-s3';
 
 //Optional Import
import { uploadFile } from 'react-s3';

/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */
 
export function uploadFileToS3(file){
    console.log("dfile ",file)
    // broker iam
    // const config = {
    //     bucketName: 'kohinoor.6123bf1c05d4ad59eae3432f',
    //     region: 'ap-south-1',
    //     accessKeyId: 'AKIAROY2ZL6PJFJ2RYOS',
    //     secretAccessKey: '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',
    // }

    // root user 
    const config = {
        bucketName: 'kohinoor.6123bf1c05d4ad59eae3432f',
        region: 'ap-south-1',
        accessKeyId: 'AKIAROY2ZL6PN5FUKV4H',
        secretAccessKey: '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',
    }
    
    uploadFile(file, config)
    .then(data => console.log("upload response ",data))
    .catch(err => console.error("upload errr ",err))
} 
 
