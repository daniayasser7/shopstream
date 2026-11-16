import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ShieldLock } from "react-bootstrap-icons";
import useAuth from "../hooks/useAuth";
import EmptyState from "../components/common/EmptyState";

function AccessDeniedPage() {
  const { user } = useAuth();

  const message = user
    ? `Your account (@${user.username}) has the "${user.role}" role. Only admins can open the dashboard.`
    : "Only admins can open the dashboard.";

  return (
    <Container fluid="xxl" className="py-5">
      <title>Access denied | ShopStream</title>
      <EmptyState icon={ShieldLock} title="Access denied" message={message}>
        <Button as={Link} to="/products">
          Back to Products
        </Button>
      </EmptyState>
    </Container>
  );
}

export default AccessDeniedPage;