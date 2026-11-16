import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { Search } from "react-bootstrap-icons";
import useFetch from "../../hooks/useFetch";
import { getCategories, getProducts, PAGE_SIZE } from "../../api/products";
import ProductCard from "../../components/products/ProductCard";
import ProductFilters from "../../components/products/ProductFilters";
import PaginationBar from "../../components/common/PaginationBar";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
];

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [sortBy, order] = sort ? sort.split("-") : ["", ""];
  const skip = (page - 1) * PAGE_SIZE;

  const categoriesState = useFetch(getCategories, []);
  const productsState = useFetch(
    () => getProducts({ q, category, sortBy, order, skip }),
    [q, category, sort, page]
  );

  const categories = categoriesState.data || [];
  const products = productsState.data?.products || [];
  const total = productsState.data?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function updateParams(changes) {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });
    setSearchParams(next);
  }

  function handlePageChange(newPage) {
    updateParams({ page: newPage > 1 ? String(newPage) : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearFilters() {
    setSearchParams({});
  }

  const categoryName = categories.find((item) => item.slug === category)?.name;
  const heading = q
    ? `Results for "${q}"`
    : categoryName || category || "All Products";
  const from = total === 0 ? 0 : skip + 1;
  const to = skip + products.length;
  const showResults = !productsState.isLoading && !productsState.error;

  return (
    <Container fluid="xxl" className="py-4 py-lg-5">
      <Row className="g-4">
        <Col lg={3}>
          <ProductFilters
            categories={categories}
            selected={category}
            onSelect={(slug) => updateParams({ category: slug, q: "", page: "" })}
            onClear={clearFilters}
          />
        </Col>

        <Col lg={9}>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
            <div>
              <h1 className="h5 fw-semibold mb-1">{heading}</h1>
              {showResults && total > 0 && (
                <p className="text-body-secondary mb-0">
                  Showing {from}-{to} of {total} results
                </p>
              )}
            </div>

            <div className="d-flex align-items-center gap-2">
              <Form.Label htmlFor="sort" className="mb-0 text-nowrap text-body-secondary">
                Sort by:
              </Form.Label>
              <Form.Select
                id="sort"
                value={sort}
                onChange={(event) => updateParams({ sort: event.target.value, page: "" })}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          {productsState.isLoading && <Loader text="Loading products..." />}

          {productsState.error && (
            <Alert variant="danger">{productsState.error}</Alert>
          )}

          {showResults && products.length === 0 && (
            <EmptyState
              icon={Search}
              title={q ? `No results for "${q}"` : "No products found"}
              message={q ? "Try a different search term." : "Try a different category."}
            >
              <Button onClick={q ? () => updateParams({ q: "", page: "" }) : clearFilters}>
                {q ? "Clear Search" : "Clear Filters"}
              </Button>
            </EmptyState>
          )}

          {products.length > 0 && (
            <>
              <Row xs={1} sm={2} xl={3} className="g-4 mb-5">
                {products.map((product) => (
                  <Col key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              <PaginationBar
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProductsPage;