import axios from 'axios'
import { BASE_URL, ENDPOINTS } from './config';

//Функция скачивания файлов с сервера [работа с Blob скопирована из https://sky.pro/wiki/javascript/skachivanie-faylov-cherez-url-v-react-js-bez-predprosmotra/]
export default async function downloadFile(fileId) {
    try {
        const response = await axios.get(`${BASE_URL}${ENDPOINTS.download}/${fileId}`, {
            responseType: 'blob',
            timeout: 30000,
        });

        let filename = `file_${fileId}`;

        const disposition = response.headers['content-disposition'];

        if (disposition) {
            const matches = disposition.match(/filename="([^"]+)"/) || disposition.match(/filename=([^;]+)/);
            if (matches?.[1]) filename = decodeURIComponent(matches[1]);
        }

        // Создаем Blob объект из полученных данных файла
        // Blob (Binary Large Object) представляет собой файлоподобный объект с необработанными данными
        const blob = new Blob([response.data]);

        // Создаем временный URL-адрес для созданного Blob объекта
        // Этот URL можно использовать как обычную ссылку на файл
        const downloadUrl = window.URL.createObjectURL(blob);

        // Создаем невидимый элемент ссылки <a> в памяти
        const link = document.createElement('a');

        // Устанавливаем ссылку на временный URL с нашим файлом
        link.href = downloadUrl;

        // Задаем имя файла, которое будет предложено пользователю при сохранении
        link.download = filename;

        // Добавляем ссылку в DOM (требуется для работы в некоторых браузерах)
        document.body.appendChild(link);

        // Программно имитируем клик по ссылке - запускаем процесс скачивания
        link.click();

        // Удаляем ссылку из DOM после клика (очистка)
        document.body.removeChild(link);

        // Освобождаем память, занятую временным URL
        // Делаем это с небольшой задержкой, чтобы скачивание успело начаться
        setTimeout(() => {
            window.URL.revokeObjectURL(downloadUrl);
        }, 100);

        return { success: true, fileName: filename };

    } catch (error) {
        console.log(error);
        return {
            error: 'Ошибка скачивания файла'
        };
    }
}