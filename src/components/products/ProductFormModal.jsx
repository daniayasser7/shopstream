import { useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import FormField from "../common/FormField";
import ProductThumb from "./ProductThumb";

const EMPTY_VALUES = {
  title: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  thumbnail: "",
};

const URL_PATTERN = /^https?:\/\//;

function toFormValues(product) {
  if (!product) return EMPTY_VALUES;

  return {
    title: product.title || "",
    sku: product.sku || "",
    category: product.category || "",
    price: String(product.price ?? ""),
    stock: String(product.stock ?? ""),
    description: product.description || "",
    thumbnail: product.thumbnail || "",
  };
}

function validateProduct(values) {
  const errors = {};
  const stock = Number(values.stock);

  if (values.title.trim().length < 2) {
    errors.title = "Please enter a product name.";
  }

  if (!values.category) {
    errors.category = "Please choose a category.";
  }

  if (values.price === "" || Number(values.price) <= 0) {
    errors.price = "Price must be greater than 0.";
  }

  if (values.stock === "" || !Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a whole number (0 or more).";
  }

  if (values.thumbnail && !URL_PATTERN.test(values.thumbnail.trim())) {
    errors.thumbnail = "Image URL must start with http:// or https://";
  }

  return errors;
}

function ProductFormModal({ product, categories, onHide, onSave }) {
  const isEdit = Boolean(product);
  const [values, setValues] = useState(() => toFormValues(product));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validateProduct(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);
    setServerError("");

    try {
      await onSave({
        title: values.title.trim(),
        sku: values.sku.trim(),
        category: values.category,
        price: Number(values.price),
        stock: Number(values.stock),
        description: values.description.trim(),
        thumbnail: values.thumbnail.trim(),
      });
    } catch (error) {
      setServerError(error.message);
      setIsSaving(false);
    }
  }

  const showPreview = URL_PATTERN.test(values.thumbnail.trim());

  return (
    <Modal
      show
      onHide={onHide}
      centered
      size="lg"
      contentClassName="ss-modal"
      aria-labelledby="product-form-title"
    >
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Header closeButton className="px-4 py-3">
          <div>
            <Modal.Title id="product-form-title" className="fw-bold">
              {isEdit ? "Edit Product" : "Add New Product"}
            </Modal.Title>
            {isEdit && (
              <div className="small text-body-secondary">
                Update details for {product.title}
              </div>
            )}
          </div>
        </Modal.Header>

        <Modal.Body className="p-4">
          {serverError && <Alert variant="danger">{serverError}</Alert>}

          <Row>
            <Col md={6}>
              <FormField
                id="title"
                name="title"
                label="Product Name"
                placeholder="e.g. SonicWave Pro 2"
                value={values.title}
                onChange={handleChange}
                error={errors.title}
              />
            </Col>
            <Col md={6}>
              <FormField
                id="sku"
                name="sku"
                label="SKU"
                placeholder="SKU-0000-XX"
                value={values.sku}
                onChange={handleChange}
                error={errors.sku}
              />
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label className="fw-semibold">Category</Form.Label>
                <Form.Select
                  name="category"
                  className="ss-select"
                  value={values.category}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.category)}
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <FormField
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                label="Price ($)"
                placeholder="0.00"
                value={values.price}
                onChange={handleChange}
                error={errors.price}
              />
            </Col>

            <Col md={6}>
              <FormField
                id="stock"
                name="stock"
                type="number"
                step="1"
                min="0"
                label="Stock Quantity"
                placeholder="0"
                value={values.stock}
                onChange={handleChange}
                error={errors.stock}
              />
            </Col>
            <Col md={6}>
              <FormField
                id="thumbnail"
                name="thumbnail"
                type="url"
                label="Image URL"
                placeholder="https://..."
                value={values.thumbnail}
                onChange={handleChange}
                error={errors.thumbnail}
              />
            </Col>

            <Col xs={12}>
              <FormField
                id="description"
                name="description"
                as="textarea"
                rows={3}
                label="Description"
                placeholder="Enter product details..."
                value={values.description}
                onChange={handleChange}
                error={errors.description}
              />
            </Col>
          </Row>

          {showPreview && (
            <div className="d-flex align-items-center gap-3">
              <ProductThumb src={values.thumbnail.trim()} size={88} />
              <small className="text-body-secondary">Image preview</small>
            </div>
          )}
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
              "Create Product"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ProductFormModal;