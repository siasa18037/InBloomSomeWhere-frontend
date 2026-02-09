import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthed, checking } = useAuth();
  const location = useLocation();

  // ⏳ รอ auth เช็คเสร็จก่อน
  if (checking) return null;

  // ❌ ไม่ login → ไป login
  if (!isAuthed) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
