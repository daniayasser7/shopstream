import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartPlus, Check2, StarFill } from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { formatPrice, getDiscount, getFinalPrice } from "../../utils/format";

function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("idle");

  const discount = getDiscount(product);
  const showDiscount = discount >= 10;

  async function handleAdd() {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setStatus("adding");

    try {
      await addToCart(product.id, 1);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
    }
  }

  const buttonText =
    status === "added" ? "Added" : status === "error" ? "Retry" : "Add";

  return (
    <Card className="ss-card ss-product-card h-100">
      <div className="ss-product-image">
        <img src={product.thumbnail} alt="" loading="lazy" />
        {showDiscount && (
          <span className="badge ss-badge-discount">-{discount}%</span>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <Card.Title as="h3" className="h6 fw-bold mb-0 text-truncate">
            <Link
              to={`/products/${product.id}`}
              className="stretched-link text-reset text-decoration-none"
            >
              {product.title}
            </Link>
          </Card.Title>
          <span className="ss-rating flex-shrink-0">
            <StarFill aria-hidden="true" />
            <span className="visually-hidden">Rating </span>
            {product.rating.toFixed(1)}
          </span>
        </div>

        <p className="ss-line-clamp-2 text-body-secondary small mb-3">
          {product.description}
        </p>

        <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-baseline flex-wrap gap-2">
            <span className="ss-price fs-5 fw-bold">
              {formatPrice(getFinalPrice(product))}
            </span>
            {showDiscount && (
              <span className="small text-body-secondary text-decoration-line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            className="ss-add-btn position-relative d-inline-flex align-items-center gap-1"
            onClick={handleAdd}
            disabled={status === "adding"}
            aria-label={`Add ${product.title} to cart`}
          >
            {status === "added" ? (
              <Check2 size={16} aria-hidden="true" />
            ) : (
              <CartPlus size={16} aria-hidden="true" />
            )}
            {buttonText}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;