const db = require('../config/database.js');


const newUser = async (login, password) => {
    try {
        const result = await db.newUser(login, password);
        return result

    } catch (error) {
        console.log('newUser function in validators.js:', error.message);
    }
}

const validateAuthData = async (login, password) => {


    const user = await db.findUserByLogin(login);

    if (user) { return { status: false, message: 'Логин уже используется', } }

    if (login.trim().length < 6) return { status: false, message: 'Логин должен содержать не менее 6 символов', }

    if (password.trim().length < 6) return { status: false, message: 'Пароль должен содержать не менее 6 символов', }

    const hasLetter = /[a-zA-Zа-яА-Я]/.test(password);
    const hasDigit = /\d/.test(password);

    if (!hasLetter || !hasDigit) return { status: false, message: 'Пароль должен содержать буквы и цифры', }

    return {
        status: true,
        message: '',
    }

}

const checkAuthData = async (login, password) => {

    try {
        const user = await db.findUserByLogin(login);

        if (!user) { return { status: false, message: 'Логин не найден', id: null } }

        if (password === user.password) { return { status: true, message: "Вход выполнен", id: user.id } }

        return { status: false, message: "Пароль не верный", id: null }
    } catch (error) {
        return { status: false, message: "checkAuth function in validators.js" + error.message, id: null }
    }



}

module.exports = { checkAuthData, validateAuthData, newUser }