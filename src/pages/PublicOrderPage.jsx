import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  apiGetOrderPublic,
  apiGetProducts
} from "../api/client.js";

import { fromSheetToForm } from "../utils/orderMapper.js";

import {
  Package,
  User,
  ShoppingBag,
  Truck,
  CreditCard,
  Calendar,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Send,
  XCircle
} from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";

export default function PublicOrderPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [productImg, setProductImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

    const statusConfig = {
    "รอคอนเฟิร์ม": {
      icon: <Clock size={16} />,
      className: "bg-secondary bg-opacity-10 text-secondary"
    },
    "เตรียมสินค้า": {
      icon: <Package size={16} />,
      className: "bg-info bg-opacity-10 text-info"
    },
    "พร้อมส่ง": {
      icon: <Send size={16} />,
      className: "bg-primary bg-opacity-10 text-primary"
    },
    "กำลังจัดส่ง": {
      icon: <Truck size={16} />,
      className: "bg-warning bg-opacity-10 text-dark"
    },
    "ส่งแล้ว": {
      icon: <CheckCircle size={16} />,
      className: "bg-success bg-opacity-10 text-success"
    },
    "ยกเลิก": {
      icon: <XCircle size={16} />,
      className: "bg-danger bg-opacity-10 text-danger"
    }
  };

 

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
        const matched = list.find(
          (p) => String(p.ID) === String(mapped.productCode)
        );
        if (matched?.img) {
          setProductImg(matched.img);
        }
      })
      .catch((e) => {
        setErr("ไม่พบออเดอร์นี้");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-danger" />
      </div>
    );
  }

  if (err || !order) {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card border-0 shadow-sm rounded-4 p-4 text-center" style={{ maxWidth: 420 }}>
        <div className="mb-3">
          <Package size={48} className="text-danger opacity-75" />
        </div>

        <h5 className="fw-bold mb-2">ไม่พบออเดอร์นี้</h5>
        <p className="text-muted small mb-4">
          กรุณาตรวจสอบหมายเลขออเดอร์อีกครั้ง
        </p>

        <a
          href="/my-order"
          className="btn btn-danger rounded-pill px-4 py-2"
        >
          กลับไปค้นหาใหม่
        </a>
      </div>
    </div>
  );
}

  const statusUI = statusConfig[order.status] || {
    icon: <Clock size={16} />,
    className: "bg-light text-dark"
  };

  const orderPublicUrl = `${window.location.origin}/order/${order.orderId}`;

  return (
    <div className="container py-4 pb-5">


      {/* ===== QR STATUS CARD ===== */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div className="card-body p-2 text-center">

          <h5 className="fw-bold text-danger ">
            สถานะคำสั่งซื้อของคุณ
          </h5>

          <QRCodeCanvas
            value={orderPublicUrl}
            size={160}
            includeMargin
          />

          <div className="">
            <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2">
              #{order.orderId}
            </span>
          </div>

          <div className="mt-3">
            <div
                className={`d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold ${statusUI.className}`}
              >
                {statusUI.icon}
                <span>{order.status}</span>
              </div>
          </div>

          <div className="text-muted small mt-2 d-flex justify-content-center gap-1 align-items-center">
            <Clock size={14} />
            สั่งเมื่อ {new Date(order.orderDate).toLocaleString("th-TH")}
          </div>

          <p className="small text-muted mt-2 mb-2">
            แสดง QR นี้ให้ร้าน หรือใช้ตรวจสอบสถานะออเดอร์
          </p>
        </div>
      </div>


      <div className="row g-4">
        {/* LEFT */}
        <div className="col-lg-8">

          {/* ลูกค้า */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 text-danger d-flex gap-2 align-items-center">
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
                    className="fw-bold text-dark text-decoration-none d-flex gap-2 align-items-center"
                  >
                    <Phone size={14} className="text-danger" />
                    {order.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* สินค้า */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 text-danger d-flex gap-2 align-items-center">
                <ShoppingBag size={20} /> รายการสินค้า
              </h5>

              <div className="p-3 border rounded-4 bg-light d-flex gap-4">
                <div
                  className="rounded-3 overflow-hidden bg-white d-flex align-items-center justify-content-center"
                  style={{ width: 100, height: 100 }}
                >
                  {productImg ? (
                    <img
                      src={productImg}
                      alt="product"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                  <div className="fw-bold">
                    จำนวน: {order.qty}
                  </div>
                </div>
              </div>

              {order.customOption && (
                <div className="mt-3 p-3 border-start border-danger border-4 rounded-4 bg-white">
                  <label className="small fw-bold text-danger">
                    ปรับแต่งเพิ่มเติม:
                  </label>
                  <p className="mb-0 text-secondary" style={{ whiteSpace: "pre-wrap" }}>
                    {order.customOption}
                  </p>
                </div>
              )}

              {order.cardMessage && (
                <div className="mt-3 p-3 bg-light rounded-4 fst-italic">
                  “{order.cardMessage}”
                </div>
              )}

              {order.sender && (
                <div className="mt-2">
                  <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3">
                    จาก: {order.sender}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* จัดส่ง */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 text-danger d-flex gap-2 align-items-center">
                <Truck size={20} /> การจัดส่ง
              </h5>

              <div className="row g-3">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-4">
                    <Calendar size={14} /> วันที่
                    <div className="fw-bold">{order.deliveryDate}</div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-4">
                    <Clock size={14} /> เวลา
                    <div className="fw-bold">{order.deliveryTime}</div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-4">
                    <MapPin size={14} /> วิธีรับ
                    <div className="fw-bold">{order.receiveMethod}</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 p-3 border rounded-4 bg-white">
                {order.address || "นัดรับหน้าร้าน"}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: 20 }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 text-danger d-flex gap-2 align-items-center">
                <CreditCard size={20} /> สรุปการชำระเงิน
              </h5>

              <div className="d-flex justify-content-between mb-2">
                <span>ราคารวม</span>
                <span>฿{Number(order.productTotal).toLocaleString()}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>ค่าจัดส่ง</span>
                <span>฿{Number(order.shipping).toLocaleString()}</span>
              </div>

              <div className="d-flex justify-content-between mb-2 text-danger">
                <span>ส่วนลด</span>
                <span>-฿{Number(order.discount).toLocaleString()}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>ยอดสุทธิ</span>
                <span className="text-danger">
                  ฿{Number(order.net).toLocaleString()}
                </span>
              </div>

              <div
                className={`mt-4 p-3 rounded-4 text-center ${
                  order.paymentStatus === "จ่ายแล้ว"
                    ? "bg-success bg-opacity-10 text-success"
                    : "bg-warning bg-opacity-10"
                }`}
              >
                {order.paymentStatus}
              </div>

              <div className="mt-3 p-3 bg-light rounded-4 small text-muted">
                สถานะออเดอร์: <strong>{order.status}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
