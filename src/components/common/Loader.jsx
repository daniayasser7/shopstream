import { Spinner } from "react-bootstrap";

function Loader({ text = "Loading..." }) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center gap-3 py-5"
      role="status"
    >
      <Spinner animation="border" variant="primary" />
      <span className="text-body-secondary">{text}</span>
    </div>
  );
}

export default Loader;