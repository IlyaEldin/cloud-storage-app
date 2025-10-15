import { useContext } from 'react';
import { UserContext } from '../components/UserContext/UserContext';
import authenticateFunction from '../services/LogApi';

//hook авторизации
export const useAuth = () => {

    const { loginIn } = useContext(UserContext);

    const authenticateUser = async (login, password, type) => {
        try {
            const response = await authenticateFunction(login, password, type);


            if (response.success) {
                loginIn(response.id, response.user);
                return { success: true, message: response.message, error: response.error, };
            }

            return { success: false, message: response.message, error: response.error, };
        } catch (error) {
            console.error('Auth error:', error);
            return { success: false, error: error.message || 'Ошибка ответа сервера' };
        }
    };
    return { authenticateUser };
};
