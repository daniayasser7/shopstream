import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Trash3 } from "react-bootstrap-icons";
import ProductThumb from "../products/ProductThumb";
import QuantityStepper from "./QuantityStepper";
import { formatPrice } from "../../utils/format";

function CartItem({ item, disabled, onQuantityChange, onRemove }) {
  const lineTotal = item.discountedTotal ?? item.total;

  return (
    <Card className="ss-card p-3">
      <div className="d-flex gap-3">
        <ProductThumb src={item.thumbnail} size={96} />

        <div className="flex-grow-1 d-flex flex-column flex-sm-row justify-content-between gap-3 overflow-hidden">
          <div className="overflow-hidden">
            <Link
              to={`/products/${item.id}`}
              className="h5 fw-bold d-block text-truncate text-reset text-decoration-none"
            >
              {item.title}
            </Link>
            <small className="d-block text-body-secondary mb-3">
              {formatPrice(item.price)} each
            </small>
            <QuantityStepper
              value={item.quantity}
              onChange={(quantity) => onQuantityChange(item.id, quantity)}
              disabled={disabled}
              label={`Quantity of ${item.title}`}
            />
          </div>

          <div className="d-flex flex-sm-column justify-content-between align-items-end gap-2">
            <span className="fs-5 fw-bold text-primary">{formatPrice(lineTotal)}</span>
            <Button
              variant="link"
              className="p-0 fw-semibold text-danger text-decoration-none"
              onClick={() => onRemove(item.id)}
              disabled={disabled}
            >
              <Trash3 className="me-1" aria-hidden="true" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CartItem;