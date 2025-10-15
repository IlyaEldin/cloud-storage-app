require('dotenv').config();
const db = require('./config/database.js');
const app = require('./app');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {

        console.log('🔄 Подключаемся к базе данных...');
        await db.connect();


        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Сервер запущен на порту ${PORT}`);
            console.log('📊 База данных готова к работе');
            console.log('🌐 Доступен по: http://localhost:3000');
        });

    } catch (error) {

        console.error('💥 Не удалось запустить сервер:', error);
        process.exit(1);
    }
}

startServer();