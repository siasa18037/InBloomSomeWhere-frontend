import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthContext.jsx";
import {
  apiGetOrderPublic,
  apiUpdateOrder,
  apiDeleteOrder,
  apiGetProducts
} from "../../api/client.js";
import {
  Save,
  Trash2,
  ChevronLeft,
  User,
  ShoppingBag,
  Truck,
  CreditCard,
  Calendar,
  MessageSquare,
  Edit3,
  Clock,
  RefreshCw
} from "lucide-react";

import { fromSheetToForm, fromFormToSheet } from "../../utils/orderMapper.js";

const STATUS = ["รอคอนเฟิร์ม", "เตรียมสินค้า", "พร้อมส่ง", "กำลังจัดส่ง", "ส่งแล้ว", "ยกเลิก"];
const RECEIVE = ["นัดรับ", "จัดส่งเอง", "จัดส่งผ่านแมส"];
const PAYMENT_METHOD = ["QR", "เงินสด"];
const PAYMENT_STATUS = ["จ่ายแล้ว", "จ่ายมัดจำ 50%", "ยังไม่จ่าย"];

export default function AdminEditOrderPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [hasCustom, setHasCustom] = useState(false);

  // Load Order and Products
  useEffect(() => {
    Promise.all([apiGetOrderPublic(id), apiGetProducts()])
      .then(([orderRes, productRes]) => {
        const mapped = fromSheetToForm(orderRes.data);
        setForm(mapped);
        setProducts(productRes.data || []);
        // ถ้ามีข้อมูล custom ให้เปิด switch อัตโนมัติ
        if (mapped.customOption || mapped.cardMessage || mapped.sender) {
          setHasCustom(true);
        }
      })
      .catch((e) => {
        if (e.message === "order_not_found") setErr("ไม่พบออเดอร์");
        else if (e.message === "unauthorized") { logout(); nav("/login"); }
        else setErr(e.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSelectProduct = (e) => {
    const pCode = e.target.value;
    const selected = products.find((p) => String(p.ID) === pCode);
    if (selected) {
      setForm((s) => ({
        ...s,
        productCode: selected.ID,
        productName: selected["ชื่อสินค้า"],
        pricePerBouquet: selected["ราคาขาย"] || 0
      }));
    }
  };

  const productTotal = Number(form?.qty || 0) * Number(form?.pricePerBouquet || 0);
  const net = productTotal + Number(form?.shipping || 0) - Number(form?.discount || 0);

  const onSave = async () => {
    setSaving(true);
    try {
      await apiUpdateOrder(token, fromFormToSheet({ ...form, productTotal, net }), form.orderId);
      alert("อัปเดตออเดอร์เรียบร้อยแล้ว");
      nav("/admin/order/" + form.orderId);
    } catch (e) {
      alert(e.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  console.log("form", form);

  const onDelete = async () => {
    if (!window.confirm("ยืนยันการลบออเดอร์นี้ถาวร?")) return;
    try {
      await apiDeleteOrder(token, id);
      nav("/admin/orders");
    } catch (e) {
      alert(e.message || "ลบไม่สำเร็จ");
    }
  };

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="spinner-border text-danger mb-3" />
      <div className="text-muted">กำลังดึงข้อมูลออเดอร์...</div>
    </div>
  )

  
  if (err) return <div className="container py-5"><div className="alert alert-danger rounded-4">{err}</div></div>;

  return (
    <div className="container py-4 pb-5">
      {/* Header */}
      <div className="d-md-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div>
            <h2 className="fw-bold mb-0">แก้ไขออเดอร์</h2>
            <small className="text-muted">ID: {form.orderId}</small>
          </div>
        </div>
        <button className="btn btn-outline-danger rounded-pill px-4 mt-3 mt-md-0" onClick={onDelete}>
          <Trash2 size={18} className="me-2" /> ลบออเดอร์นี้
        </button>
      </div>

      <div className="row g-4">
        {/* LEFT: Main Information */}
        <div className="col-lg-8">
          
          {/* 1. Customer Info */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">
                <User size={20} /> ข้อมูลลูกค้า
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">ชื่อลูกค้า *</label>
                  <input name="customerName" className="form-control rounded-pill" value={form.customerName || ""} onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">เบอร์โทร</label>
                  <input name="phone" className="form-control rounded-pill" value={form.phone || ""} onChange={onChange} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">ช่องทางสั่งซื้อ</label>
                  <input name="channel" className="form-control rounded-pill" value={form.channel || ""} onChange={onChange} />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Product Info */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">
                <ShoppingBag size={20} /> รายการสินค้า
              </h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold">เปลี่ยนสินค้าจากระบบ</label>
                  <select className="form-select rounded-pill mb-3" onChange={onSelectProduct} value={form.productCode}>
                    <option value="">-- เลือกสินค้า --</option>
                    {products.map(p => <option key={p.ID} value={p.ID}>[{p.ID}] {p["ชื่อสินค้า"]}</option>)}
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label small fw-bold">ชื่อสินค้า</label>
                  <input name="productName" className="form-control rounded-pill" value={form.productName || ""} onChange={onChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">รหัสสินค้า</label>
                  <input name="productCode" className="form-control rounded-pill bg-light" value={form.productCode || ""} readOnly />
                </div>

                {/* Custom Options Toggle */}
                <div className="col-12 mt-4">
                  <div className="form-check form-switch custom-switch">
                    <input className="form-check-input" type="checkbox" id="editCustomCheck" checked={hasCustom} onChange={(e) => setHasCustom(e.target.checked)} />
                    <label className="form-check-label fw-bold" htmlFor="editCustomCheck">ปรับแต่งเพิ่มเติม / มีการ์ด</label>
                  </div>
                </div>

                {hasCustom && (
                  <div className="row g-3 mt-1">
                    <div className="col-md-12">
                      <label className="form-label small fw-bold"><Edit3 size={16} /> รายละเอียดปรับแต่ง</label>
                      <textarea name="customOption" className="form-control rounded-4" rows="2" value={form.customOption || ""} onChange={onChange} />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small fw-bold"><MessageSquare size={16} /> ข้อความการ์ด</label>
                      <textarea name="cardMessage" className="form-control rounded-4" rows="2" value={form.cardMessage || ""} onChange={onChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">ชื่อผู้ให้ (Sender)</label>
                      <input name="sender" className="form-control rounded-pill" value={form.sender || ""} onChange={onChange} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Delivery Info */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">
                <Truck size={20} /> การจัดส่ง
              </h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">วันที่ส่ง/รับสินค้า</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 rounded-start-pill"><Calendar size={18} /></span>
                    <input type="date" name="deliveryDate" className="form-control border-start-0 rounded-end-pill" value={form.deliveryDate || ""} onChange={onChange} />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">เวลา</label>
                  <input name="deliveryTime" className="form-control rounded-pill" value={form.deliveryTime || ""} onChange={onChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">วิธีรับสินค้า</label>
                  <select name="receiveMethod" className="form-select rounded-pill" value={form.receiveMethod || "จัดส่งเอง"} onChange={onChange}>
                    {RECEIVE.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">ที่อยู่จัดส่ง</label>
                  <textarea name="address" className="form-control rounded-4" rows="2" value={form.address || ""} onChange={onChange} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Financials & Status */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '90px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger">
                <CreditCard size={20} /> สรุปและสถานะ
              </h5>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="small fw-bold">จำนวน</label>
                  <input type="number" name="qty" className="form-control rounded-pill" value={form.qty || 0} onChange={onChange} />
                </div>
                <div className="col-6">
                  <label className="small fw-bold">ราคาต่อช่อ</label>
                  <input type="number" name="pricePerBouquet" className="form-control rounded-pill" value={form.pricePerBouquet || 0} onChange={onChange} />
                </div>
                <div className="col-6">
                  <label className="small fw-bold">ค่าส่ง</label>
                  <input type="number" name="shipping" className="form-control rounded-pill" value={form.shipping || 0} onChange={onChange} />
                </div>
                <div className="col-6">
                  <label className="small fw-bold text-danger">ส่วนลด</label>
                  <input type="number" name="discount" className="form-control rounded-pill" value={form.discount || 0} onChange={onChange} />
                </div>
              </div>

              <div className="bg-danger bg-opacity-10 p-3 rounded-4 mb-4 text-center">
                <div className="small text-muted mb-1">ยอดรวมสุทธิ</div>
                <div className="fw-bold fs-3 text-danger">฿{net.toLocaleString()}</div>
              </div>

              <div className="mb-3">
                <label className="small fw-bold">สถานะออเดอร์</label>
                <select name="status" className="form-select rounded-pill fw-bold" value={form.status || "รอคอนเฟิร์ม"} onChange={onChange}>
                  {STATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label className="small fw-bold">การชำระเงิน</label>
                <select name="paymentStatus" className="form-select rounded-pill" value={form.paymentStatus || "ยังไม่จ่าย"} onChange={onChange}>
                  {PAYMENT_STATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {form.paymentStatus !== "ยังไม่จ่าย" && (
                <div className="mb-3">
                  <label className="small fw-bold">วันที่/เวลาชำระเงิน</label>
                  <input type="datetime-local" name="paymentDate" className="form-control rounded-pill" value={form.paymentDate || ""} onChange={onChange} />
                </div>
              )}

              <div className="mb-4">
                <label className="small fw-bold text-muted">หมายเหตุร้าน</label>
                <textarea name="note" className="form-control rounded-3 small" rows="2" value={form.note || ""} onChange={onChange} />
              </div>

              <button 
                className="btn btn-danger w-100 btn-lg rounded-pill shadow d-flex align-items-center justify-content-center gap-2 transition-btn"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    <Save size={20} /> บันทึกการแก้ไข
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}