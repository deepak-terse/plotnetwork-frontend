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

export function getPresetAmenitiesList(){
    return [
        {
            id : 0,
            title : "Fully Equipped Air Conditioned Gym"
        },
        {
            id : 1,
            title : "Mechanical Gym"
        },
        {
            id : 2,
            title : "Steam Room"
        },
        {
            id : 3,
            title : "Spa & Massage Room"
        },
        {
            id : 4,
            title : "Sky Lounge"
        },
        {
            id : 5,
            title : "Sitting Deck"
        },
        {
            id : 6,
            title : "Yoga & Meditation deck"
        },
        {
            id : 7,
            title : "Jogging Track"
        },
        {
            id : 8,
            title : "Children Play Area"
        }
    ]
}
