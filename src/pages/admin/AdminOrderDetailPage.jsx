import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../state/AuthContext.jsx";

import {
  apiGetOrderPublic,
  apiGetProducts,
  apiUpdateOrder,
  apiDeleteOrder
} from "../../api/client.js";

import { fromSheetToForm , fromFormToSheet } from "../../utils/orderMapper.js";

import {
  ChevronLeft,
  User,
  ShoppingBag,
  Truck,
  CreditCard,
  Edit,
  Package,
  Trash2,
  Calendar,
  Phone,
  MapPin,
  Clock ,
  Copy
} from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";


export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token, logout } = useAuth();

  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [productImg, setProductImg] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [err, setErr] = useState("");

  /* ===============================
     LOAD ORDER + PRODUCTS (NEW)
     =============================== */
  useEffect(() => {
    setLoading(true);

    Promise.all([
      apiGetOrderPublic(id),
      apiGetProducts()
    ])
      .then(([orderRes, productRes]) => {
        const mapped = fromSheetToForm(orderRes.data);
        setOrder(mapped);

        const list = productRes.data || [];
        setProducts(list);

        const matched = list.find(
          (p) => String(p.ID) === String(mapped.productCode)
        );
        if (matched?.img) {
          setProductImg(matched.img);
        }
      })
      .catch((e) => {
        if (e.message === "order_not_found") {
          setErr("ไม่พบออเดอร์");
        } else if (e.message === "unauthorized") {
          logout();
          nav("/login");
        } else {
          setErr(e.message);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ===============================
     UPDATE STATUS (UNCHANGED)
     =============================== */
    const updateStatus = async (newStatus, paymentUpdate = null) => {
      setUpdating(true);
      try {
        const updated = { ...order };

        if (newStatus) updated.status = newStatus;
        if (paymentUpdate) updated.paymentStatus = paymentUpdate;

        const sheetPayload = fromFormToSheet(updated);

        await apiUpdateOrder(token, sheetPayload, updated.orderId);

        setOrder(updated); // update UI ทันที
      } catch (e) {
        alert("อัปเดตไม่สำเร็จ: " + e.message);
      } finally {
        setUpdating(false);
      }
    };


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-danger" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger rounded-4">{err}</div>
      </div>
    );
  }

  console.log(products)

  if (!order) return null;

  const orderPublicUrl = `${window.location.origin}/order/${order.orderId}`;

  const customerMessage = `
📌 ออเดอร์ของคุณหมายเลข
#${order.orderId}

ชื่อลูกค้า: ${order.customerName}
สินค้า: ${order.productName}
วันที่จัดส่ง: ${order.deliveryDate} ${order.deliveryTime || ""}
ยอดสุทธิ: ฿${Number(order.net).toLocaleString()}

สามารถตรวจสอบสถานะออเดอร์ได้ที่:
${orderPublicUrl}

ขอบคุณที่ใช้บริการค่ะ 💐
  `.trim();


  const customerConfirmMessage = `
📌 รบกวนตรวจสอบรายละเอียดออเดอร์ก่อนชำระเงินนะคะ

ชื่อลูกค้า: ${order.customerName}
เบอร์โทร: ${order.phone || "-"}
สินค้า: ${order.productName}
${order.customOption ? `ปรับแต่งเพิ่มเติม: ${order.customOption}` : ""}

วันที่จัดส่ง: ${order.deliveryDate} ${order.deliveryTime || ""}
วิธีรับ: ${order.receiveMethod}

${order.address 
  ? `ที่อยู่จัดส่ง: ${order.address}` 
  : "นัดรับหน้าร้าน"}

ยอดสุทธิ: ฿${Number(order.net).toLocaleString()}

`.trim();

  const copyConfirmMessage = async () => {
    await navigator.clipboard.writeText(customerConfirmMessage);
    alert("คัดลอกข้อความคอนเฟิร์มเรียบร้อย");
  };

  const copyMessage = async () => {
    await navigator.clipboard.writeText(customerMessage);
    alert("คัดลอกข้อความเรียบร้อย");
  };


  return (
    <div className="container py-4 pb-5">
      {/* ===== Header ===== */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
      
          <div>
            <h2 className="fw-bold mb-0">รายละเอียดออเดอร์</h2>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3">
                #{order.orderId}
              </span>
              <small className="text-muted d-flex align-items-center gap-1">
                <Clock size={14} /> สั่งเมื่อ:{" "}
                {new Date(order.orderDate).toLocaleString("th-TH")}
              </small>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2">
          <Link
            to={`/admin/edit/${id}`}
            className="btn btn-warning rounded-pill px-4 text-white shadow-sm"
          >
            <Edit size={18} className="me-2" /> แก้ไขข้อมูล
          </Link>
          <button
            className="btn btn-outline-secondary rounded-pill px-3"
            onClick={() => {
              if (window.confirm("ลบออเดอร์นี้ถาวร?")) {
                apiDeleteOrder(token, id).then(() =>
                  nav("/admin/orders")
                );
              }
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT */}
        <div className="col-lg-8">
          {/* ลูกค้า */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">
                <User size={20} /> ข้อมูลลูกค้า
              </h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="small text-muted">ชื่อลูกค้า</label>
                  <div className="fw-bold fs-5">{order.customerName}</div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="small text-muted">เบอร์โทร</label>
                  <a
                    href={`tel:${order.phone}`}
                    className="fw-bold text-dark text-decoration-none d-flex align-items-center gap-2"
                  >
                    <Phone size={14} className="text-danger" />
                    {order.phone}
                  </a>
                </div>

                <div className="col-12">
                  <label className="small text-muted">ช่องทางสั่ง</label>
                  <span className="badge bg-light text-dark border px-3">
                    {order.channel || "ไม่ระบุ"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* สินค้า */}
          {/* สินค้า */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">
                <ShoppingBag size={20} /> รายการสินค้า
              </h5>

              <div className="p-3 border rounded-4 bg-light d-flex align-items-center gap-4">
                <div
                  className="shadow-sm rounded-3 overflow-hidden bg-white d-flex align-items-center justify-content-center"
                  style={{ width: 100, height: 100 }}
                >
                  {productImg ? (
                    <img
                      src={productImg}
                      alt="product"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <Package size={40} className="text-danger opacity-25" />
                  )}
                </div>

                <div className="flex-grow-1">
                  <div className="h5 fw-bold mb-1">{order.productName}</div>
                  <div className="text-muted small mb-2">
                    รหัสสินค้า: {order.productCode}
                  </div>
                  <div className="d-flex gap-3">
                    <span className="fw-bold">จำนวน: {order.qty}</span>
                    <span className="fw-bold text-danger fs-5">
                      ฿{Number(order.pricePerBouquet).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* ✅ ปรับแต่งเพิ่มเติม (เพิ่มกลับมา) */}
              {order.customOption && (
                <div className="mt-3 p-3 border rounded-4 bg-white border-start border-danger border-4">
                  <label className="small fw-bold text-danger d-block mb-1">
                    ปรับแต่งเพิ่มเติม:
                  </label>
                  <p className="mb-0 text-secondary" style={{ whiteSpace: "pre-wrap" }}>
                    {order.customOption}
                  </p>
                </div>
              )}
           
                {/* ข้อความการ์ด */}
                {order.cardMessage && (
                  <div className="mt-3 p-3 border rounded-4 bg-light">
                    <label className="small fw-bold text-secondary d-block mb-1">
                      ข้อความการ์ด:
                    </label>
                    <p className="mb-0 fst-italic" style={{ whiteSpace: "pre-wrap" }}>
                      “{order.cardMessage}”
                    </p>
                  </div>
                )}

                {/* ผู้ให้ (Badge) */}
                {order.sender && (
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <span className="small text-muted">ผู้ให้:</span>
                    <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2">
                      {order.sender}
                    </span>
                  </div>
                )}

            </div>
          </div>


          {/* จัดส่ง */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">
                <Truck size={20} /> การจัดส่ง
              </h5>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-4">
                    <label className="small text-muted d-flex gap-1">
                      <Calendar size={14} /> วันที่
                    </label>
                    <div className="fw-bold">{order.deliveryDate}</div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-4">
                    <label className="small text-muted d-flex gap-1">
                      <Clock size={14} /> เวลา
                    </label>
                    <div className="fw-bold">{order.deliveryTime}</div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-4">
                    <label className="small text-muted d-flex gap-1">
                      <MapPin size={14} /> วิธีรับ
                    </label>
                    <div className="fw-bold">{order.receiveMethod}</div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="p-3 border rounded-4 bg-white">
                    <label className="small text-muted">ที่อยู่</label>
                    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                      {order.address || "นัดรับหน้าร้าน"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
{/* ===== RIGHT SIDE: PAYMENT & ACTION ===== */}
<div className="col-lg-4">

  {/* ===== STATUS CARD ===== */}
  <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden border-top border-danger border-5">
    <div className="card-body p-4 text-center">
      <label className="small text-muted d-block mb-1">สถานะปัจจุบัน</label>
      <h4 className="fw-bold text-danger mb-4">{order.status}</h4>

      <div className="d-grid gap-2">
        {updating ? (
          <button className="btn btn-light disabled rounded-pill py-2">
            <span className="spinner-border spinner-border-sm me-2"></span>
          </button>
        ) : (
          <>
            {order.status === "รอคอนเฟิร์ม" && (
              <button
                className="btn btn-info text-white rounded-pill py-2"
                onClick={() => updateStatus("เตรียมสินค้า")}
              >
                เตรียมสินค้า
              </button>
            )}
            {order.status === "เตรียมสินค้า" && (
              <button
                className="btn btn-primary rounded-pill py-2"
                onClick={() => updateStatus("พร้อมส่ง")}
              >
                พร้อมส่ง
              </button>
            )}
            {order.status === "พร้อมส่ง" && (
              <button
                className="btn btn-success rounded-pill py-2"
                onClick={() => updateStatus("กำลังจัดส่ง")}
              >
                กำลังจัดส่ง
              </button>
            )}
            {order.status === "กำลังจัดส่ง" && (
              <button
                className="btn btn-success rounded-pill py-2"
                onClick={() => updateStatus("ส่งแล้ว")}
              >
                ส่งแล้ว
              </button>
            )}
          </>
        )}
      </div>
    </div>
  </div>

  {/* ===== PAYMENT CARD ===== */}
  <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: "90px" }}>
    <div className="card-body p-4">
      <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">
        <CreditCard size={20} /> ชำระเงิน
      </h5>

      <div className="mb-3">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">ราคารวม</span>
          <span>฿{Number(order.productTotal).toLocaleString()}</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">ค่าจัดส่ง</span>
          <span>+ ฿{Number(order.shipping).toLocaleString()}</span>
        </div>

        <div className="d-flex justify-content-between mb-2 text-danger">
          <span className="small">ส่วนลด</span>
          <span>- ฿{Number(order.discount).toLocaleString()}</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="fw-bold fs-5">ยอดสุทธิ</span>
          <span className="fw-bold fs-3 text-danger">
            ฿{Number(order.net).toLocaleString()}
          </span>
        </div>
      </div>

      <div
        className={`p-3 rounded-4 mb-4 text-center ${
          order.paymentStatus === "จ่ายแล้ว"
            ? "bg-success bg-opacity-10 text-success"
            : "bg-warning bg-opacity-10 text-dark"
        }`}
      >
        <label className="small d-block opacity-75">สถานะเงิน:</label>
        <div className="fw-bold fs-5">{order.paymentStatus}</div>
      </div>

      {order.paymentStatus !== "จ่ายแล้ว" && (
        <button
          className="btn btn-success w-100 rounded-pill py-2 shadow-sm mb-2"
          onClick={() => updateStatus(null, "จ่ายแล้ว")}
          disabled={updating}
        >
          จ่ายแล้ว
        </button>
      )}

      <div className="mt-3 p-3 bg-light rounded-4">
        <label className="small text-muted d-block mb-1 font-monospace">
          หมายเหตุร้าน:
        </label>
        <p className="small mb-0 text-secondary">
          {order.note || "ไม่มีหมายเหตุ"}
        </p>
      </div>
    </div>
    </div>
  </div>


  {/* ===== QR & CUSTOMER MESSAGE ===== */}
    <div className="card border-0 shadow-sm rounded-4 mt-4">
      <div className="card-body p-4">
        <h6 className="fw-bold text-danger mb-3">
          QR Code สำหรับลูกค้า
        </h6>

        <div className="d-flex flex-column align-items-center gap-3 mb-4">
          <QRCodeCanvas
            value={orderPublicUrl}
            size={160}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin
          />
          <small className="text-muted text-center">
            สแกนเพื่อตรวจสอบสถานะออเดอร์
          </small>
        </div>

        <hr />

        <h6 className="fw-bold text-danger mb-2">
          ข้อความส่งให้ลูกค้า
        </h6>

        <div className="p-3 bg-light rounded-4 mb-3">
          <pre
            className="mb-0 small"
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "inherit"
            }}
          >
            {customerMessage}
          </pre>
        </div>

        <button
          className="btn btn-outline-danger w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
          onClick={copyMessage}
        >
          <Copy size={16} />
          คัดลอกข้อความ
        </button>

        {order.status === "รอคอนเฟิร์ม" && (
          <>
            <hr />
            <h6 className="fw-bold text-danger mb-2">
              ข้อความคอนเฟิร์มก่อนทำออเดอร์
            </h6>

            <div className="p-3 bg-light rounded-4 mb-3">
              <pre
                className="mb-0 small"
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit"
                }}
              >
                {customerConfirmMessage}
              </pre>
            </div>

            {order.status === "รอคอนเฟิร์ม" && (
              <button
                className="btn btn-danger w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-2"
                onClick={copyConfirmMessage}
              >
                <Copy size={16} />
                คัดลอกข้อความคอนเฟิร์มก่อนทำออเดอร์
              </button>
            )}

          </>
        )}

      </div>
    </div>
      </div>
    </div>
  );
}