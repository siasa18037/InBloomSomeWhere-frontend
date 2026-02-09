import "../styles/home.css";

export default function Hero() {
  return (
    <section className="hero-section d-flex align-items-center min-vh-100">
      <div className="container">
        <div className="row align-items-center">
          
          {/* ฝั่งซ้าย: เนื้อหาข้อความ */}
          <div className="col-md-7 col-lg-6 text-start">
            <h1 className="hero-title display-3 fw-bold mb-3 text-dark">
              <span className="text-danger">BLOOMING</span> <br />
              WITH LOVE
            </h1>
            
            <p className="hero-desc fs-6 mb-4 text-secondary">
              คัดสรรความสดใหม่ เพื่อมอบรอยยิ้มทุกช่วงเวลาสำคัญของคุณ
            </p>

            {/* ปุ่มกดสไตล์ Bootstrap */}
            <div className="d-flex gap-3 mt-4">
              <a href="#products" className="btn btn-danger px-4 py-2 rounded-pill shadow">
                SEE PRODUCTS
              </a>
              
              <a 
                href="https://www.instagram.com/inbloomsomewhere" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline-danger px-4 py-2 rounded-pill"
              >
                CONTACT US
              </a>
            </div>
          </div>

          {/* ฝั่งขวา: ปล่อยว่างไว้โชว์ลายดอกไม้ของรูปพื้นหลัง */}
          <div className="col-md-5 col-lg-6"></div>

        </div>
      </div>
    </section>
  );
}