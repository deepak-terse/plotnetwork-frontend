// import S3FileUpload from 'react-s3';
 
//  Optional Import
// import { uploadFile } from 'react-s3';

import S3FileUpload from './src/ReactS3';
 

import { getAWSConfig } from '../constants';
 
export function uploadFileToS3(file, directoryName){
    return new Promise((resolve, reject) => {

        const config = getAWSConfig('project-microsite-data', directoryName, 'ap-south-1');
        
        // resolve({location :"", fileName : file.name})
        
        S3FileUpload
        .uploadFile(file, config)
        .then(data => {
            data.fileName = file.name;
            resolve(data)
        })
        .catch(err => reject(err))
    });
} 
 
