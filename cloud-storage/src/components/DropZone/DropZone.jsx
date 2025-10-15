import { useFileDrop } from "../../hooks/useFileDrop";
import classes from "./DropZone.module.css";

export default function DropZone({ onFilesDrop, children }) {
  const {
    isDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useFileDrop();

  const handleDropInternal = (e) => {
    const files = handleDrop(e);
    if (files && files.length > 0) {
      onFilesDrop(files);
    }
  };

  return (
    <div
      className={`${classes.dropZone} ${isDragOver ? classes.dragOver : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDropInternal}
    >
      {isDragOver && (
        <div className={classes.dropOverlay}>
          <div className={classes.dropContent}>
            <div className={classes.dropIcon}>📁</div>
            <div className={classes.dropText}>Отпустите файлы для загрузки</div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
