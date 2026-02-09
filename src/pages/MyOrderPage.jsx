import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package } from "lucide-react";
import "../styles/auth.css"; // ใช้ตัวเดียวกับ login

export default function MyOrderPage() {
  const nav = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const cleanId = orderId.trim();

    if (!cleanId) {
      setErr("กรุณากรอกหมายเลขออเดอร์");
      return;
    }

    setErr("");
    nav(`/order/${cleanId}`);
  };

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center">
      <div className="login-card shadow-lg p-4 p-md-5 rounded-5 bg-white text-center">
        
        {/* Icon */}
        <div className="icon-circle mb-4 mx-auto">
          <Package size={32} className="text-danger" />
        </div>

        {/* Title */}
        <h2 className="fw-bold mb-2">ตรวจสอบออเดอร์</h2>
        <p className="text-muted mb-4 small">
          กรอกหมายเลขออเดอร์ที่ร้านส่งให้คุณ
        </p>

        <form onSubmit={onSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label small fw-bold text-secondary">
              ORDER ID
            </label>
            <input
              type="text"
              className={`form-control form-control-lg rounded-pill px-4 ${
                err ? "is-invalid" : ""
              }`}
              placeholder="เช่น 20240201001"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            {err && (
              <div className="invalid-feedback ms-3 mt-2">
                {err}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-danger btn-lg w-100 rounded-pill py-2 shadow-sm mt-2 transition-btn d-flex align-items-center justify-content-center gap-2"
          >
            <Search size={18} />
            ค้นหาออเดอร์
          </button>
        </form>

        <div className="mt-4">
          <a
            href="/"
            className="text-decoration-none text-muted small hover-red"
          >
            ← กลับสู่หน้าหลัก
          </a>
        </div>
      </div>
    </div>
  );
}
