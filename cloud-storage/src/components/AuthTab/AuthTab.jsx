import { useLocation, useNavigate } from "react-router-dom";
import "./AuthTab.css";

export default function AuthTab() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className='tabSection'>
      <div className='tabs'>
        <button
          className={location.pathname === "/login" ? "active" : ""}
          onClick={() => navigate("/login")}
        >
          Вход
        </button>
        <button
          className={location.pathname === "/register" ? "active" : ""}
          onClick={() => navigate("/register")}
        >
          Регистрация
        </button>
      </div>
    </div>
  );
}
