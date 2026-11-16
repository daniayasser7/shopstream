import { useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { At, Envelope, PersonPlus, PersonGear } from "react-bootstrap-icons";
import FormField from "../common/FormField";
import PasswordField from "../common/PasswordField";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "moderator", label: "Moderator" },
  { value: "admin", label: "Admin" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toFormValues(user) {
  if (!user) {
    return { fullName: "", username: "", email: "", role: "user", password: "" };
  }

  return {
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    username: user.username || "",
    email: user.email || "",
    role: user.role || "user",
    password: "",
  };
}

function validateUser(values, isEdit) {
  const errors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Please enter the full name.";
  }

  if (!values.username.trim()) {
    errors.username = "Please enter a username.";
  } else if (/\s/.test(values.username)) {
    errors.username = "Username can't contain spaces.";
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!isEdit && values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

function UserFormModal({ user, onHide, onSave }) {
  const isEdit = Boolean(user);
  const [values, setValues] = useState(() => toFormValues(user));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validateUser(values, isEdit);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);
    setServerError("");

    const [firstName, ...rest] = values.fullName.trim().split(/\s+/);
    const data = {
      firstName,
      lastName: rest.join(" "),
      username: values.username.trim(),
      email: values.email.trim(),
      role: values.role,
    };

    if (!isEdit) {
      data.password = values.password;
    }

    try {
      await onSave(data);
    } catch (error) {
      setServerError(error.message);
      setIsSaving(false);
    }
  }

  const HeaderIcon = isEdit ? PersonGear : PersonPlus;

  return (
    <Modal
      show
      onHide={onHide}
      centered
      size="lg"
      contentClassName="ss-modal"
      aria-labelledby="user-form-title"
    >
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Header closeButton className="px-4 py-3">
          <div className="d-flex align-items-center gap-3">
            <div className="ss-modal-icon">
              <HeaderIcon size={20} aria-hidden="true" />
            </div>
            <div>
              <Modal.Title id="user-form-title" className="fw-bold">
                {isEdit ? "Edit User" : "Add New User"}
              </Modal.Title>
              <div className="small text-body-secondary">
                {isEdit
                  ? `Update ${user.firstName}'s profile details`
                  : "Create a new account for your store."}
              </div>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="p-4">
          {serverError && <Alert variant="danger">{serverError}</Alert>}

          <Row>
            <Col md={6}>
              <FormField
                id="fullName"
                name="fullName"
                label="Full Name"
                placeholder="Johnathan Doe"
                value={values.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
            </Col>
            <Col md={6}>
              <FormField
                id="username"
                name="username"
                label="Username"
                icon={At}
                placeholder="johndoe"
                value={values.username}
                onChange={handleChange}
                error={errors.username}
              />
            </Col>

            <Col xs={12}>
              <FormField
                id="email"
                name="email"
                type="email"
                label="Email Address"
                icon={Envelope}
                placeholder="john@shopstream.com"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
              />
            </Col>

            <Col md={isEdit ? 12 : 6}>
              <Form.Group className="mb-3" controlId="role">
                <Form.Label className="fw-semibold">Role</Form.Label>
                <Form.Select
                  name="role"
                  className="ss-select"
                  value={values.role}
                  onChange={handleChange}
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {!isEdit && (
              <Col md={6}>
                <PasswordField
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                />
              </Col>
            )}
          </Row>
        </Modal.Body>

        <Modal.Footer className="ss-modal-footer px-4 py-3">
          <Button variant="outline-secondary" onClick={onHide} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <HeaderIcon className="me-2" aria-hidden="true" />
                {isEdit ? "Update User" : "Create User"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UserFormModal;