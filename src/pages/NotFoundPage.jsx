import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Compass } from "react-bootstrap-icons";
import EmptyState from "../components/common/EmptyState";

function NotFoundPage() {
  return (
    <Container fluid="xxl" className="py-5">
      <title>Page not found | ShopStream</title>
      <EmptyState
        icon={Compass}
        title="Page not found"
        message="The page you're looking for doesn't exist or has moved."
      >
        <Button as={Link} to="/products">
          Back to Products
        </Button>
      </EmptyState>
    </Container>
  );
}

export default NotFoundPage;