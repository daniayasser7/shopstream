import { Alert, Modal } from "react-bootstrap";
import useFetch from "../../hooks/useFetch";
import { getUser } from "../../api/users";
import UserAvatar from "./UserAvatar";
import RoleBadge from "./RoleBadge";
import UserInfoList from "./UserInfoList";
import Loader from "../common/Loader";

function UserDetailsModal({ user, onHide }) {
  const needsFetch = !user.isLocal && !user.isEdited;
  const { data, isLoading, error } = useFetch(
    () => (needsFetch ? getUser(user.id) : Promise.resolve(user)),
    [user.id, needsFetch]
  );

  return (
    <Modal
      show
      onHide={onHide}
      centered
      size="lg"
      contentClassName="ss-modal"
      aria-labelledby="user-details-title"
    >
      <Modal.Header closeButton className="px-4 py-3">
        <Modal.Title id="user-details-title" className="fw-bold">
          User Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {isLoading && <Loader text="Loading user..." />}

        {error && <Alert variant="danger">{error}</Alert>}

        {data && (
          <>
            <div className="d-flex flex-column flex-sm-row align-items-center gap-3 mb-4 text-center text-sm-start">
              <UserAvatar user={data} size={80} />
              <div>
                <h2 className="h4 fw-bold mb-1">
                  {data.firstName} {data.lastName}
                </h2>
                <div className="text-body-secondary mb-2">{data.email}</div>
                <RoleBadge role={data.role} />
              </div>
            </div>
            <UserInfoList user={data} />
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default UserDetailsModal;