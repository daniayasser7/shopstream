import { Alert, Col, Row } from "react-bootstrap";
import { Archive, People, Bag } from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import { getStoreStats } from "../../api/stats";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";

const STATS = [
  {
    key: "products",
    icon: Archive,
    label: "Total Products",
    to: "/dashboard/products",
    linkLabel: "Manage products",
    tone: "primary",
  },
  {
    key: "users",
    icon: People,
    label: "Total Users",
    to: "/dashboard/users",
    linkLabel: "Manage users",
    tone: "mint",
  },
  {
    key: "carts",
    icon: Bag,
    label: "Total Carts",
    to: "/dashboard/carts",
    linkLabel: "Manage carts",
    tone: "warning",
  },
];

function DashboardOverviewPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useFetch(getStoreStats, []);

  return (
    <>
      <title>Dashboard | ShopStream</title>

      <h1 className="fw-bold mb-1">Dashboard</h1>
      <p className="text-body-secondary mb-4">
        Welcome back, {user.firstName}. Here's an overview of your store.
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      {isLoading && <Loader text="Loading store summary..." />}

      {data && (
        <Row xs={1} md={3} className="g-4">
          {STATS.map(({ key, ...stat }) => (
            <Col key={key}>
              <StatCard {...stat} value={data[key].toLocaleString()} />
            </Col>
          ))}
        </Row>
      )}

      
    </>
  );
}

export default DashboardOverviewPage;