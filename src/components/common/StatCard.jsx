import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ArrowRight } from "react-bootstrap-icons";

function StatCard({ icon: Icon, label, value, to, linkLabel, tone = "primary" }) {
  return (
    <Card className="ss-card h-100 p-4">
      <div className={`ss-stat-icon ss-stat-icon-${tone} mb-4`}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <div className="ss-stat-label">{label}</div>
      <div className="ss-stat-value">{value}</div>
      <Link
        to={to}
        className="d-inline-flex align-items-center gap-1 fw-semibold text-decoration-none mt-3"
      >
        {linkLabel} <ArrowRight aria-hidden="true" />
      </Link>
    </Card>
  );
}

export default StatCard;