import { useCallback, useState } from "react";
import { UserContext } from "./UserContext";
import { useEffect } from "react";

export function UserContextProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const savedId = localStorage.getItem("id");
    const savedAuth = localStorage.getItem("isAuth");
    const savedName = localStorage.getItem("name");

    if (savedId && savedId !== "null") {
      setUserId(savedId);
    }
    if (savedAuth === "true") {
      setIsAuth(true);
    }
    if (savedName && savedName !== "null") {
      setName(savedName);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("id", userId);
    localStorage.setItem("isAuth", isAuth);
    localStorage.setItem("name", name);
  }, [userId, isAuth, name]);

  const loginIn = useCallback((id, name) => {
    setUserId(id);
    setIsAuth(true);
    setName(name);
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setIsAuth(false);
    setName("");
  }, []);

  const value = {
    name,
    userId,
    isAuth,
    loginIn,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
