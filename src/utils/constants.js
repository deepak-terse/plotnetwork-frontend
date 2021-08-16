export function getAPIs(){
    const baseURL = "https://backend.plotnetwork.in/";
    // const baseURL = "http://localhost:1337/";


    return {
        'login': baseURL + 'login',
        'broker': baseURL + 'broker',
        'salesmanager': baseURL + 'salesmanager',
        'lead': baseURL + 'lead'
    }
}