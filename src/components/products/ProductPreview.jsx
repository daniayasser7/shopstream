import ProductThumb from "./ProductThumb";
import StockStatus from "./StockStatus";
import { formatPrice } from "../../utils/format";

function ProductPreview({ product }) {
  return (
    <div className="ss-preview d-flex align-items-center gap-3 text-start p-3">
      <ProductThumb src={product.thumbnail} size={72} />
      <div className="overflow-hidden">
        <StockStatus stock={product.stock} />
        <div className="fw-bold fs-5 text-truncate">{product.title}</div>
        <div className="d-flex flex-wrap align-items-baseline gap-3">
          {product.sku && (
            <small className="text-body-secondary">SKU: {product.sku}</small>
          )}
          <span className="ss-price fw-bold">{formatPrice(product.price)}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductPreview;