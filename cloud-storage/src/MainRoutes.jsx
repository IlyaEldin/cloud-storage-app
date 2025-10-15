import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./components/UserContext/UserContext.jsx";
import AuthForm from "./components/AuthForm/AuthForm.jsx";
import MyFile from "./components/MyFile/MyFile.jsx";
import Layout from "./components/MyFile/Layout.jsx";
import Welcome from "./components/Welcome/Welcome.jsx";
import SharedFile from "./components/MyFile/SharedFile.jsx";

export default function MainRoutes() {
  const { isAuth } = useContext(UserContext);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isCheckingAuth) {
    return <div className='loading'>Проверка авторизации...</div>;
  }

  return (
    <Router>
      <Routes>
        {!isAuth ? (
          // Публичные маршруты
          <>
            <Route path='/login' element={<AuthForm formType='login' />} />
            <Route path='/register' element={<AuthForm />} />
            <Route path='/' element={<AuthForm formType='login' />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </>
        ) : (
          // Приватные маршруты
          <Route element={<Layout />}>
            <Route path='/' element={<Welcome />} />
            <Route path='/myfile' element={<MyFile />} />
            <Route path='/sharedfile' element={<SharedFile />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}
