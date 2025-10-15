import axios from 'axios'
import { BASE_URL, ENDPOINTS } from './config';

// Функция запроса на авторизацию/регистрацию
export default async function authenticateFunction(login, password, type) {

    try {

        const endpoint = type === 'reg' ? 'register' : 'login';

        const response = await axios.post(`${BASE_URL}${ENDPOINTS[endpoint]}`, { login, password }, { timeout: 10000, })

        return response.data
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: error.response?.data?.error || 'Ошибка аутентификации',
            message: error.response?.data?.message || 'Неизвестная ошибка'
        };
    }
}