import { useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { PlusCircle, Trash3 } from "react-bootstrap-icons";
import { formatPrice } from "../../utils/format";

let nextRowKey = 0;

function createRow(productId = "", quantity = "1") {
  nextRowKey += 1;
  return { key: nextRowKey, productId: String(productId), quantity: String(quantity) };
}

function toRows(cart) {
  if (!cart) return [createRow()];
  return cart.products.map((product) => createRow(product.id, product.quantity));
}

function validateCart(userId, rows) {
  const errors = {};
  const chosen = rows.map((row) => row.productId).filter(Boolean);

  if (!userId) {
    errors.userId = "Please choose a user.";
  }

  if (rows.length === 0) {
    errors.rows = "Add at least one product.";
  } else if (rows.some((row) => !row.productId)) {
    errors.rows = "Choose a product in every row.";
  } else if (
    rows.some((row) => !Number.isInteger(Number(row.quantity)) || Number(row.quantity) < 1)
  ) {
    errors.rows = "Quantities must be whole numbers of 1 or more.";
  } else if (new Set(chosen).size !== chosen.length) {
    errors.rows = "Each product can only appear once.";
  }

  return errors;
}

function CartFormModal({ cart, users, products, onHide, onSave }) {
  const isEdit = Boolean(cart);
  const [userId, setUserId] = useState(cart ? String(cart.userId) : "");
  const [rows, setRows] = useState(() => toRows(cart));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function updateRow(key, field, value) {
    setRows((previous) =>
      previous.map((row) => (row.key === key ? { ...row, [field]: value } : row))
    );
    setErrors((previous) => ({ ...previous, rows: "" }));
  }

  function addRow() {
    setRows((previous) => [...previous, createRow()]);
  }

  function removeRow(key) {
    setRows((previous) => previous.filter((row) => row.key !== key));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validateCart(userId, rows);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);
    setServerError("");

    try {
      await onSave({
        userId: Number(userId),
        products: rows.map((row) => ({
          id: Number(row.productId),
          quantity: Number(row.quantity),
        })),
      });
    } catch (error) {
      setServerError(error.message);
      setIsSaving(false);
    }
  }

  return (
    <Modal
      show
      onHide={onHide}
      centered
      size="lg"
      contentClassName="ss-modal"
      aria-labelledby="cart-form-title"
    >
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Header closeButton className="px-4 py-3">
          <div>
            <Modal.Title id="cart-form-title" className="fw-bold">
              {isEdit ? "Edit Cart" : "Add New Cart"}
            </Modal.Title>
            {isEdit && (
              <div className="small text-body-secondary">
                Update the products in {cart.isLocal ? "this new cart" : `cart #${cart.id}`}
              </div>
            )}
          </div>
        </Modal.Header>

        <Modal.Body className="p-4">
          {serverError && <Alert variant="danger">{serverError}</Alert>}

          <Form.Group className="mb-4" controlId="cart-user">
            <Form.Label className="fw-semibold">User</Form.Label>
            <Form.Select
              className="ss-select"
              value={userId}
              onChange={(event) => {
                setUserId(event.target.value);
                setErrors((previous) => ({ ...previous, userId: "" }));
              }}
              isInvalid={Boolean(errors.userId)}
              disabled={isEdit}
            >
              <option value="">Choose a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} (#{user.id})
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userId}</Form.Control.Feedback>
          </Form.Group>

          <div className="fw-semibold mb-2">Products</div>

          <div className="d-flex flex-column gap-2">
            {rows.map((row, index) => (
              <div key={row.key} className="d-flex align-items-center gap-2">
                <Form.Select
                  className="ss-select flex-grow-1"
                  aria-label={`Product ${index + 1}`}
                  value={row.productId}
                  onChange={(event) => updateRow(row.key, "productId", event.target.value)}
                >
                  <option value="">Choose a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title} — {formatPrice(product.price)}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="number"
                  min="1"
                  step="1"
                  className="ss-select ss-qty-input"
                  aria-label={`Quantity for product ${index + 1}`}
                  value={row.quantity}
                  onChange={(event) => updateRow(row.key, "quantity", event.target.value)}
                />
                <Button
                  variant="link"
                  className="ss-icon-btn text-danger"
                  onClick={() => removeRow(row.key)}
                  disabled={rows.length === 1}
                  aria-label={`Remove product ${index + 1}`}
                >
                  <Trash3 size={18} />
                </Button>
              </div>
            ))}
          </div>

          {errors.rows && <div className="small text-danger mt-2">{errors.rows}</div>}

          <Button
            variant="link"
            className="px-0 mt-2 fw-semibold text-decoration-none"
            onClick={addRow}
          >
            <PlusCircle className="me-2" aria-hidden="true" />
            Add another product
          </Button>
        </Modal.Body>

        <Modal.Footer className="ss-modal-footer px-4 py-3">
          <Button
            variant="link"
            className="text-body text-decoration-none fw-semibold"
            onClick={onHide}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Cart"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CartFormModal;