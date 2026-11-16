import { Pagination } from "react-bootstrap";

function getPageItems(page, totalPages) {
  const items = [];

  for (let number = 1; number <= totalPages; number++) {
    const isEdge = number === 1 || number === totalPages;
    const isNearCurrent = Math.abs(number - page) <= 1;

    if (isEdge || isNearCurrent) {
      items.push(number);
    } else if (items[items.length - 1] !== "...") {
      items.push("...");
    }
  }

  return items;
}

function PaginationBar({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);

  return (
    <nav aria-label="Pagination">
      <Pagination className="ss-pagination justify-content-center mb-0">
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        />
        {items.map((item, index) =>
          item === "..." ? (
            <Pagination.Ellipsis key={`gap-${index}`} disabled />
          ) : (
            <Pagination.Item
              key={item}
              active={item === page}
              onClick={() => onChange(item)}
            >
              {item}
            </Pagination.Item>
          )
        )}
        <Pagination.Next
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        />
      </Pagination>
    </nav>
  );
}

export default PaginationBar;