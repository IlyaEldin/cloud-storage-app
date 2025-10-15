import { Outlet } from "react-router";
import { useContext, useState } from "react";
import classes from "./Layout.module.css";
import { UserContext } from "../UserContext/UserContext";
import { Link } from "react-router";

export default function Layout() {
  const { name } = useContext(UserContext);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={classes.layout}>
      <header className={classes.header}>
        <div className={classes.headerLeft}>
          <button
            className={classes.menuButton}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            ☰
          </button>
          <h1 className={classes.logo}>Мое хранилище</h1>
        </div>

        <div className={classes.userPanel}>
          <span className={classes.userName}>
            Пользователь:{" "}
            <Link className={classes.navLink} to='/'>
              {name}
            </Link>
          </span>
          <div className={classes.avatar}>
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </header>

      <div className={classes.mainContent}>
        <aside
          className={`${classes.sidebar} ${
            isSidebarCollapsed ? classes.collapsed : ""
          }`}
        >
          <nav className={classes.nav}>
            <Link to='/myfile' className={classes.navLink}>
              📁 {isSidebarCollapsed ? "" : "Мои файлы"}
            </Link>
            <Link to='/sharedfile' className={classes.navLink}>
              📤 {isSidebarCollapsed ? "" : "Общие файлы"}
            </Link>
          </nav>
        </aside>

        <main className={classes.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
