export function getAPIs(){
    const baseURL = "https://backend.plotnetwork.in/";

    return {
        'login': baseURL + 'login',
        'broker': baseURL + 'broker',
        'salesmanager': baseURL + 'salesmanager',
        'lead': baseURL + 'lead'
    }
}