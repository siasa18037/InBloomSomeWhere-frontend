import { useEffect, useState } from "react";
import { apiGetProducts } from "../api/client.js";
import Loading from "../components/Loading.jsx";
import ProductImage from "../components/ProductImage.jsx";
import { ShoppingCart } from "lucide-react"; // แถมไอคอนตะกร้าให้ด้วย
import "../styles/product.css";

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiGetProducts()
      .then((r) => setItems(r.data || []))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  console.log(items);

  if (loading) return <Loading text="กำลังโหลดสินค้า..." />;
  if (err) return <div className="alert alert-danger m-5">{err}</div>;

  return (
    <div className="container py-5" style={{marginTop:'60px'}}>
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold mb-2" style={{ color: '#333' }}>
          <span className="text-danger">OUR</span> COLLECTION
        </h2>
        <p className="text-muted">คัดสรรดอกไม้ที่สวยที่สุด เพื่อส่งมอบความรู้สึกดีๆ ให้แก่กัน</p>
        <div className="mx-auto mt-2" style={{ width: '60px', height: '3px', backgroundColor: '#e63946' }}></div>
      </div>

      <div className="row g-4">
        {items.map((p) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={p.ID}>
            <div className="card product-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="product-img-wrapper overflow-hidden">
                <ProductImage 
                  src={p.img} 
                  alt={p["ชื่อสินค้า"]} 
                  className="card-img-top"
                />
              </div>

              <div className="card-body d-flex flex-column text-center">
                <h6 className="card-title fw-bold mb-1">{p["ชื่อสินค้า"]}</h6>
                {/* <p className="card-text small text-muted mb-3">
                  {p["ดอกไม้"]}
                </p> */}

                <div className="mt-auto">
                  <div className="fw-bold fs-5 text-danger mb-3">
                    ฿{Number(p["ราคาขาย"]).toLocaleString()}
                  </div>
                  <button 
                        onClick={() => window.open("https://www.instagram.com/inbloomsomewhere", "_blank")}
                        className="btn btn-outline-danger w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 main-btn"
                        >
                        <ShoppingCart size={18} />
                        <span>สั่งซื้อเลย</span>
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}