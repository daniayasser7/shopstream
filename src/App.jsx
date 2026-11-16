import { Routes, Route, Navigate } from "react-router-dom";
import StoreLayout from "./components/layout/StoreLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ScrollToTop from "./components/common/ScrollToTop";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProductsPage from "./pages/store/ProductsPage";
import ProductDetailsPage from "./pages/store/ProductDetailsPage";
import CategoriesPage from "./pages/store/CategoriesPage";
import CartPage from "./pages/store/CartPage";
import ProfilePage from "./pages/store/ProfilePage";
import DashboardOverviewPage from "./pages/dashboard/DashboardOverviewPage";
import DashboardProductsPage from "./pages/dashboard/DashboardProductsPage";
import DashboardCartsPage from "./pages/dashboard/DashboardCartsPage";
import DashboardUsersPage from "./pages/dashboard/DashboardUsersPage";
import AuthPage from "./pages/dashboard/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminRoute from "./routes/AdminRoute";
import AccessDeniedPage from "./pages/AccessDeniedPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />

        <Route element={<StoreLayout />}>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="products" element={<DashboardProductsPage />} />
            <Route path="carts" element={<DashboardCartsPage />} />
            <Route path="users" element={<DashboardUsersPage />} />
            <Route path="auth" element={<AuthPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;