import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import { Envelope, ArrowRight } from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import FormField from "../../components/common/FormField";
import PasswordField from "../../components/common/PasswordField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEMO_ACCOUNTS = [
  { label: "Admin", username: "emilys", password: "emilyspass" },
  { label: "User", username: "averyp", password: "averyppass" },
];

function validateLogin(values) {
  const errors = {};
  const identifier = values.identifier.trim();

  if (!identifier) {
    errors.identifier = "Please enter your email or username.";
  } else if (identifier.includes("@") && !EMAIL_PATTERN.test(identifier)) {
    errors.identifier = "Please enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Please enter your password.";
  }

  return errors;
}

function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [values, setValues] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/profile";

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validateLogin(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await login(values.identifier.trim(), values.password);
    } catch (error) {
      setServerError(error.message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="ss-auth-page py-5 px-3">
      <Card className="ss-card ss-auth-card mx-auto">
        <h1 className="fw-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-body-secondary mb-4">
          Please enter your details to sign in.
        </p>

        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form noValidate onSubmit={handleSubmit}>
          <FormField
            id="identifier"
            name="identifier"
            label="Email or Username"
            icon={Envelope}
            placeholder="name@example.com"
            autoComplete="username"
            value={values.identifier}
            onChange={handleChange}
            error={errors.identifier}
          />

          <PasswordField
            id="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button type="submit" size="lg" className="w-100 mt-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="ms-1" />
              </>
            )}
          </Button>
        </Form>

                <div className="ss-demo-accounts mt-4">
          <div className="small fw-semibold text-body-secondary text-center mb-2">
            Demo accounts
          </div>
          {DEMO_ACCOUNTS.map((account) => (
            <div
              key={account.label}
              className="d-flex justify-content-between gap-3 small py-1"
            >
              <span className="text-body-secondary">{account.label}</span>
              <span>
                <strong>{account.username}</strong> / <strong>{account.password}</strong>
              </span>
            </div>
          ))}
        </div>

        <p className="text-center mt-4 mb-0">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </Card>
    </div>
  );
}

export default LoginPage;