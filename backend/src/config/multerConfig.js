const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureUserDir = (userId) => {
    try {
        const cleanUserId = userId.toString().split('?')[0];
        const userDir = path.join(__dirname, '..', 'user_files', cleanUserId);

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        return userDir;
    } catch (error) {
        console.error('❌ Directory creation error:', error);
        throw new Error(`Не удалось создать папку для пользователя: ${error.message}`);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            let userId = req.query.userId;

            if (!userId) {
                console.error('❌ User ID not provided in query');
                return cb(new Error('User ID не указан'));
            }

            console.log('📁 Setting destination for userId:', userId);
            const userDir = ensureUserDir(userId);
            cb(null, userDir);
        } catch (error) {
            console.error('❌ Destination error:', error);
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        try {
            const fileId = req.query.fileId || req.body.fileId;

            const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

            const fileExtension = path.extname(originalName);
            const filename = `${fileId}${fileExtension}`;

            cb(null, filename);
        } catch (error) {
            console.error('❌ Filename error:', error);
            cb(error);
        }
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

module.exports = upload;