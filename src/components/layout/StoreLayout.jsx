import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";

function StoreLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#main-content" className="visually-hidden-focusable ss-skip-link">
        Skip to main content
      </a>
      <AppNavbar />
      <main id="main-content" className="flex-grow-1" tabIndex={-1}>
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}

export default StoreLayout;