import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-top py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          
          {/* ส่วนที่ 1: ชื่อร้านและสโลแกน */}
          <div className="col-lg-4 col-md-6">
             <Link className="navbar-brand d-flex align-items-center gap-2 fs-5" to="/" style={{ color: '#000000' }}>
              <img 
                  src="/logo.png"  /* ใส่ Path รูปโลโก้ของคุณ */
                  alt="InBloomSomeWhere Logo"
                  height="30"      /* ปรับความสูงตามความเหมาะสม */
                  className="d-inline-block align-top"
                />
                InBloomSomeWhere
              </Link>
            <p className="text-muted mt-3">
              ร้านดอกไม้ที่เชื่อว่า "ความรู้สึกดีๆ ส่งต่อกันได้ผ่านดอกไม้" 
              เราคัดสรรดอกไม้ที่สดที่สุด เพื่อช่วงเวลาที่พิเศษที่สุดของคุณ
            </p>
          </div>

          {/* ส่วนที่ 2: ลิงก์ด่วน */}
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-muted hover-red">Home</Link></li>
              <li><Link to="/products" className="text-decoration-none text-muted hover-red">Our Flowers</Link></li>
              <li><Link to="/my-orders" className="text-decoration-none text-muted hover-red">Track Order</Link></li>
               <li><Link to="/login" className="text-decoration-none text-muted hover-red">Login</Link></li>
            </ul>
          </div>

          {/* ส่วนที่ 3: ช่องทางติดต่อ */}
          <div className="col-lg-4 col-md-12">
            <h5 className="fw-bold mb-3">Follow Us</h5>
            <p className="text-muted small mb-3">ติดตามข่าวสารและคอลเลกชันใหม่ๆ ได้ที่นี่</p>
            <div className="d-flex gap-3">
              <a href="https://instagram.com/inbloomsomewhere" target="_blank" rel="noreferrer" className="social-icon">
                <Instagram size={24} />
              </a>
              {/* <a href="#" className="social-icon">
                <Facebook size={24} />
              </a>
              <a href="https://line.me/ti/p/@yourid" target="_blank" rel="noreferrer" className="social-icon">
                <MessageCircle size={24} />
              </a> */}
            </div>
          </div>

        </div>

        <hr className="my-4 text-muted opacity-25" />

        <div className="text-center text-muted small">
          <p className="mb-0">
            © {currentYear} InBloomSomeWhere. All rights reserved.
          </p>
          <p className="mb-0">
            Made with <Heart size={14} className="text-danger mb-1" /> by Siasa Group
          </p>
        </div>
      </div>
    </footer>
  );
}