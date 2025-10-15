import axios from 'axios'
import { BASE_URL, ENDPOINTS } from './config';

//Функция получения файлов
export default async function getMyFiles(id, searchValue, type) {

    try {

        const endpoint = type === 'search' ? 'getsearchfiles' : 'getfiles';

        const response = await axios.get(`${BASE_URL}${ENDPOINTS[endpoint]}/${id}?search=${searchValue}`, {
            timeout: 10000,
        });
        return response.data
    } catch (error) {
        console.log(error);
        return {
            error: 'Ошибка получения файлов',
        };
    }
}