import axios from 'axios'
import { BASE_URL, ENDPOINTS } from './config';

// Функция отправки метаданных на сервер
export default async function uploadingFile(idUser, namefile, typefile, sizeFile) {


    try {

        const endpoint = 'uploadfile';
        const response = await axios.post(`${BASE_URL}${ENDPOINTS[endpoint]}`, { idUser, namefile, typefile, sizeFile }, {
            timeout: 10000,
        });
        return response.data
    } catch (error) {
        console.error(error);
        return {
            error: 'Ошибка загрузки метаданных файла',
        };
    }
}