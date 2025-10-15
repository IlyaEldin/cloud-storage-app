const { validateAuthData, checkAuthData, newUser } = require('../utils/validators');
const path = require('path');
const fs = require('fs').promises;

const createUserFolder = async (id) => {
    try {
        const userFolderPath = path.join(__dirname, '../user_files', id.toString());
        await fs.mkdir(userFolderPath, { recursive: true });
    } catch (error) {
        console.log('Ошибка в createUserFolder', error.message)
        throw error;
    }

};

const register = async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(201).json({ error: 'Все поля обязательны' });
        }

        const { status, message } = await validateAuthData(login, password);

        if (!status) {
            return res.status(201).json({
                success: false,
                message: message,
            })
        } else {

            const result = await newUser(login, password);

            const regId = result.id;

            await createUserFolder(regId);

            return res.status(201).json({
                success: true,
                message: 'Пользователь зарегистрирован',
                id: regId,
                user: login,
            });
        }
    } catch (error) {
        console.log('register:', error.message);
        res.status(500).json({ success: false, error: "Ошибка сервера" });
    }
};

const login = async (req, res) => {
    try {
        console.log('login', req.body)

        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(201).json({ error: 'Все поля обязательны' });
        }


        const { status, message, id } = await checkAuthData(login, password);

        if (!status) {
            return res.status(201).json({
                success: false,
                message: message,
                id,
            })
        } else {
            return res.status(201).json({
                success: true,
                message: 'Пользователь авторизован',
                id,
                user: login, // 
            });
        }
    } catch (error) {
        console.log('login:', error.message);
        res.status(500).json({ success: false, error: "Ошибка сервера" });
    }
};

module.exports = { register, login };