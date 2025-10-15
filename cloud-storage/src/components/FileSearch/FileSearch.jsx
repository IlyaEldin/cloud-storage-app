import classes from "./FileSearch.module.css";

export default function FileSearch({ searchValue, onSearch }) {
  return (
    <div className={classes.search}>
      <input
        type='text'
        placeholder='Введите имя файла...'
        value={searchValue}
        onChange={(event) => onSearch(event.target.value)}
      />
    </div>
  );
}
