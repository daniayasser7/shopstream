import { Card, Col, Container, Nav, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PersonFill, BoxArrowRight } from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import UserInfoList from "../../components/users/UserInfoList";

function ProfilePage() {
  const { user, logout } = useAuth();
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Container fluid="xxl" className="py-4 py-lg-5">
      <Row className="g-4">
        <Col lg={3}>
          <Card className="ss-card p-3">
            <div className="px-2 pb-3 mb-2 border-bottom">
              <div className="fw-bold text-primary fs-5">Account</div>
              <small className="text-body-secondary">Manage your settings</small>
            </div>

            <Nav className="ss-account-nav flex-column gap-1">
              <Nav.Link as={NavLink} to="/profile">
                <PersonFill size={18} aria-hidden="true" />
                My Profile
              </Nav.Link>
              <hr className="my-2" />
              <button type="button" className="nav-link ss-signout" onClick={logout}>
                <BoxArrowRight size={18} aria-hidden="true" />
                Sign Out
              </button>
            </Nav>
          </Card>
        </Col>

        <Col lg={9}>
          <Card className="ss-card p-4 mb-4">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 text-center text-sm-start">
              <img
                src={user.image}
                alt={fullName}
                className="ss-avatar-lg"
              />
              <div>
                <h1 className="fw-bold mb-1">{fullName}</h1>
                <p className="text-body-secondary mb-3">{user.email}</p>
                <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-start">
                  <span className="badge rounded-pill ss-badge-mint text-capitalize px-3 py-2">
                    {user.role}
                  </span>
                  <span className="badge rounded-pill ss-badge-soft px-3 py-2">
                    @{user.username}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="ss-card p-4">
            <h2 className="h5 fw-bold mb-3">Personal Information</h2>
            <UserInfoList user={user} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;