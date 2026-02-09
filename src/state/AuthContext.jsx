import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiCheckAuth } from "../api/client.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("AUTH_TOKEN") || "");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verifyOnce() {
      if (!token) {
        setChecking(false);
        return;
      }

      if (sessionStorage.getItem("AUTH_CHECKED") === "1") {
        setChecking(false);
        return;
      }

      try {
        await apiCheckAuth(token);
        sessionStorage.setItem("AUTH_CHECKED", "1");
      } catch {
        localStorage.removeItem("AUTH_TOKEN");
        sessionStorage.removeItem("AUTH_CHECKED");
        setToken("");
      } finally {
        setChecking(false);
      }
    }

    verifyOnce();
  }, [token]);

  const login = (t) => {
    setToken(t);
    localStorage.setItem("AUTH_TOKEN", t);
    sessionStorage.removeItem("AUTH_CHECKED");
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("AUTH_TOKEN");
    sessionStorage.removeItem("AUTH_CHECKED");
  };

  const value = useMemo(
    () => ({
      token,
      isAuthed: !!token,
      checking,        // ✅ export ออกไป
      login,
      logout
    }),
    [token, checking]
  );


return (
    <AuthCtx.Provider value={value}>
      {checking ? (
        // ใช้ Loading Component สวยๆ ที่เราทำไว้ก่อนหน้านี้ได้เลย
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
          <div className="spinner-border text-danger mb-3" role="status" />
          <div className="text-muted">กำลังตรวจสอบสิทธิ์...</div>
        </div>
      ) : (
        children
      )}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}