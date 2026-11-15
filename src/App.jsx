import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { Cart3 } from "react-bootstrap-icons";

// Temporary page to check that Phase 0 is set up correctly.
// We will delete it in Phase 1.
function SetupCheck() {
  return (
    <Container className="py-5">
      <h1 className="fw-bold">ShopStream</h1>
      <p className="text-body-secondary">
        If this text uses the Inter font, the button is indigo and the cart
        icon shows, Phase 0 works.
      </p>

      <Button variant="primary" className="me-3">
        <Cart3 className="me-2" />
        Primary button
      </Button>
      <Button variant="outline-primary">Outline button</Button>

      <p className="mt-4">
        <Link to="/login">Test routing: go to /login</Link>
      </p>
    </Container>
  );
}

function App() {
  return (
    <Routes>
      {/* The PDF has no home page, so "/" sends you to Products */}
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<SetupCheck />} />
      <Route
        path="/login"
        element={<Container className="py-5">Login page: coming in Phase 2</Container>}
      />
      {/* "*" matches any URL not listed above */}
      <Route
        path="*"
        element={<Container className="py-5">Page not found</Container>}
      />
    </Routes>
  );
}

export default App;