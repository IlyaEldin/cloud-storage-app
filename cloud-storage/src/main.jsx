import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainRoutes from "./MainRoutes.jsx";
import { UserContextProvider } from "./components/UserContext/UserContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <MainRoutes />
    </UserContextProvider>
  </StrictMode>
);
