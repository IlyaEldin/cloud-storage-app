
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Локальная разработка
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }
        // (сервер)
        else {
            return '';
        }
    }
    return '';
};

export const BASE_URL = getBaseUrl();

// export const URL = 'http://localhost';
export const PORT = '3000';
export const ENDPOINTS = {

    register: '/api/auth/register',
    login: '/api/auth/login',
    getfiles: '/api/getfiles',
    removefile: '/api/removefile',
    uploadfile: '/api/uploadfile',
    uploadfilemulter: '/api/uploadfile/multer',
    download: '/api/download',
    getsearchfiles: '/api/getsearchfiles',


};