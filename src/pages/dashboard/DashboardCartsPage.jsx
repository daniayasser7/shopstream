import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { Plus, Funnel, Bag } from "react-bootstrap-icons";
import useFetch from "../../hooks/useFetch";
import useLocalChanges from "../../hooks/useLocalChanges";
import {
  CARTS_PAGE_SIZE,
  getCarts,
  getUserCarts,
  addCart,
  updateCart,
  deleteCart,
} from "../../api/carts";
import { getUserOptions } from "../../api/users";
import { getProductOptions } from "../../api/products";
import CartTable from "../../components/carts/CartTable";
import CartFormModal from "../../components/carts/CartFormModal";
import CartDetailsModal from "../../components/carts/CartDetailsModal";
import UserAvatar from "../../components/users/UserAvatar";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import PaginationBar from "../../components/common/PaginationBar";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import { formatPrice } from "../../utils/format";

function CartPreview({ cart, user }) {
  return (
    <div className="ss-preview d-flex align-items-center gap-3 text-start p-3">
      <UserAvatar user={user} size={56} />
      <div>
        <div className="fw-bold fs-5">
          {cart.isLocal ? "New cart" : `Cart #${cart.id}`}
        </div>
        <div className="text-body-secondary">
          {user ? `${user.firstName} ${user.lastName}` : `User #${cart.userId}`} ·{" "}
          {cart.totalQuantity} items ·{" "}
          <span className="ss-price fw-bold">{formatPrice(cart.discountedTotal)}</span>
        </div>
      </div>
    </div>
  );
}

function DashboardCartsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdFilter = searchParams.get("userId") || "";
  const page = Number(searchParams.get("page")) || 1;
  const skip = (page - 1) * CARTS_PAGE_SIZE;

  const { data, isLoading, error } = useFetch(
    () => (userIdFilter ? getUserCarts(userIdFilter) : getCarts({ skip })),
    [userIdFilter, page]
  );
  const { data: usersData } = useFetch(getUserOptions, []);
  const { data: productsData } = useFetch(getProductOptions, []);
  const { added, applyChanges, addItem, updateItem, removeItem, deletedCount } =
    useLocalChanges();

  const [modal, setModal] = useState({ type: null, cart: null });
  const [notice, setNotice] = useState("");

  const users = usersData?.users || [];
  const usersById = Object.fromEntries(users.map((user) => [user.id, user]));
  const filterUser = usersById[userIdFilter];

  const matchingAdded = added.filter(
    (cart) => !userIdFilter || String(cart.userId) === userIdFilter
  );
  const rows = [
    ...(page === 1 ? matchingAdded : []),
    ...applyChanges(data?.carts || []),
  ];
  const total = data
    ? Math.max(0, data.total + matchingAdded.length - deletedCount)
    : 0;
  const totalPages =
    data && !userIdFilter ? Math.ceil(data.total / CARTS_PAGE_SIZE) : 1;
  const from = rows.length === 0 ? 0 : skip + 1;
  const to = skip + rows.length;

  function handleFilter(event) {
    event.preventDefault();
    const value = event.currentTarget.elements.userId.value.trim();
    setSearchParams(value ? { userId: value } : {});
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
    setModal({ type: null, cart: null });
  }

  async function handleSave(formData) {
    if (modal.type === "edit") {
      const original = modal.cart;

      if (original.isLocal) {
        const response = await addCart({
          userId: original.userId,
          products: formData.products,
        });
        updateItem({ ...response, id: original.id, isLocal: true });
        setNotice("The new cart was updated.");
      } else {
        const response = await updateCart(original.id, {
          merge: false,
          products: formData.products,
        });
        updateItem({ ...response, id: original.id, isEdited: true });
        setNotice(`Cart #${original.id} was updated.`);
      }
    } else {
      const response = await addCart(formData);
      addItem({ ...response, id: Date.now() });
      setNotice("A new cart was created.");
    }

    closeModal();
  }

  async function handleDelete() {
    const cart = modal.cart;

    if (!cart.isLocal) {
      await deleteCart(cart.id);
    }

    removeItem(cart);
    setNotice(cart.isLocal ? "The new cart was deleted." : `Cart #${cart.id} was deleted.`);
    closeModal();
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">Cart Management</h1>
          <p className="text-body-secondary mb-1">
            Oversee and monitor all customer shopping activity.
          </p>
          <small className="text-body-secondary">
            DummyJSON simulates changes, so they reset when you reload the page.
          </small>
        </div>
        <Button
          className="ss-btn-mint px-4 py-2 align-self-start"
          onClick={() => setModal({ type: "add", cart: null })}
        >
          <Plus size={22} aria-hidden="true" /> Add New Cart
        </Button>
      </div>

      {notice && (
        <Alert variant="success" dismissible onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      <Card className="ss-card p-3 mb-4">
        <Form className="d-flex flex-column flex-sm-row gap-2" onSubmit={handleFilter}>
          <Form.Control
            key={userIdFilter}
            name="userId"
            type="number"
            min="1"
            className="ss-select"
            placeholder="Filter by user ID (e.g. 5)"
            aria-label="Filter carts by user ID"
            defaultValue={userIdFilter}
          />
          <Button type="submit" className="px-4 text-nowrap">
            <Funnel className="me-2" aria-hidden="true" />
            Filter
          </Button>
          {userIdFilter && (
            <Button
              variant="light"
              className="ss-btn-soft px-4 text-nowrap"
              onClick={() => setSearchParams({})}
            >
              Clear
            </Button>
          )}
        </Form>
      </Card>

      {userIdFilter && (
        <p className="fw-semibold">
          Carts for user #{userIdFilter}
          {filterUser && ` (${filterUser.firstName} ${filterUser.lastName})`}
        </p>
      )}

      <Card className="ss-card overflow-hidden">
        {isLoading && <Loader text="Loading carts..." />}

        {error && (
          <Alert variant="danger" className="m-3">
            {error}
          </Alert>
        )}

        {!isLoading && !error && rows.length === 0 && (
          <EmptyState
            icon={Bag}
            title={userIdFilter ? `No carts for user #${userIdFilter}` : "No carts"}
            message={userIdFilter ? "Try a different user ID." : "Add your first cart."}
          />
        )}

        {!isLoading && !error && rows.length > 0 && (
          <>
            <CartTable
              carts={rows}
              usersById={usersById}
              onView={(cart) => setModal({ type: "view", cart })}
              onEdit={(cart) => setModal({ type: "edit", cart })}
              onDelete={(cart) => setModal({ type: "delete", cart })}
            />
            <div className="ss-table-footer d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 px-4 py-3">
              <span className="text-body-secondary">
                Showing {from} to {to} of {total} carts
              </span>
              <PaginationBar page={page} totalPages={totalPages} onChange={goToPage} />
            </div>
          </>
        )}
      </Card>

      {modal.type === "view" && (
        <CartDetailsModal
          cart={modal.cart}
          user={usersById[modal.cart.userId]}
          onHide={closeModal}
        />
      )}

      {(modal.type === "add" || modal.type === "edit") && (
        <CartFormModal
          cart={modal.cart}
          users={users}
          products={productsData?.products || []}
          onHide={closeModal}
          onSave={handleSave}
        />
      )}

      {modal.type === "delete" && (
        <ConfirmDeleteModal
          title="Delete Cart?"
          message="This action is permanent and cannot be undone. All products in this cart will be removed."
          confirmLabel="Confirm Delete"
          onHide={closeModal}
          onConfirm={handleDelete}
        >
          <CartPreview cart={modal.cart} user={usersById[modal.cart.userId]} />
        </ConfirmDeleteModal>
      )}
    </>
  );
}

export default DashboardCartsPage;