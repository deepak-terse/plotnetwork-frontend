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
            // https://project-microsite-data.s3.amazonaws.com/kohinoor_abcd/banner/Screenshot (124).png
            data.location = getNewLocation(data.location, file.customFileName);
            data.fileName = file.name;
            resolve(data)
        })
        .catch(err => reject(err))
    });
} 
 
function getNewLocation(location, customFileName){
    let url = location;
    url = url.slice(0, url.lastIndexOf('/'));
    url = url.concat(`/${customFileName}`);
    console.log(url);
    return url;
}