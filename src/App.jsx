import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import PublicOrderPage from "./pages/PublicOrderPage.jsx";
import MyOrderPage from "./pages/MyOrderPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

import AdminOrdersPage from "./pages/admin/AdminOrdersPage.jsx";
import AdminCreateOrderPage from "./pages/admin/AdminCreateOrderPage.jsx";
import AdminEditOrderPage from "./pages/admin/AdminEditOrderPage.jsx";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage.jsx";
import AdminPage from "./pages/admin/AdminPage.jsx";


import ProtectedRoute from "./components/ProtectedRoute.jsx";


export default function App() {
  return (
    <Routes>
      {/* ===== PUBLIC ===== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/my-order" element={<MyOrderPage />} />
        <Route path="/order/:id" element={<PublicOrderPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* ===== ADMIN ===== */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/create" element={<AdminCreateOrderPage />} />
        <Route path="/admin/order/:id" element={<AdminOrderDetailPage />} />
        <Route path="/admin/edit/:id" element={<AdminEditOrderPage />} />
      </Route>

    </Routes>
  );
}
