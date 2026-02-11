import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../state/AuthContext.jsx";
import { apiGetAllOrders } from "../../api/client.js";
import { fromSheetToForm } from "../../utils/orderMapper.js";

import { 
  Search, Plus, RefreshCw, Edit,
  Calendar as CalendarIcon, Package, UsersRound,
  Eye
} from "lucide-react";

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [dateFilter, setDateFilter] = useState("");
const [productFilter, setProductFilter] = useState("ทั้งหมด");
const [sortOrder, setSortOrder] = useState("newest");

  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  const load = async () => {
    setLoading(true);
    try {
      const r = await apiGetAllOrders(token);

      // ✅ MAP ที่นี่ครั้งเดียว
      const mapped = (r.data || []).map(fromSheetToForm);

      setOrders(mapped);
      setErr("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const uniqueProducts = [
    "ทั้งหมด",
    ...Array.from(new Set(orders.map(o => o.productName).filter(Boolean)))
  ];

  useEffect(() => { load(); }, []);

  // ===== FILTER =====
  const filteredOrders = orders
    .filter(o => {
      const id = String(o.orderId || "").toLowerCase();
      const name = String(o.customerName || "").toLowerCase();
      const phone = String(o.phone || "");
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        id.includes(search) ||
        name.includes(search) ||
        phone.includes(search);

      const matchesStatus =
        statusFilter === "ทั้งหมด" ||
        o.status === statusFilter;

      const matchesDate =
        !dateFilter ||
        o.deliveryDate === dateFilter;

      const matchesProduct =
        productFilter === "ทั้งหมด" ||
        o.productName === productFilter;

      return matchesSearch && matchesStatus && matchesDate && matchesProduct;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.orderDate) - new Date(a.orderDate);
      } else {
        return new Date(a.orderDate) - new Date(b.orderDate);
      }
    });


  const getStatusBadge = (status) => {
    const badges = {
      "รอคอนเฟิร์ม": "bg-warning text-dark",
      "เตรียมสินค้า": "bg-info text-white",
      "พร้อมส่ง": "bg-primary text-white",
      "กำลังจัดส่ง": "bg-primary text-white",
      "ส่งแล้ว": "bg-success text-white",
      "ยกเลิก": "bg-secondary text-white",
    };
    return `badge rounded-pill px-3 py-2 ${badges[status] || "bg-light text-dark"}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return dateStr.split("T")[0];
  };

  return (
    <div className="container py-4">
      <div className="d-md-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">รายการออเดอร์</h2>
          <p className="text-muted small">InBloomSomewhere Management</p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button
            onClick={load}
            className="btn btn-light rounded-pill px-3 d-flex align-items-center gap-2 border"
          >
            <RefreshCw size={18} className={loading ? "spinner" : ""} /> รีเฟรช
          </button>
          <Link
            to="/admin/create"
            className="btn btn-danger rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> สร้างออเดอร์
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row g-3">

            {/* SEARCH */}
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 rounded-start-pill text-muted">
                  <Search size={18} />
                </span>
                <input 
                  type="text"
                  className="form-control border-start-0 rounded-end-pill" 
                  placeholder="ค้นหา ID / ชื่อลูกค้า / เบอร์..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="col-md-2">
              <select
                className="form-select rounded-pill fw-bold"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ทั้งหมด">ทุกสถานะ</option>
                <option value="รอคอนเฟิร์ม">รอคอนเฟิร์ม</option>
                <option value="เตรียมสินค้า">เตรียมสินค้า</option>
                <option value="พร้อมส่ง">พร้อมส่ง</option>
                <option value="กำลังจัดส่ง">กำลังจัดส่ง</option>
                <option value="ส่งแล้ว">ส่งแล้ว</option>
                <option value="ยกเลิก">ยกเลิก</option>
              </select>
            </div>

            {/* DATE */}
            <div className="col-md-2">
              <input
                type="date"
                className="form-control rounded-pill"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            {/* PRODUCT */}
            <div className="col-md-2">
              <select
                className="form-select rounded-pill"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              >
                {uniqueProducts.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* SORT */}
            <div className="col-md-2">
              <select
                className="form-select rounded-pill"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">ใหม่ล่าสุด</option>
                <option value="oldest">เก่าสุด</option>
              </select>
            </div>

          </div>
        </div>
      </div>


      {/* TABLE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Order ID / ลูกค้า</th>
                <th className="py-3">สินค้า</th>
                <th className="py-3">วันที่ส่ง</th>
                <th className="py-3">สถานะ</th>
                <th className="py-3 text-end">ยอดสุทธิ</th>
                <th className="px-4 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.orderId}>
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">
                      #{o.orderId?.slice(-8)}
                    </div>
                    <div className="small text-muted">
                      <UsersRound size={12} /> {o.customerName}
                    </div>
                  </td>

                  <td>
                    <div className="small fw-bold text-danger">
                      <Package size={14} /> {o.productName}
                    </div>
                    <div className="small text-muted">
                      x{o.qty} | {o.receiveMethod}
                    </div>
                  </td>

                  <td>
                    <div className="small text-dark">
                      <CalendarIcon size={14} /> {formatDate(o.deliveryDate)}
                    </div>
                    <div className="small text-muted">
                      ช่องทาง: {o.channel}
                    </div>
                  </td>

                  <td>
                    <span className={getStatusBadge(o.status)}>
                      {o.status}
                    </span>
                  </td>

                  <td className="text-end fw-bold text-dark">
                    ฿{Number(o.net || 0).toLocaleString()}
                  </td>

                  <td className="px-4 text-center">
                    <Link
                      to={`/admin/order/${o.orderId}`}
                      className="btn btn-sm p-2"
                    >
                      <Eye size={16} className="text-info" />
                    </Link>
                    <Link
                      to={`/admin/edit/${o.orderId}`}
                      className="btn btn-sm p-2"
                    >
                      <Edit size={16} className="text-warning" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-5 text-muted">
              ไม่พบข้อมูลออเดอร์
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
