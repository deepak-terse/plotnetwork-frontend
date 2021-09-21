export function getAPIs(){
    // const baseURL = "https://backend.plotnetwork.in/";
    const baseURL = "http://localhost:1337/";


    return {
        'login': baseURL + 'login',
        'broker': baseURL + 'broker',
        'salesmanager': baseURL + 'salesmanager',
        'lead': baseURL + 'lead',
        'leadexport': baseURL + 'leadexport',
        'project': baseURL + 'project',
        'baseURL': baseURL
    }
}

export function getAWSConfig(bucketName, dirName, region){
    const accessKeyId = 'AKIAROY2ZL6PJFJ2RYOS';
    const secretAccessKey = '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';

    return {
        bucketName: bucketName,
        dirName: dirName, /* optional */
        region: region,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    }
}
