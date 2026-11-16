import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, BoxSeam } from "react-bootstrap-icons";
import useFetch from "../../hooks/useFetch";
import useLocalChanges from "../../hooks/useLocalChanges";
import {
  getProducts,
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../api/products";
import ProductTable from "../../components/products/ProductTable";
import ProductFormModal from "../../components/products/ProductFormModal";
import ProductPreview from "../../components/products/ProductPreview";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import PaginationBar from "../../components/common/PaginationBar";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";

const DASHBOARD_PAGE_SIZE = 10;
const DASHBOARD_FIELDS =
  "title,description,price,discountPercentage,stock,sku,category,thumbnail,brand,rating";

function DashboardProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const skip = (page - 1) * DASHBOARD_PAGE_SIZE;

  const { data, isLoading, error } = useFetch(
    () =>
      getProducts({
        q,
        skip,
        limit: DASHBOARD_PAGE_SIZE,
        select: DASHBOARD_FIELDS,
      }),
    [q, page]
  );
  const { data: categories } = useFetch(getCategories, []);
  const { added, applyChanges, addItem, updateItem, removeItem, deletedCount } =
    useLocalChanges();

  const [modal, setModal] = useState({ type: null, product: null });
  const [notice, setNotice] = useState("");

  const matchingAdded = added.filter((product) =>
    product.title.toLowerCase().includes(q.toLowerCase())
  );
  const rows = [
    ...(page === 1 ? matchingAdded : []),
    ...applyChanges(data?.products || []),
  ];
  const total = data
    ? Math.max(0, data.total + matchingAdded.length - deletedCount)
    : 0;
  const totalPages = data ? Math.ceil(data.total / DASHBOARD_PAGE_SIZE) : 0;
  const from = rows.length === 0 ? 0 : skip + 1;
  const to = skip + rows.length;

  function handleSearch(event) {
    event.preventDefault();
    const term = event.currentTarget.elements.search.value.trim();
    setSearchParams(term ? { q: term } : {});
  }

  function goToPage(newPage) {
    const next = new URLSearchParams(searchParams);
    if (newPage > 1) {
      next.set("page", String(newPage));
    } else {
      next.delete("page");
    }
    setSearchParams(next);
  }

  function closeModal() {
    setModal({ type: null, product: null });
  }

  async function handleSave(formData) {
    if (modal.type === "edit") {
      const original = modal.product;
      let saved;

      if (original.isLocal) {
        saved = { ...original, ...formData };
      } else {
        const response = await updateProduct(original.id, formData);
        saved = { ...original, ...response, ...formData };
      }

      updateItem(saved);
      setNotice(`"${saved.title}" was updated.`);
    } else {
      const response = await addProduct(formData);
      addItem({ ...response, ...formData, id: Date.now() });
      setNotice(`"${formData.title}" was created.`);
    }

    closeModal();
  }

  async function handleDelete() {
    const product = modal.product;

    if (!product.isLocal) {
      await deleteProduct(product.id);
    }

    removeItem(product);
    setNotice(`"${product.title}" was deleted.`);
    closeModal();
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">Product Inventory</h1>
          <p className="text-body-secondary mb-1">
            Manage your catalog, stock levels, and pricing.
          </p>
          <small className="text-body-secondary">
            DummyJSON simulates changes, so they reset when you reload the page.
          </small>
        </div>
        <Button
          className="ss-btn-mint px-4 py-2 align-self-start"
          onClick={() => setModal({ type: "add", product: null })}
        >
          <Plus size={22} aria-hidden="true" /> Add New Product
        </Button>
      </div>

      {notice && (
        <Alert variant="success" dismissible onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      <Card className="ss-card p-3 mb-4">
        <Form role="search" className="ss-search" onSubmit={handleSearch}>
          <Search className="ss-search-icon" aria-hidden="true" />
          <Form.Control
            key={q}
            name="search"
            type="search"
            placeholder="Search products by name..."
            aria-label="Search products"
            defaultValue={q}
          />
        </Form>
      </Card>

      <Card className="ss-card overflow-hidden">
        {isLoading && <Loader text="Loading products..." />}

        {error && (
          <Alert variant="danger" className="m-3">
            {error}
          </Alert>
        )}

        {!isLoading && !error && rows.length === 0 && (
          <EmptyState
            icon={BoxSeam}
            title={q ? `No products match "${q}"` : "No products"}
            message={q ? "Try a different search term." : "Add your first product."}
          />
        )}

        {!isLoading && !error && rows.length > 0 && (
          <>
            <ProductTable
              products={rows}
              onEdit={(product) => setModal({ type: "edit", product })}
              onDelete={(product) => setModal({ type: "delete", product })}
            />
            <div className="ss-table-footer d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 px-4 py-3">
              <span className="text-body-secondary">
                Showing {from} to {to} of {total} products
              </span>
              <PaginationBar page={page} totalPages={totalPages} onChange={goToPage} />
            </div>
          </>
        )}
      </Card>

      {(modal.type === "add" || modal.type === "edit") && (
        <ProductFormModal
          product={modal.product}
          categories={categories || []}
          onHide={closeModal}
          onSave={handleSave}
        />
      )}

      {modal.type === "delete" && (
        <ConfirmDeleteModal
          title="Delete Product?"
          message="This action is permanent and cannot be undone. All data associated with this product will be removed from the store's inventory."
          confirmLabel="Confirm Delete"
          onHide={closeModal}
          onConfirm={handleDelete}
        >
          <ProductPreview product={modal.product} />
        </ConfirmDeleteModal>
      )}
    </>
  );
}

export default DashboardProductsPage;