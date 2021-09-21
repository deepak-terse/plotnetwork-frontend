export function isImageFile(file){
    if(file.type.split('/')[0] === 'image') return true;
    else return false;
}


