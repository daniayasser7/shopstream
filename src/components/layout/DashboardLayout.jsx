import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";
import { List } from "react-bootstrap-icons";
import DashboardSidebar from "./DashboardSidebar";
import AppFooter from "./AppFooter";

function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
     <div className="d-lg-flex">
      <a href="#main-content" className="visually-hidden-focusable ss-skip-link">
        Skip to main content
      </a>
      <DashboardSidebar
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
      />

      <div className="ss-dashboard-main flex-grow-1 d-flex flex-column min-vh-100">
        <div className="ss-dashboard-topbar d-flex d-lg-none align-items-center gap-2 px-3 py-2">
          <Button
            variant="link"
            className="p-1 text-body"
            onClick={() => setShowSidebar(true)}
            aria-label="Open dashboard menu"
          >
            <List size={28} />
          </Button>
          <span className="ss-brand fs-4">ShopStream</span>
        </div>

        <main id="main-content" className="flex-grow-1 p-3 p-lg-5" tabIndex={-1}>
          <Outlet />
        </main>

        <AppFooter />
      </div>
    </div>
  );
}

export default DashboardLayout;