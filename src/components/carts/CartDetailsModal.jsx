import { Alert, Modal, Table } from "react-bootstrap";
import useFetch from "../../hooks/useFetch";
import { getCart } from "../../api/carts";
import UserAvatar from "../users/UserAvatar";
import ProductThumb from "../products/ProductThumb";
import CartSummary from "./CartSummary";
import Loader from "../common/Loader";
import { formatPrice } from "../../utils/format";

function CartDetailsModal({ cart, user, onHide }) {
  const needsFetch = !cart.isLocal && !cart.isEdited;
  const { data, isLoading, error } = useFetch(
    () => (needsFetch ? getCart(cart.id) : Promise.resolve(cart)),
    [cart.id, needsFetch]
  );

  return (
    <Modal
      show
      onHide={onHide}
      centered
      size="lg"
      contentClassName="ss-modal"
      aria-labelledby="cart-details-title"
    >
      <Modal.Header closeButton className="px-4 py-3">
        <Modal.Title id="cart-details-title" className="fw-bold">
          {cart.isLocal ? "New Cart" : `Cart #${cart.id}`}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <UserAvatar user={user} size={48} />
          <div>
            <div className="fw-semibold">
              {user ? `${user.firstName} ${user.lastName}` : `User #${cart.userId}`}
            </div>
            {user && <small className="text-body-secondary">{user.email}</small>}
          </div>
        </div>

        {isLoading && <Loader text="Loading cart..." />}

        {error && <Alert variant="danger">{error}</Alert>}

        {data && (
          <>
            <Table responsive className="ss-table align-middle mb-4">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col" className="text-center">Qty</th>
                  <th scope="col" className="text-end">Price</th>
                  <th scope="col" className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <ProductThumb src={item.thumbnail} size={44} />
                        <span className="fw-semibold">{item.title}</span>
                      </div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end text-nowrap">{formatPrice(item.price)}</td>
                    <td className="text-end fw-semibold text-nowrap">
                      {formatPrice(item.discountedTotal ?? item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="ms-auto" style={{ maxWidth: 360 }}>
              <CartSummary cart={data} />
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default CartDetailsModal;