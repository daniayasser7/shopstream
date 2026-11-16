import { Alert, Breadcrumb, Card, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { ShieldCheck, Truck, ArrowCounterclockwise, BoxSeam } from "react-bootstrap-icons";
import useFetch from "../../hooks/useFetch";
import { getProduct } from "../../api/products";
import { formatPrice, getDiscount, getFinalPrice } from "../../utils/format";
import ProductGallery from "../../components/products/ProductGallery";
import StarRating from "../../components/common/StarRating";
import Loader from "../../components/common/Loader";
import AddToCartControls from "../../components/carts/AddToCartControls";

function getStockBadgeClass(status) {
  if (status === "In Stock") return "ss-badge-mint";
  if (status === "Low Stock") return "ss-badge-warning";
  return "ss-badge-soft";
}

function SpecCard({ title, rows }) {
  return (
    <Card className="ss-card p-4 h-100">
      <h3 className="h5 fw-bold mb-3">{title}</h3>
      <dl className="ss-info-list">
        {rows.map(([label, value]) => (
          <div key={label} className="ss-info-row">
            <dt>{label}</dt>
            <dd className="text-capitalize">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useFetch(() => getProduct(id), [id]);

  if (isLoading) {
    return <Loader text="Loading product..." />;
  }

  if (error) {
    return (
      <Container fluid="xxl" className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/products">Back to products</Link>
      </Container>
    );
  }

  const discount = getDiscount(product);
  const images = product.images?.length ? product.images : [product.thumbnail];
  const reviews = product.reviews || [];
  const dimensions = product.dimensions
    ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth}`
    : "";

  const highlights = [
    { icon: ShieldCheck, text: product.warrantyInformation },
    { icon: Truck, text: product.shippingInformation },
    { icon: ArrowCounterclockwise, text: product.returnPolicy },
    {
      icon: BoxSeam,
      text: product.minimumOrderQuantity
        ? `Minimum order: ${product.minimumOrderQuantity}`
        : "",
    },
  ].filter((item) => item.text);

  return (
    <Container fluid="xxl" className="py-4 py-lg-5">
      <Breadcrumb className="ss-breadcrumb mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>
          Products
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: `/products?category=${product.category}` }}
          className="text-capitalize"
        >
          {product.category}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{product.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="g-4 g-lg-5 mb-5">
                <Col lg={5}>
          <ProductGallery key={product.id} images={images} title={product.title} />
        </Col>

        <Col lg={7}>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span
              className={`badge rounded-pill px-3 py-2 ${getStockBadgeClass(product.availabilityStatus)}`}
            >
              {product.availabilityStatus}
            </span>
            {product.sku && (
              <small className="text-body-secondary">SKU: {product.sku}</small>
            )}
          </div>

          <h1 className="fw-bold mb-2">{product.title}</h1>

          <div className="d-flex align-items-center gap-2 mb-4">
            <StarRating rating={product.rating} />
            <span className="fw-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-body-secondary">({reviews.length} reviews)</span>
          </div>

          <div className="d-flex align-items-baseline flex-wrap gap-2">
            <span className="display-6 fw-bold">
              {formatPrice(getFinalPrice(product))}
            </span>
            {discount > 0 && (
              <>
                <span className="text-body-secondary text-decoration-line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="ss-price fw-bold">({discount}% OFF)</span>
              </>
            )}
          </div>

          <hr className="my-4" />

          <p className="ss-description">{product.description}</p>

          <AddToCartControls key={product.id} product={product} />

          <ul className="list-unstyled row row-cols-1 row-cols-sm-2 g-3 mt-3 mb-0">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="col d-flex align-items-center gap-2">
                <Icon size={20} className="ss-highlight-icon flex-shrink-0" aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </Col>
      </Row>

      <Tabs defaultActiveKey="specs" id="product-tabs" className="ss-tabs mb-4">
        <Tab eventKey="specs" title="Specifications">
          <Row xs={1} md={2} className="g-4">
            <Col>
              <SpecCard
                title="Product"
                rows={[
                  ["Brand", product.brand],
                  ["Category", product.category],
                  ["SKU", product.sku],
                  ["Stock", `${product.stock} units`],
                ]}
              />
            </Col>
            <Col>
              <SpecCard
                title="Physical"
                rows={[
                  ["Weight", product.weight],
                  ["Dimensions (W × H × D)", dimensions],
                  ["Tags", product.tags?.join(", ")],
                ]}
              />
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="reviews" title={`Reviews (${reviews.length})`}>
          {reviews.length === 0 ? (
            <p className="text-body-secondary">No reviews yet.</p>
          ) : (
            <Row xs={1} md={2} className="g-4">
              {reviews.map((review, index) => (
                <Col key={index}>
                  <Card className="ss-card p-4 h-100">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <div>
                        <div className="fw-semibold">{review.reviewerName}</div>
                        <small className="text-body-secondary">
                          {new Date(review.date).toLocaleDateString()}
                        </small>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    <p className="mb-0">{review.comment}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
}

export default ProductDetailsPage;