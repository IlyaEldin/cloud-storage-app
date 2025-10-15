import axios from 'axios'
import { BASE_URL, ENDPOINTS } from './config';


// Функция удаления файла с сервера по id 
export default async function removeFile(idUser, idFiles) {
    try {
        const endpoint = 'removefile';
        console.log(idUser);
        const response = await axios.post(`${BASE_URL}${ENDPOINTS[endpoint]}`, { idUser, idFiles }, {
            timeout: 10000,
        });

        return response.data
    } catch (error) {
        console.log(error);
        return {
            error: 'Ошибка удаления файла',
        };
    }
}