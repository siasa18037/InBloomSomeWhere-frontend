import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../state/AuthContext.jsx";
import { apiGetAllOrders, apiGetProducts } from "../../api/client.js";
import { fromSheetToForm } from "../../utils/orderMapper.js";
import { QRCodeCanvas } from "qrcode.react";
import Loading from "../../components/Loading";

export default function AdminPrintPage() {
  const { token } = useAuth();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึง Domain ปัจจุบันอัตโนมัติ (เช่น https://yourstore.com)
  const domain = window.location.origin;

  const params = new URLSearchParams(location.search);
  const ids = params.get("ids")?.split(",") || [];

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [orderRes, productRes] = await Promise.all([
        apiGetAllOrders(token),
        apiGetProducts()
      ]);
      const mappedOrders = (orderRes.data || []).map(fromSheetToForm);
      const selectedOrders = mappedOrders.filter(o => ids.includes(o.orderId));
      setOrders(selectedOrders);
      setProducts(productRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const findProduct = (code) => products.find(p => String(p.ID) === String(code));

  if (loading) {
    return <Loading text="กำลังเตรียมหน้าสำหรับพิมพ์..." />;
  }

  return (
    <div className="container-fluid py-2" style={{ maxWidth: "950px" }}>
      {/* ACTION BAR */}
      <div className="d-flex justify-content-between align-items-center mb-3 no-print border-bottom pb-2">
        <h6 className="mb-0 fw-bold">ใบเตรียมสินค้า ({orders.length} รายการ)</h6>
        <button className="btn btn-dark rounded-pill px-4" onClick={() => window.print()}>
          🖨 พิมพ์ออกกระดาษ
        </button>
      </div>

      <div className="row gx-1 gy-1">
        {orders.map(order => {
          const product = findProduct(order.productCode);
          // สร้าง URL สำหรับ QR Code
          const qrUrl = `${domain}/order/${order.orderId}`;

          return (
            <div key={order.orderId} className="col-6 col-print-6">
              <div className="print-card border p-2 bg-white">
                
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-1 border-bottom pb-1">
                  <div className="text-truncate" style={{ maxWidth: '70%' }}>
                    <span className="fw-bold text-dark" style={{ fontSize: '11px' }}>#{order.orderId}</span>
                    <span className="ms-1 fw-bold text-danger" style={{ fontSize: '9px' }}>
                      [{order.receiveMethod}]
                    </span>
                  </div>
                  <span className="text-muted text-nowrap" style={{ fontSize: '9px' }}>
                    {order.deliveryDate} {order.deliveryTime}
                  </span>
                </div>

                <div className="d-flex" style={{ flex: 1 }}>
                  
                  {/* LEFT CONTENT (65%) */}
                  <div style={{ width: '65%', paddingRight: '6px', borderRight: '0.5px dashed #eee' }}>
                    <div className="lh-sm mb-1">
                      <strong style={{ fontSize: '11px' }}>{order.customerName}</strong>
                      {order.channel && (
                        <span className="ms-1 text-primary fw-bold" style={{ fontSize: '9px' }}>
                          [{order.channel}]
                        </span>
                      )}
                      <div className="text-muted" style={{ fontSize: '9px' }}>{order.phone || "-"}</div>
                    </div>

                    <div className="address-box mb-1 text-muted">
                       ที่อยู่: {order.address || "รับเองที่ร้าน"}
                    </div>

                    <div className="product-info mb-1">
                      <div className="fw-bold text-truncate" style={{ fontSize: '10px' }}>
                        {order.productCode} | {order.productName} <span className="text-danger">x{order.qty}</span>
                      </div>
                      {product?.["ดอกไม้"] && (
                        <div className="flower-detail">{product["ดอกไม้"]}</div>
                      )}
                    </div>

                    {order.customOption && (
                      <div className="bg-light p-1 rounded-1 mb-1 text-truncate" style={{ fontSize: '8.5px', borderLeft: '2px solid #ccc' }}>
                        {order.customOption}
                      </div>
                    )}

                    {order.cardMessage && (
                      <div className="card-message">“{order.cardMessage}”</div>
                    )}
                  </div>

                  {/* RIGHT ASSETS (35%) */}
                  <div className="d-flex flex-column align-items-center justify-content-between" style={{ width: '35%', paddingLeft: '6px' }}>
                    {/* รูปขนาดเท่า QR */}
                    {product?.img ? (
                      <div className="img-wrap-mini">
                        <img src={product.img} alt="p" />
                      </div>
                    ) : (
                      <div className="img-wrap-mini bg-light d-flex align-items-center justify-content-center text-muted" style={{ fontSize: '7px' }}>
                        No Image
                      </div>
                    )}

                    {/* QR Code (URL) + Net Price */}
                    <div className="text-center mt-auto pb-1">
                      <QRCodeCanvas value={qrUrl} size={55} level="M" />
                      <div className="fw-bold mt-1" style={{ fontSize: '10px' }}>
                        ฿{Number(order.net).toLocaleString()}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap');
          
          body {
            font-family: 'Sarabun', sans-serif;
            background-color: #f0f0f0;
          }

          .print-card {
            border-radius: 4px;
            height: 200px; /* เพิ่มความสูงเผื่อไว้กันขาด */
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border: 1px solid #ddd;
          }

          .img-wrap-mini {
            width: 55px; 
            height: 55px;
            border-radius: 4px;
            overflow: hidden;
            border: 0.5px solid #eee;
            margin-top: 2px;
          }
          .img-wrap-mini img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .address-box {
            font-size: 9px;
            line-height: 1.1;
            height: 2.2em;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .flower-detail {
            font-size: 8.5px;
            color: #555;
            line-height: 1.1;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .card-message {
            font-size: 9px;
            font-style: italic;
            background: #fdfdfd;
            padding: 3px;
            border: 0.5px solid #eee;
            line-height: 1.1;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          @media print {
            @page {
              margin: 0.5cm;
              size: A4 portrait;
            }
            .no-print { display: none !important; }
            body { background-color: #fff; margin: 0; padding: 0; }
            .container-fluid { width: 100% !important; padding: 0 !important; max-width: 100% !important; }
            
            .col-print-6 { 
              width: 50% !important; 
              float: left; 
              padding: 3px !important; 
              box-sizing: border-box;
            }

            .print-card { 
              border: 1px solid #ddd !important;
              page-break-inside: avoid;
              break-inside: avoid;
            }

            .row { display: block !important; }
            .row::after { content: ""; display: table; clear: both; }
          }
        `}
      </style>
    </div>
  );
}