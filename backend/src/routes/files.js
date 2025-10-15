const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { getFilesByUserId, removeFile, uploadFileWithMulter, uploadFile, downloadFile, getFilesBySearch } = require('../controllers/fileController');

router.get('/getfiles/:id', getFilesByUserId);
router.get('/getsearchfiles/:id', getFilesBySearch);
router.post('/removefile/', removeFile);
router.post('/uploadfile', uploadFile);                    // Для метаданных
router.post('/uploadfile/multer', upload.single('file'), uploadFileWithMulter); // Для файлов
router.get('/download/:fileId', downloadFile);

module.exports = router;