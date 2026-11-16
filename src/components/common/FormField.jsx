import { Form } from "react-bootstrap";

function FormField({ id, label, icon: Icon, error, children, ...inputProps }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label className="fw-semibold">{label}</Form.Label>
      <div className="ss-field">
        {Icon && <Icon className="ss-field-icon" aria-hidden="true" />}
        <Form.Control
          className={Icon ? "has-icon" : ""}
          isInvalid={Boolean(error)}
          {...inputProps}
        />
        {children}
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </div>
    </Form.Group>
  );
}

export default FormField;