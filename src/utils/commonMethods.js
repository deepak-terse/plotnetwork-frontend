export function isImageFile(file){
    if(file.type.split('/')[0] === 'image') return true;
    else return false;
}

export function isPDF_File(file){
    if(file.type === 'application/pdf') return true;
    else return false;
}

export function getFileExtension(fileName){
    return fileName.split('.').pop();
}


