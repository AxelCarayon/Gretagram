import jwt from 'jsonwebtoken';
const newSessionRoutes = [{ path: '/user/login', method: 'POST' }]; //liste des chemins ou on va avoir besoin de s'identifier
const authRoutes = [{ path: '/user/password', method: 'PUT' }]; //liste des chemins ou il faut être autorisé pour faire une action
const SECRET_KEY = "G8w44jHurQ44gjd3Fq5Gzzj1pQTYvqtKO50v2y7Bftun2B5jAsQPXaR7Y53Y9gO";

export const isNewSessionRequired = (httpMethod, url) => {
    for (let routeObj of newSessionRoutes) {
        if (routeObj.method === httpMethod && routeObj.path === url) {
            return true;
        }
    }
    return false;
}

export const isAuthRequired = (httpMethod, url) => {
    for (let routeObj of authRoutes) {
        if (routeObj.method === httpMethod && routeObj.path === url) {
            return true;
        }
    }
    return false;
}