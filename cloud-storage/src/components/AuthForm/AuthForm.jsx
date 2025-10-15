import { useState, useCallback } from "react";
import classes from "./AuthForm.module.css";
import { useAuth } from "../../hooks/useAuth.js";
import AuthTab from "../AuthTab/AuthTab.jsx";
import { FORM_PROPS } from "./config.js";

export default function AuthForm({ formType = "registration" }) {
  const { button, type, name } = FORM_PROPS[formType];

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { authenticateUser } = useAuth();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        const result = await authenticateUser(login, password, type);
        setPassword("");

        if (result.error) {
          alert(result.error);
        }
        if (result.message) {
          setInfo(result.message);
        } else {
          setInfo(result.error);
        }
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [login, password, type, authenticateUser]
  );

  return (
    <>
      <AuthTab />
      <form className={classes.form} onSubmit={handleSubmit}>
        <h3>{name}</h3>
        <input
          type='text'
          placeholder='Введите логин'
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <input
          type='password'
          placeholder='Введите пароль'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={classes.info}>
          <p>{isLoading ? "Запрос на сервер..." : info}</p>
        </div>

        <button type='submit'>{button}</button>
      </form>
    </>
  );
}
