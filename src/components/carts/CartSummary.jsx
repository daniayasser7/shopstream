import { formatPrice } from "../../utils/format";

function CartSummary({ cart }) {
  const discount = cart.total - cart.discountedTotal;

  return (
    <dl className="ss-info-list">
      <div className="ss-info-row">
        <dt>Items</dt>
        <dd>{cart.totalQuantity}</dd>
      </div>
      <div className="ss-info-row">
        <dt>Subtotal</dt>
        <dd>{formatPrice(cart.total)}</dd>
      </div>
      <div className="ss-info-row">
        <dt>Discount</dt>
        <dd className="ss-price">−{formatPrice(discount)}</dd>
      </div>
      <div className="ss-info-row ss-summary-total">
        <dt>Total</dt>
        <dd>{formatPrice(cart.discountedTotal)}</dd>
      </div>
    </dl>
  );
}

export default CartSummary;