import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";
import { canAccessDashboard } from "../utils/permissions";

function AdminRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader text="Checking your session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!canAccessDashboard(user)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;