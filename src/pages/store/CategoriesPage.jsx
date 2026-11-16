import { Alert, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Tag } from "react-bootstrap-icons";
import useFetch from "../../hooks/useFetch";
import { getCategories } from "../../api/products";
import Loader from "../../components/common/Loader";

function CategoriesPage() {
  const { data: categories, isLoading, error } = useFetch(getCategories, []);

  return (
    <Container fluid="xxl" className="py-4 py-lg-5">
      
      <h1 className="fw-bold mb-1">Categories</h1>
      <p className="text-body-secondary mb-4">
        {categories
          ? `${categories.length} categories`
          : "Browse products by category."}
      </p>

      {isLoading && <Loader text="Loading categories..." />}

      {error && <Alert variant="danger">{error}</Alert>}

      {categories && (
        <Row xs={2} md={3} lg={4} xl={6} className="g-3">
          {categories.map((category) => (
            <Col key={category.slug}>
              <Link
                to={`/products?category=${category.slug}`}
                className="ss-category-tile"
              >
                <Tag size={22} aria-hidden="true" />
                <span>{category.name}</span>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default CategoriesPage;