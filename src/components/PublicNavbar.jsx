import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { Menu, X } from "lucide-react";

export default function PublicNavbar() {
  const { isAuthed, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  /* ===== click outside to close ===== */
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

  return (
    <nav
      ref={navRef}
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top"
    >
      <div className="container py-2">
        {/* ===== Logo ===== */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
          style={{ color: "#000000" }}
          onClick={() => setIsOpen(false)}
        >
          <img
            src="/logo.png"
            alt="InBloomSomeWhere Logo"
            height="30"
            className="d-inline-block align-top"
          />
          InBloomSomeWhere
        </Link>

        {/* ===== Hamburger ===== */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X size={28} strokeWidth={2} color="#d63384" />
          ) : (
            <Menu size={28} strokeWidth={2} color="#333" />
          )}
        </button>

        {/* ===== Menu ===== */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto gap-lg-4 mt-3 mt-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/products" onClick={() => setIsOpen(false)}>
                Flowers
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/my-order" onClick={() => setIsOpen(false)}>
                MyOrder
              </Link>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="https://www.instagram.com/inbloomsomewhere"
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
