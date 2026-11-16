import { Navbar, Nav, Container, Form } from "react-bootstrap";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Cart3, PersonCircle } from "react-bootstrap-icons";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import { canAccessDashboard } from "../../utils/permissions";

function AppNavbar() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user } = useAuth();
  const showDashboard = canAccessDashboard(user);
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  function handleSearch(event) {
    event.preventDefault();
    const term = event.currentTarget.elements.q.value.trim();
    navigate(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
  }

  return (
    <Navbar expand="lg" collapseOnSelect className="ss-navbar py-3">
      <Container fluid="xxl">
        <Navbar.Brand as={Link} to="/products" className="ss-brand">
          ShopStream
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto ms-lg-4">
            <Nav.Link as={NavLink} to="/products" eventKey="products">
              Products
            </Nav.Link>
            <Nav.Link as={NavLink} to="/categories" eventKey="categories">
              Categories
            </Nav.Link>
              {showDashboard && (
              <Nav.Link as={NavLink} to="/dashboard" eventKey="dashboard">
                Dashboard
              </Nav.Link>
            )}
          </Nav>

          <Form
            role="search"
            className="ss-search my-3 my-lg-0 me-lg-4"
            onSubmit={handleSearch}
          >
            <Search className="ss-search-icon" aria-hidden="true" />
            <Form.Control
              key={currentQuery}
              type="search"
              name="q"
              placeholder="Search products..."
              aria-label="Search products"
              defaultValue={currentQuery}
            />
          </Form>

          <Nav className="flex-row align-items-center gap-3">
            <Nav.Link
              as={NavLink}
              to="/cart"
              eventKey="cart"
              className="ss-icon-link position-relative"
              aria-label={`Your cart, ${itemCount} items`}
              >
              <Cart3 size={22} />
              {itemCount > 0 && (
                <span className="ss-cart-badge" aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/profile"
              eventKey="profile"
              className="ss-icon-link"
              aria-label="Your profile"
            >
              <PersonCircle size={22} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;