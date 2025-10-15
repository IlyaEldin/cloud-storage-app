import { useRef } from "react";
import classes from "./FileUpload.module.css";

export default function FileUpload({
  onFileSelect,
  accept = "*/*",
  multiple = false,
}) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      onFileSelect(files);
    }
    event.target.value = "";
  };

  return (
    <>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        style={{ display: "none" }}
      />
      <button
        className={classes.uploadButton}
        onClick={handleClick}
        type='button'
      >
        📁 Загрузить файл
      </button>
    </>
  );
}
