import { Button, Table } from "react-bootstrap";
import { Eye, PencilSquare, Trash3 } from "react-bootstrap-icons";
import UserAvatar from "./UserAvatar";
import RoleBadge from "./RoleBadge";

function UserTable({ users, onView, onEdit, onDelete }) {
  return (
    <Table responsive hover className="ss-table align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">Email Address</th>
          <th scope="col">Role</th>
          <th scope="col">Phone</th>
          <th scope="col" className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          const fullName = `${user.firstName} ${user.lastName}`;

          return (
            <tr key={user.id}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <UserAvatar user={user} size={44} />
                  <div>
                    <div className="fw-semibold">{fullName}</div>
                    <small className="text-body-secondary">@{user.username}</small>
                  </div>
                </div>
              </td>
              <td>{user.email}</td>
              <td>
                <RoleBadge role={user.role} />
              </td>
              <td className="text-nowrap">{user.phone || "—"}</td>
              <td className="text-end text-nowrap">
                <Button
                  variant="link"
                  className="ss-icon-btn text-body"
                  onClick={() => onView(user)}
                  aria-label={`View ${fullName}`}
                >
                  <Eye size={18} />
                </Button>
                <Button
                  variant="link"
                  className="ss-icon-btn text-primary"
                  onClick={() => onEdit(user)}
                  aria-label={`Edit ${fullName}`}
                >
                  <PencilSquare size={18} />
                </Button>
                <Button
                  variant="link"
                  className="ss-icon-btn text-danger"
                  onClick={() => onDelete(user)}
                  aria-label={`Delete ${fullName}`}
                >
                  <Trash3 size={18} />
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default UserTable;