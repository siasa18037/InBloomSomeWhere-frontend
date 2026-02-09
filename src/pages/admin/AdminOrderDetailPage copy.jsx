import React, { useEffect, useState } from "react";

import { useParams, useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../state/AuthContext.jsx";

import { apiGetAllOrders, apiUpdateOrder, apiDeleteOrder } from "../../api/client.js";

import { 

  ChevronLeft, User, ShoppingBag, Truck, CreditCard, 

  Edit, CheckCircle, Package, Send, Trash2, Calendar, Phone, MapPin, Clock

} from "lucide-react";



export default function AdminOrderDetailPage() {

  const { id } = useParams();

  const nav = useNavigate();

  const { token, logout } = useAuth();



  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [err, setErr] = useState("");



  const loadOrder = () => {

    setLoading(true);

    apiGetAllOrders(token)

      .then((r) => {

        const found = (r.data || []).find((o) => String(o["Order ID"]) === id);

        if (!found) setErr("ไม่พบออเดอร์");

        else setOrder(found);

      })

      .catch((e) => {

        if (e.message === "unauthorized") { logout(); nav("/login"); }

        else setErr(e.message);

      })

      .finally(() => setLoading(false));

  };



  useEffect(() => { loadOrder(); }, [id, token]);



  const updateStatus = async (newStatus, paymentUpdate = null) => {

    setUpdating(true);

    try {

      const updatedData = { ...order };

      if (newStatus) updatedData["สถานะออเดอร์"] = newStatus;

      if (paymentUpdate) updatedData["สถานะชำระเงิน"] = paymentUpdate;



      await apiUpdateOrder(token, updatedData, order["Order ID"]);

      loadOrder();

    } catch (e) {

      alert("อัปเดตไม่สำเร็จ: " + e.message);

    } finally {

      setUpdating(false);

    }

  };



  if (loading) return (

    <div className="d-flex justify-content-center align-items-center min-vh-100">

      <div className="spinner-border text-danger" role="status"></div>

    </div>

  );



  if (err) return <div className="container py-5"><div className="alert alert-danger rounded-4">{err}</div></div>;



  return (

    <div className="container py-4 pb-5">

      {/* ===== Header ===== */}

      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">

        <div className="d-flex align-items-center gap-3">

          <button className="btn btn-light rounded-circle shadow-sm" onClick={() => nav("/admin/orders")}>

            <ChevronLeft size={20} />

          </button>

          <div>

            <h2 className="fw-bold mb-0">รายละเอียดออเดอร์</h2>

            <div className="d-flex align-items-center gap-2">

              <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3">#{order["Order ID"]}</span>

              <small className="text-muted d-flex align-items-center gap-1">

                <Clock size={14} /> สั่งเมื่อ: {new Date(order["วันที่รับออเดอร์"]).toLocaleString('th-TH')}

              </small>

            </div>

          </div>

        </div>



        <div className="d-flex gap-2">

          <Link to={`/admin/edit/${id}`} className="btn btn-warning rounded-pill px-4 text-white shadow-sm">

            <Edit size={18} className="me-2" /> แก้ไขข้อมูล

          </Link>

          <button className="btn btn-outline-secondary rounded-pill px-3" onClick={() => {

            if(window.confirm("ลบออเดอร์นี้ถาวร?")) {

              apiDeleteOrder(token, id).then(() => nav("/admin/orders"));

            }

          }}>

            <Trash2 size={18} />

          </button>

        </div>

      </div>



      <div className="row g-4">

        <div className="col-lg-8">

          {/* ข้อมูลลูกค้า */}

          <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">

                <User size={20} /> ข้อมูลลูกค้า

              </h5>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="small text-muted d-block">ชื่อลูกค้า</label>

                  <span className="fw-bold fs-5 text-dark">{order["ชื่อลูกค้า"] || "-"}</span>

                </div>

                <div className="col-md-6 mb-3">

                  <label className="small text-muted d-block">เบอร์โทรศัพท์</label>

                  <a href={`tel:${order["เบอร์โทร"]}`} className="text-decoration-none fw-bold text-dark d-flex align-items-center gap-2">

                    <Phone size={14} className="text-danger" /> {order["เบอร์โทร"] || "-"}

                  </a>

                </div>

                <div className="col-12">

                  <label className="small text-muted d-block">ช่องทางสั่งซื้อ</label>

                  <span className="badge bg-light text-dark border px-3">{order["ช่องทางสั่ง"] || "ไม่ระบุ"}</span>

                </div>

              </div>

            </div>

          </div>



          {/* รายการสินค้าพร้อมรูปภาพ */}

          <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">

                <ShoppingBag size={20} /> รายการสินค้า

              </h5>

              <div className="p-3 border rounded-4 bg-light d-flex align-items-center gap-4">

                {/* แสดงรูปสินค้า (ถ้ามี Image URL ในระบบของคุณให้เปลี่ยน src เป็นฟิลด์นั้น) */}

                <div className="product-img-container shadow-sm rounded-3 overflow-hidden bg-white d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>

                  {order["รูปสินค้า"] ? (

                     <img src={order["รูปสินค้า"]} alt="product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                  ) : (

                    <Package size={40} className="text-danger opacity-25" />

                  )}

                </div>

                

                <div className="flex-grow-1">

                  <div className="h5 fw-bold mb-1">{order["ชื่อสินค้า"]}</div>

                  <div className="text-muted small mb-2">รหัสสินค้า: {order["รหัสสินค้า"]}</div>

                  <div className="d-flex align-items-center gap-3">

                    <span className="fw-bold">จำนวน: {order["จำนวน"]}</span>

                    <span className="text-danger fw-bold fs-5">฿{Number(order["ราคาต่อช่อ"]).toLocaleString()}</span>

                  </div>

                </div>

              </div>



              {order["ปรับแต่งเพิ่มเติม"] && (

                <div className="mt-3 p-3 border rounded-4 bg-white border-start border-danger border-4">

                  <label className="small fw-bold text-danger d-block mb-1">ปรับแต่งเพิ่มเติม:</label>

                  <p className="mb-0 text-secondary">{order["ปรับแต่งเพิ่มเติม"]}</p>

                </div>

              )}

            </div>

          </div>



          {/* การจัดส่งและเวลา */}

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">

                <Truck size={20} /> รายละเอียดการจัดส่ง

              </h5>

              <div className="row g-4">

                <div className="col-md-4">

                  <div className="p-3 bg-light rounded-4 h-100">

                    <label className="small text-muted d-flex align-items-center gap-1 mb-1">

                      <Calendar size={14} /> วันที่ส่ง/รับ

                    </label>

                    <div className="fw-bold">{order["วันที่ส่ง / รับสินค้า"] || "-"}</div>

                  </div>

                </div>

                <div className="col-md-4">

                  <div className="p-3 bg-light rounded-4 h-100">

                    <label className="small text-muted d-flex align-items-center gap-1 mb-1">

                      <Clock size={14} /> เวลาที่ต้องการ

                    </label>

                    <div className="fw-bold text-primary">{order["เวลาจัดส่ง"] || "ไม่ระบุเวลา"}</div>

                  </div>

                </div>

                <div className="col-md-4">

                  <div className="p-3 bg-light rounded-4 h-100">

                    <label className="small text-muted d-flex align-items-center gap-1 mb-1">

                      <MapPin size={14} /> วิธีรับสินค้า

                    </label>

                    <div className="fw-bold">{order["วิธีรับสินค้า"]}</div>

                  </div>

                </div>

                <div className="col-12">

                  <div className="p-3 border rounded-4 bg-white shadow-sm">

                    <label className="small text-muted d-block mb-2 font-monospace">ที่อยู่สำหรับการจัดส่ง:</label>

                    <p className="mb-0 fw-medium" style={{ whiteSpace: 'pre-wrap' }}>

                      {order["ที่อยู่จัดส่ง"] || "นัดรับสินค้า ณ หน้าร้าน"}

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* ===== RIGHT SIDE: PAYMENT & ACTION ===== */}

        <div className="col-lg-4">

          <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden border-top border-danger border-5">

            <div className="card-body p-4 text-center">

              <label className="small text-muted d-block mb-1">สถานะปัจจุบัน</label>

              <h4 className="fw-bold text-danger mb-4">{order["สถานะออเดอร์"]}</h4>

              

              <div className="d-grid gap-2">

                {updating ? (

                   <button className="btn btn-light disabled rounded-pill py-2"><span className="spinner-border spinner-border-sm me-2"></span></button>

                ) : (

                  <>

                    {order["สถานะออเดอร์"] === "รอคอนเฟิร์ม" && (

                      <button className="btn btn-info text-white rounded-pill py-2" onClick={() => updateStatus("เตรียมสินค้า")}>เตรียมสินค้า</button>

                    )}

                    {order["สถานะออเดอร์"] === "เตรียมสินค้า" && (

                      <button className="btn btn-primary rounded-pill py-2" onClick={() => updateStatus("พร้อมส่ง")}>พร้อมส่ง</button>

                    )}

                    {order["สถานะออเดอร์"] === "พร้อมส่ง" && (

                      <button className="btn btn-success rounded-pill py-2" onClick={() => updateStatus("ส่งแล้ว")}>ส่งแล้ว</button>

                    )}

                  </>

                )}

              </div>

            </div>

          </div>



          <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '90px' }}>

            <div className="card-body p-4">

              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">

                <CreditCard size={20} /> ชำระเงิน

              </h5>



              <div className="mb-3">

                <div className="d-flex justify-content-between mb-2">

                  <span className="text-muted">ราคารวม</span>

                  <span>฿{Number(order["ราคารวมสินค้า"]).toLocaleString()}</span>

                </div>

                <div className="d-flex justify-content-between mb-2">

                  <span className="text-muted">ค่าจัดส่ง</span>

                  <span>+ ฿{Number(order["ค่าจัดส่ง"]).toLocaleString()}</span>

                </div>

                <div className="d-flex justify-content-between mb-2 text-danger">

                  <span className="small">ส่วนลด</span>

                  <span>- ฿{Number(order["ส่วนลด"]).toLocaleString()}</span>

                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <span className="fw-bold fs-5">ยอดสุทธิ</span>

                  <span className="fw-bold fs-3 text-danger">฿{Number(order["ยอดสุทธิ"]).toLocaleString()}</span>

                </div>

              </div>



              <div className={`p-3 rounded-4 mb-4 text-center ${order["สถานะชำระเงิน"] === 'จ่ายแล้ว' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-dark'}`}>

                <label className="small d-block opacity-75">สถานะเงิน:</label>

                <div className="fw-bold fs-5">{order["สถานะชำระเงิน"]}</div>

              </div>



              {order["สถานะชำระเงิน"] !== "จ่ายแล้ว" && (

                <button className="btn btn-success w-100 rounded-pill py-2 shadow-sm mb-2" onClick={() => updateStatus(null, "จ่ายแล้ว")} disabled={updating}>จ่ายแล้ว</button>

              )}

              

              <div className="mt-3 p-3 bg-light rounded-4">

                <label className="small text-muted d-block mb-1 font-monospace">หมายเหตุร้าน:</label>

                <p className="small mb-0 text-secondary">{order["หมายเหตุร้าน"] || "ไม่มีหมายเหตุ"}</p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}