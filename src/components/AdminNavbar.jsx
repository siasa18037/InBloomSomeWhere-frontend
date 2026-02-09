import { useState, useRef, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ClipboardList,
  Menu,
  X,
  QrCode
} from "lucide-react";
import "../styles/admin.css";
import AdminQrScanner from "../components/AdminQrScanner";


export default function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const [scanOpen, setScanOpen] = useState(false);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
    <nav
      ref={navRef}
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top"
    >

      <div className="container py-1">

        {/* ===== Logo ===== */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/admin"
        >
          <div className="bg-danger rounded-3 p-1 d-flex align-items-center justify-content-center">
            <LayoutDashboard size={20} color="white" />
          </div>
          <span className="text-dark">
            InBloomSomeWhere
            <span className="text-danger">Admin</span>
          </span>
        </Link>

        {/* ===== Hamburger (Mobile) ===== */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X size={28} color="#dc3545" />
          ) : (
            <Menu size={28} color="#333" />
          )}
        </button>

        {/* ===== Menu ===== */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mt-3 mt-lg-0 gap-2">

            <li className="nav-item">
              <Link
                to="/admin/orders"
                className="nav-link d-flex align-items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <ClipboardList size={18} />
                รายการออเดอร์
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/create"
                className="nav-link d-flex align-items-center gap-2 text-danger fw-bold"
                onClick={() => setIsOpen(false)}
              >
                <PlusCircle size={18} />
                สร้างออเดอร์
              </Link>
            </li>

            <li className="nav-item">
              <button
                className="nav-link d-flex align-items-center gap-2"
                onClick={() => {
                  setIsOpen(false);
                  setScanOpen(true);
                }}
              >
                <QrCode size={18} />
                สแกน QR
              </button>
            </li>


            <li className="nav-item d-lg-none">
              <hr className="my-2" />
            </li>

            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-danger d-flex align-items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                ออกจากระบบ
              </button>
            </li>

           


          </ul>
        </div>
      </div>
    </nav>
     {scanOpen && (
      <AdminQrScanner
        onClose={() => setScanOpen(false)}
        onResult={(text) => {
          setScanOpen(false);

          const id = text.includes("/order/")
            ? text.split("/order/").pop()
            : text;

          navigate(`/admin/order/${id}`);
        }}
      />
    )}
    </>
  );
}
