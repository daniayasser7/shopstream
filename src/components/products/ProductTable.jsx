import { Button, Table } from "react-bootstrap";
import { PencilSquare, Trash3 } from "react-bootstrap-icons";
import ProductThumb from "./ProductThumb";
import StockStatus from "./StockStatus";
import { formatPrice } from "../../utils/format";

function ProductTable({ products, onEdit, onDelete }) {
  return (
    <Table responsive hover className="ss-table align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Category</th>
          <th scope="col">Price</th>
          <th scope="col">Stock Status</th>
          <th scope="col" className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>
              <div className="d-flex align-items-center gap-3">
                <ProductThumb src={product.thumbnail} />
                <div>
                  <div className="fw-semibold">{product.title}</div>
                  {product.sku && (
                    <small className="text-body-secondary">SKU: {product.sku}</small>
                  )}
                </div>
              </div>
            </td>
            <td>
              <span className="badge rounded-pill ss-badge-category text-uppercase">
                {product.category}
              </span>
            </td>
            <td className="fw-bold text-nowrap">{formatPrice(product.price)}</td>
            <td>
              <StockStatus stock={product.stock} />
            </td>
            <td className="text-end text-nowrap">
              <Button
                variant="link"
                className="ss-icon-btn text-primary"
                onClick={() => onEdit(product)}
                aria-label={`Edit ${product.title}`}
              >
                <PencilSquare size={18} />
              </Button>
              <Button
                variant="link"
                className="ss-icon-btn text-danger"
                onClick={() => onDelete(product)}
                aria-label={`Delete ${product.title}`}
              >
                <Trash3 size={18} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ProductTable;