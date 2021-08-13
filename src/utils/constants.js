export function getAPIs(){
    const baseURL = "http://52.66.148.164";
    const portNo = 1337;

    return {
        'login': baseURL + ':' + portNo + '/login',
        'broker': baseURL + ':' + portNo + '/broker',
        'salesmanager': baseURL + ':' + portNo + '/salesmanager',
        'lead': baseURL + ':' + portNo + '/lead'
    }
}