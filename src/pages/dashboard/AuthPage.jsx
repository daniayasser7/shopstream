import { Button, Card, Col, Row } from "react-bootstrap";
import { BoxArrowRight } from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import { getToken } from "../../api/client";
import UserInfoList from "../../components/users/UserInfoList";

function AuthPage() {
  const { user, logout } = useAuth();
  const token = getToken();

  return (
    <>
      <h1 className="fw-bold mb-1">Authentication</h1>
      <p className="text-body-secondary mb-4">
        Your current session and the signed-in account.
      </p>

      <Row className="g-4">
        <Col lg={5}>
          <Card className="ss-card p-4 h-100">
            <h2 className="h5 fw-bold mb-3">Session</h2>
            <span className="badge rounded-pill ss-badge-mint align-self-start px-3 py-2 mb-3">
              ● Signed in
            </span>

            <dl className="ss-info-list mb-4">
              <div className="ss-info-row">
                <dt>Signed in as</dt>
                <dd>@{user.username}</dd>
              </div>
              <div className="ss-info-row">
                <dt>Token stored in</dt>
                <dd>localStorage</dd>
              </div>
              <div className="ss-info-row">
                <dt>Access token</dt>
                <dd>
                  <code>{token ? `${token.slice(0, 20)}…` : "—"}</code>
                </dd>
              </div>
            </dl>

            <Button variant="danger" className="mt-auto" onClick={logout}>
              <BoxArrowRight className="me-2" aria-hidden="true" />
              Sign Out
            </Button>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="ss-card p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-3">
              <img
                src={user.image}
                alt=""
                width={56}
                height={56}
                className="rounded-circle bg-light"
              />
              <div>
                <h2 className="h5 fw-bold mb-0">
                  {user.firstName} {user.lastName}
                </h2>
                <small className="text-body-secondary">{user.email}</small>
              </div>
            </div>
            <UserInfoList user={user} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default AuthPage;