import axios from 'axios'
import { BASE_URL, ENDPOINTS } from './config';


// Функция выгрузки файла на сервер
export default async function uploadFileWithMulter(userId, fileId, file) {
    try {
        const endpoint = 'uploadfilemulter';
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${BASE_URL}${ENDPOINTS[endpoint]}?userId=${userId}&fileId=${fileId}`, formData, {
            timeout: 30000,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;

    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || 'Ошибка загрузки файла'
        };
    }
}