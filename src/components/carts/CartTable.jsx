import { Button, Table } from "react-bootstrap";
import { Eye, PencilSquare, Trash3 } from "react-bootstrap-icons";
import UserAvatar from "../users/UserAvatar";
import { formatPrice } from "../../utils/format";

function CartTable({ carts, usersById, onView, onEdit, onDelete }) {
  return (
    <Table responsive hover className="ss-table align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">Cart ID</th>
          <th scope="col">User</th>
          <th scope="col">Total Items</th>
          <th scope="col" className="text-end">Total Price</th>
          <th scope="col" className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {carts.map((cart) => {
          const user = usersById[cart.userId];
          const label = cart.isLocal ? "new cart" : `cart #${cart.id}`;

          return (
            <tr key={cart.id}>
              <td className="fw-bold text-primary text-nowrap">
                {cart.isLocal ? "New" : `#${cart.id}`}
              </td>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <UserAvatar user={user} />
                  <div>
                    <div className="fw-semibold">
                      {user ? `${user.firstName} ${user.lastName}` : `User #${cart.userId}`}
                    </div>
                    {user && (
                      <small className="text-body-secondary">{user.email}</small>
                    )}
                  </div>
                </div>
              </td>
              <td className="text-nowrap">
                {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
              </td>
              <td className="text-end fw-bold text-nowrap">
                {formatPrice(cart.discountedTotal)}
              </td>
              <td className="text-end text-nowrap">
                <Button
                  variant="link"
                  className="ss-icon-btn text-body"
                  onClick={() => onView(cart)}
                  aria-label={`View ${label}`}
                >
                  <Eye size={18} />
                </Button>
                <Button
                  variant="link"
                  className="ss-icon-btn text-primary"
                  onClick={() => onEdit(cart)}
                  aria-label={`Edit ${label}`}
                >
                  <PencilSquare size={18} />
                </Button>
                <Button
                  variant="link"
                  className="ss-icon-btn text-danger"
                  onClick={() => onDelete(cart)}
                  aria-label={`Delete ${label}`}
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

export default CartTable;