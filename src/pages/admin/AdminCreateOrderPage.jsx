import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthContext.jsx";
import { apiCreateOrder, apiGetProducts } from "../../api/client.js";
import { 
  Save, User, ShoppingBag, Truck, CreditCard, 
  ChevronLeft, Calendar, MessageSquare, Edit3 
} from "lucide-react";

const STATUS = ["รอคอนเฟิร์ม", "เตรียมสินค้า", "พร้อมส่ง", "กำลังจัดส่ง", "ส่งแล้ว", "ยกเลิก"];
const RECEIVE = ["นัดรับ", "จัดส่งเอง", "จัดส่งผ่านแมส"];
const PAYMENT_METHOD = ["QR", "เงินสด"];
const PAYMENT_STATUS = ["จ่ายแล้ว", "จ่ายมัดจำ 50%", "ยังไม่จ่าย"];

export default function AdminCreateOrderPage() {
  const { token, logout } = useAuth();
  const nav = useNavigate();

  const [products, setProducts] = useState([]);
  const [hasCustom, setHasCustom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ เพิ่ม State สำหรับ Loading

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    channel: "",
    productCode: "",
    productName: "",
    qty: 1,
    customOption: "",
    cardMessage: "",
    sender: "",
    receiveMethod: "จัดส่งเอง",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    pricePerBouquet: 0,
    shipping: 0,
    discount: 0,
    status: "รอคอนเฟิร์ม",
    paymentMethod: "QR",
    paymentStatus: "ยังไม่จ่าย",
    paymentDate: "",
    note: ""
  });

  useEffect(() => {
    apiGetProducts().then((r) => setProducts(r.data || [])).catch(console.error);
  }, []);

  const productTotal = Number(form.qty) * Number(form.pricePerBouquet);
  const net = productTotal + Number(form.shipping) - Number(form.discount);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSelectProduct = (e) => {
    const pCode = e.target.value;
    const selected = products.find(p => String(p.ID) === pCode);
    if (selected) {
      setForm(s => ({
        ...s,
        productCode: selected.ID,
        productName: selected["ชื่อสินค้า"],
        pricePerBouquet: selected["ราคาขาย"] || 0
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) { logout(); nav("/login"); return; }
    
    setIsSubmitting(true); // ✅ เริ่ม Loading

    try {
      await apiCreateOrder(token, { ...form, productTotal, net });
      nav("/admin/orders");
    } catch (err) {
      if (err.message === "unauthorized") { logout(); nav("/login"); }
      else alert(err.message || "บันทึกไม่สำเร็จ");
    } finally {
      setIsSubmitting(false); // ✅ ปิด Loading
    }
  };

  return (
    <div className="container py-4 pb-5">
      <div className="d-flex align-items-center gap-3 mb-4">
        <h2 className="fw-bold mb-0">สร้างออเดอร์ใหม่</h2>
      </div>

      <form onSubmit={onSubmit} className="row g-4">
        <div className="col-lg-8">
          {/* 1. ข้อมูลลูกค้า */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger"><User size={20} /> ข้อมูลลูกค้า</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">ชื่อลูกค้า *</label>
                  <input name="customerName" className="form-control rounded-pill" value={form.customerName} onChange={onChange} required disabled={isSubmitting} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">เบอร์โทร</label>
                  <input name="phone" className="form-control rounded-pill" value={form.phone} onChange={onChange} disabled={isSubmitting} />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-bold">ช่องทางสั่งซื้อ (LINE / FB / Walk-in)</label>
                  <input name="channel" className="form-control rounded-pill" value={form.channel} onChange={onChange} disabled={isSubmitting} />
                </div>
              </div>
            </div>
          </div>

          {/* 2. รายการสินค้า & ปรับแต่ง */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger"><ShoppingBag size={20} /> รายการสินค้า</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold">เลือกสินค้าจากระบบ</label>
                  <select className="form-select rounded-pill mb-3" onChange={onSelectProduct} value={form.productCode} disabled={isSubmitting}>
                    <option value="">-- เลือกสินค้า --</option>
                    {products.map(p => <option key={p.ID} value={p.ID}>[{p.ID}] {p["ชื่อสินค้า"]}</option>)}
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label small fw-bold">ชื่อสินค้า</label>
                  <input name="productName" className="form-control rounded-pill" value={form.productName} onChange={onChange} disabled={isSubmitting} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">รหัสสินค้า</label>
                  <input name="productCode" className="form-control rounded-pill bg-light" value={form.productCode} readOnly />
                </div>

                <div className="col-12 mt-4">
                  <div className="form-check form-switch custom-switch">
                    <input className="form-check-input" type="checkbox" id="customCheck" checked={hasCustom} onChange={(e) => setHasCustom(e.target.checked)} disabled={isSubmitting} />
                    <label className="form-check-label fw-bold" htmlFor="customCheck">ปรับแต่งเพิ่มเติม / มีการ์ด</label>
                  </div>
                </div>

                {hasCustom && (
                  <div className="row g-3 mt-1">
                    <div className="col-md-12">
                      <label className="form-label small fw-bold"><Edit3 size={16} /> รายละเอียดปรับแต่ง</label>
                      <textarea name="customOption" className="form-control rounded-4" rows="2" value={form.customOption} onChange={onChange} disabled={isSubmitting} />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small fw-bold"><MessageSquare size={16} /> ข้อความการ์ด</label>
                      <textarea name="cardMessage" className="form-control rounded-4" rows="2" value={form.cardMessage} onChange={onChange} disabled={isSubmitting} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">ชื่อผู้ให้ (Sender)</label>
                      <input name="sender" className="form-control rounded-pill" value={form.sender} onChange={onChange} disabled={isSubmitting} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. การจัดส่ง */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger"><Truck size={20} /> การจัดส่ง</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">วันที่ส่ง/รับสินค้า *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 rounded-start-pill"><Calendar size={18} /></span>
                    <input type="date" name="deliveryDate" className="form-control border-start-0 rounded-end-pill" value={form.deliveryDate} onChange={onChange} required disabled={isSubmitting} />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">เวลาที่ต้องการ</label>
                  <input name="deliveryTime" className="form-control rounded-pill" placeholder="เช่น 14:00 น." value={form.deliveryTime} onChange={onChange} disabled={isSubmitting} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">วิธีรับสินค้า</label>
                  <select name="receiveMethod" className="form-select rounded-pill" value={form.receiveMethod} onChange={onChange} disabled={isSubmitting}>
                    {RECEIVE.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">ที่อยู่จัดส่ง</label>
                  <textarea name="address" className="form-control rounded-4" rows="2" value={form.address} onChange={onChange} disabled={isSubmitting} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: สรุปยอด & ชำระเงิน */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '90px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-danger"><CreditCard size={20} /> สรุปยอด</h5>
              
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="small fw-bold">จำนวน</label>
                  <input type="number" name="qty" className="form-control rounded-pill" value={form.qty} onChange={onChange} disabled={isSubmitting} />
                </div>
                <div className="col-6">
                  <label className="small fw-bold">ราคา/ช่อ</label>
                  <input type="number" name="pricePerBouquet" className="form-control rounded-pill" value={form.pricePerBouquet} onChange={onChange} disabled={isSubmitting} />
                </div>
                <div className="col-6">
                  <label className="small fw-bold">ค่าส่ง</label>
                  <input type="number" name="shipping" className="form-control rounded-pill" value={form.shipping} onChange={onChange} disabled={isSubmitting} />
                </div>
                <div className="col-6">
                  <label className="small fw-bold text-danger">ส่วนลด</label>
                  <input type="number" name="discount" className="form-control rounded-pill" value={form.discount} onChange={onChange} disabled={isSubmitting} />
                </div>
              </div>

              <div className="bg-danger bg-opacity-10 p-3 rounded-4 mb-3">
                <div className="d-flex justify-content-between fw-bold fs-4 text-danger">
                  <span>ยอดสุทธิ</span>
                  <span>฿{net.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="small fw-bold">สถานะชำระเงิน</label>
                <select name="paymentStatus" className="form-select rounded-pill" value={form.paymentStatus} onChange={onChange} disabled={isSubmitting}>
                  {PAYMENT_STATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label className="small fw-bold text-secondary">หมายเหตุร้าน (Note)</label>
                <textarea name="note" className="form-control rounded-4 small" rows="3" value={form.note} onChange={onChange} disabled={isSubmitting} />
              </div>

              {form.paymentStatus !== "ยังไม่จ่าย" && (
                <div className="mb-4">
                  <label className="small fw-bold text-secondary">วันที่และเวลาที่ชำระเงิน</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 rounded-start-pill">
                      <Calendar size={18} className="text-muted" />
                    </span>
                    <input 
                      type="datetime-local" // ✅ เลือกได้ทั้งวันที่และเวลา
                      name="paymentDate" 
                      className="form-control border-start-0 rounded-end-pill" 
                      value={form.paymentDate} 
                      onChange={onChange} 
                      disabled={isSubmitting} 
                    />
                  </div>
                  <div className="form-text ms-3 small text-muted">ระบุวันและเวลาตามสลิปโอนเงิน</div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-danger w-100 btn-lg rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>กำลังบันทึก...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>บันทึกออเดอร์</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}