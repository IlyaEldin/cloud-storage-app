import classes from "./File.module.css";
import { useFiles } from "../../hooks/useFiles";
import { UserContext } from "../UserContext/UserContext";
import { useContext } from "react";

export default function File({ file, onFileDelete, all = false }) {
  const { deleteFile, downloadFileById } = useFiles();
  const { userId } = useContext(UserContext);

  function getFileIcon(type) {
    const icons = {
      jpg: "🌅", // пейзаж
      png: "🖼️", // рамка
      zip: "🎁", // подарок/коробка
      odt: "📘", // синяя книга (OpenDocument)
      pdf: "📋", // планшет с клипбордом
      default: "📄",
    };

    return icons[type.toLowerCase()] || icons.default;
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ru-RU");
  }

  const handleDownload = async () => {
    try {
      const result = await downloadFileById(file.id);

      if (!result.success) {
        alert(`Ошибка скачивания: ${result.error}`);
        return;
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Ошибка при скачивании файла");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Удалить файл "${file.namefile}.${file.typefile}"?`)) {
      return;
    }

    const result = await deleteFile(all === true ? "all" : userId, file.id);

    if (result.success) {
      onFileDelete(file.id);
    } else {
      alert(`Ошибка удаления: ${result.error}`);
    }
  };

  return (
    <div className={classes.file}>
      <div className={classes.icon}>{getFileIcon(file.typefile)}</div>
      <div className={classes.info}>
        <div className={classes.name}>
          {file.namefile}.{file.typefile}
        </div>
        <div className={classes.details}>
          {file.sizefile} • {formatDate(file.created_at)}
        </div>
      </div>
      <div className={classes.actions}>
        <button className={classes.menuButton}>⋯</button>
        <div className={classes.dropdown}>
          <button className={classes.dropdownItem} onClick={handleDownload}>
            📥 Скачать
          </button>
          <button className={classes.dropdownItem} onClick={handleDelete}>
            🗑️ Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
