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
  const [selectedOrders, setSelectedOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  // ✅ เพิ่ม filter ประเภทการรับสินค้า
  const [receiveFilter, setReceiveFilter] = useState("ทั้งหมด");

  const load = async () => {
    setLoading(true);
    try {
      const r = await apiGetAllOrders(token);
      const mapped = (r.data || []).map(fromSheetToForm);
      setOrders(mapped);
      setErr("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  useEffect(() => {
    setSelectedOrders([]);
  }, [searchTerm, statusFilter, dateFilter, productFilter, sortOrder, receiveFilter]);

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

      // ✅ receive filter
      const matchesReceive =
        receiveFilter === "ทั้งหมด" ||
        o.receiveMethod === receiveFilter;

      return matchesSearch && 
             matchesStatus && 
             matchesDate && 
             matchesProduct &&
             matchesReceive;
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

          {selectedOrders.length > 0 && (
            <button
              className="btn btn-dark rounded-pill px-4"
              onClick={() =>
                window.location.href = `/admin/print?ids=${selectedOrders.join(",")}`
              }
            >
              พิมพ์ {selectedOrders.length} รายการ
            </button>
          )}

          <Link
            to="/admin/create"
            className="btn btn-danger rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> สร้างออเดอร์
          </Link>
        </div>
      </div>

      {/* ===== Compact Filter ===== */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body py-3 px-3">
          <div className="row g-2">

            <div className="col-12 col-md-3">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 rounded-start-pill text-muted">
                  <Search size={14} />
                </span>
                <input 
                  type="text"
                  className="form-control border-start-0 rounded-end-pill" 
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select form-select-sm rounded-pill"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ทั้งหมด">สถานะทั้งหมด</option>
                <option value="รอคอนเฟิร์ม">รอคอนเฟิร์ม</option>
                <option value="เตรียมสินค้า">เตรียมสินค้า</option>
                <option value="พร้อมส่ง">พร้อมส่ง</option>
                <option value="กำลังจัดส่ง">กำลังจัดส่ง</option>
                <option value="ส่งแล้ว">ส่งแล้ว</option>
                <option value="ยกเลิก">ยกเลิก</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select form-select-sm rounded-pill"
                value={receiveFilter}
                onChange={(e) => setReceiveFilter(e.target.value)}
              >
                <option value="ทั้งหมด">การรับทั้งหมด</option>
                <option value="นัดรับ">นัดรับ</option>
                <option value="จัดส่งเอง">จัดส่งเอง</option>
                <option value="จัดส่งผ่านแมส">จัดส่งผ่านแมส</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <input
                type="date"
                className="form-control form-control-sm rounded-pill"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select form-select-sm rounded-pill"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              >
                {uniqueProducts.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-1">
              <select
                className="form-select form-select-sm rounded-pill"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">ใหม่</option>
                <option value="oldest">เก่า</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* ===== TABLE (ไม่แก้) ===== */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-3 text-center align-middle">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(filteredOrders.map(o => o.orderId));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    checked={
                      filteredOrders.length > 0 &&
                      filteredOrders.every(o => selectedOrders.includes(o.orderId))
                    }
                  />
                </th>
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
                  <td className="px-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(o.orderId)}
                      onChange={() => toggleSelect(o.orderId)}
                      className="form-check-input"
                    />
                  </td>
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
                    <Link to={`/admin/order/${o.orderId}`} className="btn btn-sm p-2">
                      <Eye size={16} className="text-info" />
                    </Link>
                    <Link to={`/admin/edit/${o.orderId}`} className="btn btn-sm p-2">
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
