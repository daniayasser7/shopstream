import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { PersonPlus, Search, People } from "react-bootstrap-icons";
import useFetch from "../../hooks/useFetch";
import useLocalChanges from "../../hooks/useLocalChanges";
import {
  USERS_PAGE_SIZE,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../api/users";
import UserTable from "../../components/users/UserTable";
import UserFormModal from "../../components/users/UserFormModal";
import UserDetailsModal from "../../components/users/UserDetailsModal";
import UserAvatar from "../../components/users/UserAvatar";
import RoleBadge from "../../components/users/RoleBadge";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import PaginationBar from "../../components/common/PaginationBar";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";

const FILTER_OPTIONS = [
  { value: "", label: "All users" },
  { value: "role:admin", label: "Role: Admin" },
  { value: "role:moderator", label: "Role: Moderator" },
  { value: "role:user", label: "Role: User" },
  { value: "gender:female", label: "Gender: Female" },
  { value: "gender:male", label: "Gender: Male" },
];

function matchesView(user, q, filterKey, filterValue) {
  if (q) {
    const text = `${user.firstName} ${user.lastName} ${user.username} ${user.email}`;
    return text.toLowerCase().includes(q.toLowerCase());
  }

  if (filterKey) {
    return String(user[filterKey]) === filterValue;
  }

  return true;
}

function UserPreview({ user }) {
  return (
    <div className="ss-preview d-flex align-items-center gap-3 text-start p-3">
      <UserAvatar user={user} size={64} />
      <div className="overflow-hidden">
        <div className="fw-bold fs-5 text-truncate">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-body-secondary text-truncate mb-1">{user.email}</div>
        <RoleBadge role={user.role} />
      </div>
    </div>
  );
}

function DashboardUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const filter = searchParams.get("filter") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [filterKey, filterValue] = filter ? filter.split(":") : ["", ""];
  const skip = (page - 1) * USERS_PAGE_SIZE;

  const { data, isLoading, error } = useFetch(
    () => getUsers({ q, filterKey, filterValue, skip }),
    [q, filter, page]
  );
  const { added, applyChanges, addItem, updateItem, removeItem, deletedCount } =
    useLocalChanges();

  const [modal, setModal] = useState({ type: null, user: null });
  const [notice, setNotice] = useState("");

  const matchingAdded = added.filter((user) =>
    matchesView(user, q, filterKey, filterValue)
  );
  const rows = [
    ...(page === 1 ? matchingAdded : []),
    ...applyChanges(data?.users || []),
  ];
  const total = data
    ? Math.max(0, data.total + matchingAdded.length - deletedCount)
    : 0;
  const totalPages = data ? Math.ceil(data.total / USERS_PAGE_SIZE) : 0;
  const from = rows.length === 0 ? 0 : skip + 1;
  const to = skip + rows.length;

  function handleSearch(event) {
    event.preventDefault();
    const term = event.currentTarget.elements.search.value.trim();
    setSearchParams(term ? { q: term } : {});
  }

  function handleFilterChange(event) {
    const value = event.target.value;
    setSearchParams(value ? { filter: value } : {});
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
    setModal({ type: null, user: null });
  }

  async function handleSave(formData) {
    if (modal.type === "edit") {
      const original = modal.user;
      let saved;

      if (original.isLocal) {
        saved = { ...original, ...formData };
      } else {
        const response = await updateUser(original.id, formData);
        saved = { ...original, ...response, ...formData, isEdited: true };
      }

      updateItem(saved);
      setNotice(`${saved.firstName} ${saved.lastName} was updated.`);
    } else {
      const response = await addUser(formData);
      addItem({ ...response, ...formData, id: Date.now() });
      setNotice(`${formData.firstName} ${formData.lastName} was created.`);
    }

    closeModal();
  }

  async function handleDelete() {
    const user = modal.user;

    if (!user.isLocal) {
      await deleteUser(user.id);
    }

    removeItem(user);
    setNotice(`${user.firstName} ${user.lastName} was deleted.`);
    closeModal();
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">User Directory</h1>
          <p className="text-body-secondary mb-1">
            Manage your store's users and their roles.
          </p>
          <small className="text-body-secondary">
            DummyJSON simulates changes, so they reset when you reload the page.
          </small>
        </div>
        <Button
          className="px-4 py-2 align-self-start"
          onClick={() => setModal({ type: "add", user: null })}
        >
          <PersonPlus className="me-2" aria-hidden="true" />
          Add New User
        </Button>
      </div>

      {notice && (
        <Alert variant="success" dismissible onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      <Card className="ss-card p-3 mb-4">
        <div className="d-flex flex-column flex-md-row gap-3">
          <Form role="search" className="ss-search flex-grow-1" onSubmit={handleSearch}>
            <Search className="ss-search-icon" aria-hidden="true" />
            <Form.Control
              key={q}
              name="search"
              type="search"
              placeholder="Search users by name, username or email..."
              aria-label="Search users"
              defaultValue={q}
            />
          </Form>
          <Form.Select
            className="ss-filter-select"
            aria-label="Filter users"
            value={filter}
            onChange={handleFilterChange}
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </div>
      </Card>

      <Card className="ss-card overflow-hidden">
        {isLoading && <Loader text="Loading users..." />}

        {error && (
          <Alert variant="danger" className="m-3">
            {error}
          </Alert>
        )}

        {!isLoading && !error && rows.length === 0 && (
          <EmptyState
            icon={People}
            title={q ? `No users match "${q}"` : "No users found"}
            message={q ? "Try a different search term." : "Try a different filter."}
          >
            <Button onClick={() => setSearchParams({})}>
              {q ? "Clear Search" : "Clear Filter"}
            </Button>
          </EmptyState>
        )}

        {!isLoading && !error && rows.length > 0 && (
          <>
            <UserTable
              users={rows}
              onView={(user) => setModal({ type: "view", user })}
              onEdit={(user) => setModal({ type: "edit", user })}
              onDelete={(user) => setModal({ type: "delete", user })}
            />
            <div className="ss-table-footer d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 px-4 py-3">
              <span className="text-body-secondary">
                Showing {from} to {to} of {total} users
              </span>
              <PaginationBar page={page} totalPages={totalPages} onChange={goToPage} />
            </div>
          </>
        )}
      </Card>

      {modal.type === "view" && (
        <UserDetailsModal user={modal.user} onHide={closeModal} />
      )}

      {(modal.type === "add" || modal.type === "edit") && (
        <UserFormModal user={modal.user} onHide={closeModal} onSave={handleSave} />
      )}

      {modal.type === "delete" && (
        <ConfirmDeleteModal
          title="Delete User Account?"
          message="This action cannot be undone. All data associated with this user will be permanently removed from the ShopStream systems."
          confirmLabel="Delete User"
          cancelLabel="Go Back"
          onHide={closeModal}
          onConfirm={handleDelete}
        >
          <UserPreview user={modal.user} />
        </ConfirmDeleteModal>
      )}
    </>
  );
}

export default DashboardUsersPage;