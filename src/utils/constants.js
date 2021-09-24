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

export function getStaticProcessingSections(){
    return {
        banner : {id : "banner", title : "Home", images : [], files : []},
        about : { id: "about", title : "", description : "", brochureLink : "" , brochureFile : {}},
        amenities : { id: "amenities", title : "Amenities", list : [], iconFiles : [], images : [], files : [], count : 0},
        virtualTour : { id: "virtualTour", title : "Virtual Tour", list : [], files : []},
        gallery : { id: "gallery", title : "Gallery", images : [], files : []},
        floorPlans : { id: "floorPlans", title : "Floor Plans", images : [], files : []},
        contactUs : { id: "contactUs", title : "Contact Us", mapLink : ""},
        footer : { id: "footer", title : "Footer", description : "", disclaimer : ""}
    }
}

export function getStaticMicrositeSections(){
    return {
        banner : {id : "banner", title : "Home", images : []},
        about : { id: "about", title : "", description : "", brochureLink : ""},
        amenities : { id: "amenities", title : "Amenities", list : [], images : []},
        virtualTour : { id: "virtualTour", title : "Virtual Tour", list : []},
        gallery : { id: "gallery", title : "Gallery", images : []},
        floorPlans : { id: "floorPlans", title : "Floor Plans", images : []},
        contactUs : { id: "contactUs", title : "Contact Us", mapLink : ""},
        footer : { id: "footer", title : "Footer", description : "", disclaimer : ""}
    }
}
