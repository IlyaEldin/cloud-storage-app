import classes from "./Welcome.module.css";
import { UserContext } from "../UserContext/UserContext";
import { useContext } from "react";

export default function Welcome() {
  const { name, logout } = useContext(UserContext);

  return (
    <div className={classes.welcome}>
      <div className={classes.card}>
        <h1>Добро пожаловать! {name} 👋</h1>
        <p>Ваше облачное хранилище готово к работе</p>

        <div className={classes.instruction}>
          <h3>Чтобы начать:</h3>
          <ul>
            <li>Выберите раздел в меню слева</li>
          </ul>
        </div>
        <button className={classes.btnOut} onClick={() => logout()}>
          ВЫЙТИ
        </button>
      </div>
    </div>
  );
}
