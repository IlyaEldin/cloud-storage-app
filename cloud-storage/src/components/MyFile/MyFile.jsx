import { useCallback, useEffect, useContext } from "react";
import File from "./File";
import FileSearch from "../FileSearch/FileSearch";
import FileUpload from "../FileUpload/FileUpload";
import DropZone from "../DropZone/DropZone";
import { useFileSearch } from "../../hooks/useFileSearch";
import { useFiles } from "../../hooks/useFiles";
import { formatFileSize } from "../../utils/formatFileSize";
import { UserContext } from "../UserContext/UserContext";
import classes from "./MyFile.module.css";

export default function MyFile() {
  const { userId } = useContext(UserContext);
  const { files, searchValue, setFiles, loadFiles, handleSearch } =
    useFileSearch(userId);
  const { uploadFile, uploadingFileWithMulter, deleteFile } = useFiles();

  // Загрузка файлов при монтировании компонента
  useEffect(() => {
    loadFiles("");
  }, [loadFiles]);

  const handleFileDelete = (deletedFileId) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== deletedFileId)
    );
  };

  const processFileUpload = useCallback(
    async (file) => {
      let savedFileId = null;

      try {
        const dotIndex = file.name.lastIndexOf(".");
        const fileName = file.name.substring(0, dotIndex); //берем имя до точки
        const fileExtension = file.name.substring(dotIndex + 1); //берем тип после точки
        const sizeFile = formatFileSize(file.size); // брем размер

        const metadataResult = await uploadFile(
          userId,
          fileName,
          fileExtension,
          sizeFile
        ); // отправляем метаданные

        if (!metadataResult.success || !metadataResult.fileId) {
          throw new Error(
            metadataResult.error || "Ошибка сохранения метаданных"
          );
        }

        savedFileId = metadataResult.fileId; // получили id в метаданных

        const uploadResult = await uploadingFileWithMulter(
          userId,
          savedFileId,
          file
        ); // сохраняем с полученным id

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Ошибка загрузки файла");
        }

        await loadFiles(searchValue); //показываем все файлы с сервера
        return { success: true, fileName: file.name };
      } catch (error) {
        console.error("❌ Ошибка загрузки:", error.message);
        if (savedFileId) {
          try {
            await deleteFile(userId, savedFileId); //удаляем если что-то пошло не так
          } catch (deleteError) {
            console.error("❌ Ошибка при откате:", deleteError.message);
          }
        }
        return { success: false, error: error.message, fileName: file.name };
      }
    },
    [
      uploadFile,
      uploadingFileWithMulter,
      deleteFile,
      loadFiles,
      searchValue,
      userId,
    ]
  );

  const handleFileSelect = useCallback(
    async (files) => {
      const results = [];

      for (const file of files) {
        const result = await processFileUpload(file);
        results.push(result);
      }

      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      if (failed > 0) {
        alert(
          `Успешно загружено: ${successful} файлов\nНе удалось загрузить: ${failed} файлов`
        );
      }
    },
    [processFileUpload]
  );

  const handleFilesDrop = useCallback(
    async (files) => {
      await handleFileSelect(files);
    },
    [handleFileSelect]
  );

  return (
    <DropZone onFilesDrop={handleFilesDrop}>
      <div className={classes.explorer}>
        <div className={classes.header}>
          <h2>Мои файлы</h2>
          <div className={classes.userPanel}>
            <FileUpload onFileSelect={handleFileSelect} multiple={true} />
          </div>
        </div>

        <div className={classes.uploadHint}>
          📍 Перетащите файлы в эту область или нажмите кнопку для загрузки
        </div>

        <FileSearch searchValue={searchValue} onSearch={handleSearch} />

        <div className={classes.section}>
          {files && files.length > 0 ? (
            files.map((file) => (
              <File key={file.id} file={file} onFileDelete={handleFileDelete} />
            ))
          ) : (
            <div className={classes.emptyState}>
              {searchValue ? "Файлы не найдены" : "Файлов нет"}
            </div>
          )}
        </div>
      </div>
    </DropZone>
  );
}
