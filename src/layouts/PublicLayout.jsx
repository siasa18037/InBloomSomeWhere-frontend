import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar.jsx";

import Footer from "../components/Footer.jsx";

export default function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <Outlet />
      <Footer />
    </>
  );
}
