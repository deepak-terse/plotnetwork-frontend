import S3FileUpload from 'react-s3';
 
 //Optional Import
import { uploadFile } from 'react-s3';

import { getAWSConfig } from '../constants';
 
export function uploadFileToS3(file, directoryName, index){
    return new Promise((resolve, reject) => {

        const config = getAWSConfig('project-microsite-data', directoryName, 'ap-south-1');
        
        uploadFile(file, config)
        .then(data => {
            data.index = index;
            resolve(data)
        })
        .catch(err => reject(err))
    });
} 
 
