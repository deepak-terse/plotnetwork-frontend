export function getAPIs(){
    const baseURL = "http://localhost";
    const portNo = 1337;

    return {
        'login': baseURL + ':' + portNo + '/login',
        'broker': baseURL + ':' + portNo + '/broker',
        'salesmanager': baseURL + ':' + portNo + '/salesmanager'
    }
}