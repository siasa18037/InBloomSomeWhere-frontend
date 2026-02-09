import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { LockKeyhole, Loader2 } from "lucide-react"; // เพิ่ม Loader2 สำหรับตอนรอ
import { apiCheckAuth } from "../api/client.js"; // อย่าลืมสร้าง/เช็คฟังก์ชันนี้ใน api/client.js
import "../styles/auth.css";
import { useLocation } from "react-router-dom";

export default function LoginPage() {
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // สถานะตอนกำลังโหลด
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  const onSubmit = async (e) => {
    e.preventDefault();
    const cleanKey = key.trim();
    
    if (!cleanKey) return setErr("กรุณากรอกรหัสเข้าใช้งาน");

    setErr("");
    setIsSubmitting(true);

    try {
      // เรียก API ไปที่ resource=auth&action=check
      const res = await apiCheckAuth(cleanKey);

      if (res.success) {
        login(cleanKey);
        nav(from, { replace: true });
      } else {
        setErr("รหัสเข้าใช้งานไม่ถูกต้อง");
      }
    } catch (error) {
      setErr("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center">
      <div className="login-card shadow-lg p-4 p-md-5 rounded-5 bg-white text-center">
        <div className="icon-circle mb-4 mx-auto">
          <LockKeyhole size={32} className="text-danger" />
        </div>

        <h2 className="fw-bold mb-2">Admin Access</h2>
        <p className="text-muted mb-4 small">ระบบจัดการหลังบ้าน InBloomSomewhere</p>

        <form onSubmit={onSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label small fw-bold text-secondary">AUTH KEY</label>
            <input 
              type="password"
              className={`form-control form-control-lg rounded-pill px-4 ${err ? 'is-invalid' : ''}`}
              value={key} 
              onChange={(e) => setKey(e.target.value)} 
              placeholder="••••••••••••"
              disabled={isSubmitting} // ปิดช่องตอนโหลด
            />
            {err && <div className="invalid-feedback ms-3 mt-2">{err}</div>}
          </div>

         <button 
            type="submit" 
            className="btn btn-danger btn-lg w-100 rounded-pill py-2 shadow-sm mt-2 transition-btn d-flex align-items-center justify-content-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                {/* ใช้ Spinner ของ Bootstrap */}
                <span 
                  className="spinner-border spinner-border-sm" 
                  role="status" 
                  aria-hidden="true"
                ></span>
                <span>กำลังตรวจสอบ...</span>
              </>
            ) : (
              "เข้าใช้งาน"
            )}
          </button>
        </form>

        <div className="mt-4">
            <a href="/" className="text-decoration-none text-muted small hover-red">
                ← กลับสู่หน้าหลัก
            </a>
        </div>
      </div>
    </div>
  );
}