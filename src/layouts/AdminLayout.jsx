import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar.jsx";

export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <div className="container my-4">
        <Outlet />
      </div>
    </>
  );
}
