import { useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BagPlus } from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import QuantityStepper from "./QuantityStepper";

function AddToCartControls({ product }) {
  const { user } = useAuth();
  const { addToCart, isSaving } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);

  const outOfStock = product.stock <= 0;

  async function handleAdd() {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setMessage(null);

    try {
      await addToCart(product.id, quantity);
      setMessage({
        variant: "success",
        text: `Added ${quantity} × ${product.title} to your cart.`,
      });
      setQuantity(1);
    } catch (err) {
      setMessage({ variant: "danger", text: err.message });
    }
  }

  return (
    <div className="mt-4">
      <div className="fw-semibold mb-2">Quantity</div>

      <div className="d-flex flex-column flex-sm-row gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={product.stock}
          disabled={isSaving || outOfStock}
        />
        <Button
          size="lg"
          className="flex-grow-1"
          onClick={handleAdd}
          disabled={isSaving || outOfStock}
        >
          {isSaving ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <BagPlus className="me-2" aria-hidden="true" />
          )}
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>

      {message && (
        <Alert
          variant={message.variant}
          className="mt-3 mb-0"
          dismissible
          onClose={() => setMessage(null)}
        >
          {message.text}{" "}
          {message.variant === "success" && (
            <Link to="/cart" className="alert-link">
              View cart
            </Link>
          )}
        </Alert>
      )}
    </div>
  );
}

export default AddToCartControls;