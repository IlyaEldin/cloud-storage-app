const db = require('../config/database');
const fs = require('fs');

const getFilesByUserId = async (req, res) => {

    try {
        const { id } = req.params;

        console.log(id);


        const result = await db.getFilesByUserId(id);

        console.log(result);

        return res.status(201).json({
            result
        });
    }
    catch (error) {
        console.log('getFiles:', error.message);
        res.status(500).json({ error: "Ошибка сервера" });
    }

};

// controllers/fileController.js
const removeFile = async (req, res) => {
    try {
        const { idUser, idFiles } = req.body;
        console.log(idUser);

        const result = await db.deleteFile(idFiles, idUser);


        return res.status(200).json({
            success: true,
            message: 'Файл удален',
            deletedCount: result.deleted,
            filePath: result.filePath
        });
    } catch (error) {
        console.log('removeFile error:', error.message);
        res.status(500).json({
            success: false,
            error: "Ошибка сервера"
        });
    }
};

// controllers/fileController.js
const uploadFile = async (req, res) => {
    try {
        const { idUser, namefile, typefile, sizeFile } = req.body;


        const result = await db.addFile(idUser, namefile, typefile, sizeFile);


        // ✅ ВОЗВРАЩАЕМ fileId клиенту
        return res.status(200).json({
            success: true,
            message: 'Метаданные файла сохранены',
            fileId: result.id // предполагая, что db.addFile возвращает id новой записи
        });
    }
    catch (error) {
        console.log('uploadFile error:', error.message);
        res.status(500).json({
            success: false,
            error: "Ошибка сохранения метаданных файла"
        });
    }
};

// controllers/fileController.js
const uploadFileWithMulter = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Файл не был загружен"
            });
        }

        const { userId, fileId } = req.query;

        // ✅ ОБНОВЛЯЕМ ЗАПИСЬ В БД С ПУТЕМ К ФАЙЛУ
        const result = await db.updateFilePath(fileId, req.file.path);

        res.status(201).json({
            success: true,
            message: 'Файл успешно загружен',
            fileId: fileId,
            filePath: req.file.path
        });

    } catch (error) {
        console.log('❌ File upload error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// controllers/fileController.js - ВАРИАНТ С ТРАНСЛИТЕРАЦИЕЙ
const transliterate = (text) => {
    const cyrToLat = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
        'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
        'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts',
        'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
        'Я': 'Ya',
        ' ': '_', '(': '', ')': '', '[': '', ']': '', '{': '', '}': ''
    };

    return text.split('').map(char => cyrToLat[char] || char).join('');
};

const downloadFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const fileInfo = await db.getFileById(fileId);
        if (!fileInfo) {
            return res.status(404).json({ error: 'Файл не найден' });
        }

        const filePath = fileInfo.file_path;
        if (!filePath || !fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Файл не найден на сервере' });
        }

        // ✅ ТРАНСЛИТЕРИРУЕМ КИРИЛЛИЦУ В ЛАТИНИЦУ
        const originalName = `${fileInfo.namefile}.${fileInfo.typefile}`;
        let safeFileName = `${transliterate(fileInfo.namefile)}.${fileInfo.typefile}`;

        // ✅ ДОПОЛНИТЕЛЬНАЯ ОЧИСТКА ОТ НЕДОПУСТИМЫХ СИМВОЛОВ В ЗАГОЛОВКАХ
        safeFileName = safeFileName.replace(/[^\x20-\x7E]/g, ''); // удаляем все не-ASCII символы

        res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', fs.statSync(filePath).size);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        console.log('❌ Download error:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};


const getFilesBySearch = async (req, res) => {
    try {
        const id = req.params.id;
        const searchValue = req.query.search;

        console.log('🔍 Search request:', { id, searchValue });

        let result;
        if (searchValue && searchValue.trim() !== '') {
            // Получаем все файлы и фильтруем на стороне Node.js
            const allFiles = await db.getFilesByUserId(id);
            const searchTerm = searchValue.trim().toLowerCase();

            result = allFiles.filter(file =>
                file.namefile.toLowerCase().includes(searchTerm)
            );
        } else {
            // Если поиск пустой - возвращаем все файлы
            result = await db.getFilesByUserId(id);
        }

        console.log('🔍 Search result:', result.length, 'files found');

        return res.status(200).json({
            success: true,
            result: result
        });
    }
    catch (error) {
        console.log('❌ getFilesBySearch error:', error.message);
        res.status(500).json({
            success: false,
            error: "Ошибка поиска файлов"
        });
    }
};


module.exports = { getFilesByUserId, removeFile, uploadFile, uploadFileWithMulter, downloadFile, getFilesBySearch };