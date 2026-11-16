import { Button, Nav, Offcanvas } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import {
  Grid1x2,
  Archive,
  Bag,
  People,
  ShieldLock,
  BoxArrowRight,
  House,
} from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: Grid1x2, end: true },
  { to: "/dashboard/products", label: "Products", icon: Archive },
  { to: "/dashboard/carts", label: "Carts", icon: Bag },
  { to: "/dashboard/users", label: "Users", icon: People },
  { to: "/dashboard/auth", label: "Authentication", icon: ShieldLock },
];

function DashboardSidebar({ show, onHide }) {
  const { user, logout } = useAuth();

  return (
    <aside className="ss-sidebar">
      <Offcanvas
        show={show}
        onHide={onHide}
        responsive="lg"
        className="ss-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="ss-brand">ShopStream</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <div className="d-flex flex-column w-100 h-100 p-3 p-lg-4">
            <div className="d-none d-lg-block mb-4 px-2">
              <Link to="/products" className="ss-brand fs-3">
                ShopStream
              </Link>
              <div className="small fw-medium text-body-secondary">
                Admin Panel
              </div>
            </div>

            <Nav as="nav" className="flex-column gap-1" aria-label="Dashboard">
              {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                <Nav.Link
                  key={to}
                  as={NavLink}
                  to={to}
                  end={end}
                  onClick={onHide}
                >
                  <Icon size={20} aria-hidden="true" />
                  {label}
                </Nav.Link>
              ))}
            </Nav>

            <hr className="my-3" />

            <Nav className="flex-column">
              <Nav.Link as={Link} to="/products" onClick={onHide}>
                <House size={20} aria-hidden="true" />
                Home
              </Nav.Link>
            </Nav>

            {user && (
              <div className="ss-sidebar-user d-flex align-items-center gap-3 mt-auto p-3">
                <img
                  src={user.image}
                  alt=""
                  width={44}
                  height={44}
                  className="rounded-circle bg-white"
                />
                <div className="flex-grow-1 overflow-hidden">
                  <div className="fw-semibold text-truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="small text-uppercase text-body-secondary">
                    {user.role}
                  </div>
                </div>
                <Button
                  variant="link"
                  className="p-1 text-body"
                  onClick={logout}
                  aria-label="Sign out"
                >
                  <BoxArrowRight size={20} />
                </Button>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </aside>
  );
}

export default DashboardSidebar;