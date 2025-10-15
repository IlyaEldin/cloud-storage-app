
import removeFile from "../services/removeFileApi";
import uploadingFile from "../services/uploadFileApi";
import uploadFileWithMulter from "../services/uploadFileWithMulterApi";
import downloadFile from "../services/downloadFileApi";


//hook для работы с файлами в хранилище
export const useFiles = () => {

    const deleteFile = async (idUser, idFile) => {
        try {
            console.log(idUser);
            const response = await removeFile(idUser, idFile);
            return response;
        } catch (error) {
            console.log('Delete file error:', error.message);
            throw error;
        }
    };


    const uploadFile = async (idUser, namefile, typefile, sizeFile) => {

        try {
            const response = await uploadingFile(idUser, namefile, typefile, sizeFile);
            return response
        } catch (error) {
            console.log(error.message)
        }

    }

    const uploadingFileWithMulter = async (userId, fileId, file) => {
        try {
            const response = await uploadFileWithMulter(userId, fileId, file);
            return response
        } catch (error) {
            console.log('Multer upload error:', error.message);
            return { success: false, error: error.message }
        }
    }


    const downloadFileById = async (fileId) => {
        try {
            const response = await downloadFile(fileId);
            return response;
        } catch (error) {
            console.log('Download file error:', error.message);
            throw error;
        }
    };

    return {
        deleteFile,
        uploadFile,
        uploadingFileWithMulter,
        downloadFileById
    };
};
