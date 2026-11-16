import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { Person, At, Envelope, ShieldCheck, ArrowRight } from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import { registerUser } from "../../api/auth";
import FormField from "../../components/common/FormField";
import PasswordField from "../../components/common/PasswordField";

const INITIAL_VALUES = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(values) {
  const errors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!values.username.trim()) {
    errors.username = "Please choose a username.";
  } else if (/\s/.test(values.username)) {
    errors.username = "Username can't contain spaces.";
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function RegisterPage() {
  const { user } = useAuth();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validateRegister(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError("");

    const [firstName, ...rest] = values.fullName.trim().split(/\s+/);

    try {
      const newUser = await registerUser({
        firstName,
        lastName: rest.join(" "),
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      setCreatedUser(newUser);
      setValues(INITIAL_VALUES);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="ss-auth-page py-5 px-3">
      <Card className="ss-card ss-auth-card mx-auto" style={{ maxWidth: 560 }}>
        <h1 className="fw-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-body-secondary mb-4">
          Join ShopStream for a personalized shopping experience.
        </p>

        {createdUser ? (
          <Alert variant="success" className="mb-0">
            <Alert.Heading as="h2" className="h5">
              Account created for @{createdUser.username}
            </Alert.Heading>
            <p>
              DummyJSON is a demo API: it confirms the registration (user id{" "}
              {createdUser.id}) but does not save new users, so this account can't
              sign in. Use the demo account <strong>emilys</strong> /{" "}
              <strong>emilyspass</strong> instead.
            </p>
            <Button as={Link} to="/login" variant="success">
              Go to Sign In
            </Button>
          </Alert>
        ) : (
          <>
            {serverError && <Alert variant="danger">{serverError}</Alert>}

            <Form noValidate onSubmit={handleSubmit}>
              <FormField
                id="fullName"
                name="fullName"
                label="Full Name"
                icon={Person}
                placeholder="John Doe"
                autoComplete="name"
                value={values.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />

              <Row>
                <Col md={6}>
                  <FormField
                    id="username"
                    name="username"
                    label="Username"
                    icon={At}
                    placeholder="johndoe"
                    autoComplete="username"
                    value={values.username}
                    onChange={handleChange}
                    error={errors.username}
                  />
                </Col>
                <Col md={6}>
                  <FormField
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    icon={Envelope}
                    placeholder="john@example.com"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </Col>
              </Row>

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

              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                icon={ShieldCheck}
                placeholder="Repeat your password"
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              <Button type="submit" size="lg" className="w-100 mt-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up <ArrowRight className="ms-1" />
                  </>
                )}
              </Button>
            </Form>
          </>
        )}

        <p className="text-center mt-4 mb-0">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </Card>
    </div>
  );
}

export default RegisterPage;