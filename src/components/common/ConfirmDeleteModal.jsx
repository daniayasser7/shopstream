import { useState } from "react";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import { ExclamationTriangle, Trash3 } from "react-bootstrap-icons";

function ConfirmDeleteModal({
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel and Go Back",
  onConfirm,
  onHide,
  children,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setIsDeleting(true);
    setError("");

    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      show
      onHide={onHide}
      centered
      contentClassName="ss-modal"
      aria-labelledby="confirm-delete-title"
    >
      <Modal.Body className="p-4 p-sm-5 text-center">
        <div className="ss-danger-icon mx-auto mb-3">
          <ExclamationTriangle size={28} aria-hidden="true" />
        </div>
        <h2 id="confirm-delete-title" className="h3 fw-bold mb-2">
          {title}
        </h2>
        <p className="text-body-secondary mb-4">{message}</p>

        {children}

        {error && (
          <Alert variant="danger" className="mt-3 mb-0 text-start">
            {error}
          </Alert>
        )}

        <div className="d-flex flex-column-reverse flex-sm-row gap-3 mt-4">
          <Button
            variant="outline-primary"
            className="flex-fill py-2"
            onClick={onHide}
            disabled={isDeleting}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            className="flex-fill py-2"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <Trash3 className="me-2" aria-hidden="true" />
            )}
            {confirmLabel}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmDeleteModal;