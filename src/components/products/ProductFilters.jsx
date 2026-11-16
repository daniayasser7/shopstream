import { Button, Form } from "react-bootstrap";

function ProductFilters({ categories, selected, onSelect, onClear }) {
  return (
    <div>
      <h2 className="ss-filter-title">Category</h2>

      <Form.Select
        className="d-lg-none mb-3"
        aria-label="Category"
        value={selected}
        onChange={(event) => onSelect(event.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </Form.Select>

      <div className="d-none d-lg-block ss-filter-list">
        <Form.Check
          type="radio"
          id="category-all"
          name="category"
          label="All categories"
          className="mb-2"
          checked={!selected}
          onChange={() => onSelect("")}
        />
        {categories.map((category) => (
          <Form.Check
            key={category.slug}
            type="radio"
            id={`category-${category.slug}`}
            name="category"
            label={category.name}
            className="mb-2"
            checked={selected === category.slug}
            onChange={() => onSelect(category.slug)}
          />
        ))}
      </div>

      <Button variant="light" className="ss-btn-soft w-100 mt-3" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}

export default ProductFilters;