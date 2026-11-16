import { useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Cart3 } from "react-bootstrap-icons";
import useCart from "../../hooks/useCart";
import CartItem from "../../components/carts/CartItem";
import CartSummary from "../../components/carts/CartSummary";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";

function CartPage() {
  const { cart, isLoading, isSaving, error, updateQuantity, removeFromCart } =
    useCart();
  const [actionError, setActionError] = useState("");

  async function runAction(action) {
    setActionError("");
    try {
      await action();
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (isLoading) {
    return <Loader text="Loading your cart..." />;
  }

  const items = cart?.products || [];

  return (
    <Container fluid="xxl" className="py-4 py-lg-5">
      <h1 className="fw-bold mb-4">Your Shopping Cart</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {actionError && (
        <Alert variant="danger" dismissible onClose={() => setActionError("")}>
          {actionError}
        </Alert>
      )}

      {items.length === 0 ? (
        <EmptyState
          icon={Cart3}
          title="Your cart is feeling light"
          message="It looks like you haven't added anything to your cart yet."
        >
          <Button as={Link} to="/products">
            Start Shopping
          </Button>
        </EmptyState>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            <div className="d-flex flex-column gap-3">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  disabled={isSaving}
                  onQuantityChange={(id, quantity) =>
                    runAction(() => updateQuantity(id, quantity))
                  }
                  onRemove={(id) => runAction(() => removeFromCart(id))}
                />
              ))}
            </div>
          </Col>

          <Col lg={4}>
            <Card className="ss-card ss-summary-card p-4">
              <h2 className="h4 fw-bold mb-3">Order Summary</h2>
              <CartSummary cart={cart} />
              <p className="small text-body-secondary mt-3 mb-0">
                Cart changes are simulated by DummyJSON and reset when you reload
                the page.
              </p>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default CartPage;