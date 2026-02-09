import React, { useEffect, useState, useMemo } from "react";
import { Link ,useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthContext.jsx";
import { apiGetAllOrders } from "../../api/client.js";
import { fromSheetToForm } from "../../utils/orderMapper.js";
import Loading from "../../components/Loading";


import {
  ShoppingBag,
  DollarSign,
  Clock,
  Truck,
  PlusCircle,
  ChevronRight,
  Package
} from "lucide-react";

export default function AdminPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const r = await apiGetAllOrders(token);
      const mapped = (r.data || []).map(fromSheetToForm);
      setOrders(mapped);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DERIVED DATA (Dashboard Logic)
     =============================== */

  const today = new Date().toISOString().slice(0, 10);

  const ordersToday = orders.filter(
    (o) => o.deliveryDate === today
  );

  const needActionStatuses = ["รอคอนเฟิร์ม", "เตรียมสินค้า", "พร้อมส่ง"];

  const needActionOrders = orders.filter((o) =>
    needActionStatuses.includes(o.status)
  );

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.net || 0),
    0
  );

  const todayRevenue = ordersToday.reduce(
    (sum, o) => sum + Number(o.net || 0),
    0
  );

  /* ===============================
     STATS
     =============================== */
  const stats = [
    {
      title: "ยอดขายทั้งหมด",
      value: `฿${totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={22} />,
      color: "bg-success"
    },
    {
      title: "ยอดขายวันนี้",
      value: `฿${todayRevenue.toLocaleString()}`,
      icon: <Clock size={22} />,
      color: "bg-primary"
    },
    {
      title: "วันนี้ต้องจัดส่ง",
      value: ordersToday.length,
      icon: <Truck size={22} />,
      color: "bg-warning"
    },
    {
      title: "ออเดอร์ที่ต้องจัดการ",
      value: needActionOrders.length,
      icon: <ShoppingBag size={22} />,
      color: "bg-danger"
    }
  ];

  if (loading) {
    return <Loading text="กำลังโหลดแดชบอร์ดร้าน..." />;
  }


  return (
    <div className="admin-page-content py-4">
      <div className="container">

        {/* ===== Header ===== */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">แดชบอร์ดจัดการร้าน</h2>
            <p className="text-muted small">
              วันนี้มีออเดอร์ที่ต้องจัดการ {needActionOrders.length} รายการ
            </p>
          </div>

          <Link
            to="/admin/create"
            className="btn btn-danger rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm"
          >
            <PlusCircle size={18} />
            สร้างออเดอร์ใหม่
          </Link>
        </div>

        {/* ===== STATS ===== */}
        <div className="row g-4 mb-5">
          {stats.map((s, idx) => (
            <div className="col-md-3" key={idx}>
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted small fw-bold mb-1">
                      {s.title}
                    </p>
                    <h4 className="fw-bold mb-0">{s.value}</h4>
                  </div>
                  <div
                    className={`${s.color} bg-opacity-10 p-3 rounded-3`}
                  >
                    <span className="text-danger">{s.icon}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== ORDERS TO HANDLE ===== */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-white border-0 py-4 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">
              ออเดอร์ที่ต้องจัดการตอนนี้
            </h5>
            <Link
              to="/admin/orders"
              className="text-danger small fw-bold d-flex align-items-center gap-1"
            >
              ดูทั้งหมด <ChevronRight size={16} />
            </Link>
          </div>

          <div className="table-responsive px-4 pb-4">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th style={{minWidth:'150px'}}>ลูกค้า</th>
                  <th style={{minWidth:'200px'}}>สินค้า</th>
                  <th>สถานะ</th>
                  <th className="text-end">ยอดสุทธิ</th>
                </tr>
              </thead>
              <tbody>
                {needActionOrders.slice(0, 5).map((o) => (
                 <tr
                    key={o.orderId}
                    onClick={() => navigate(`/admin/order/${o.orderId}`)}
                    style={{ cursor: "pointer" }}
                    className="hover-row"
                  >
                    <td className="fw-bold text-muted">
                      #{o.orderId}
                    </td>

                    <td>{o.customerName}</td>

                    <td className="text-danger small fw-bold">
                      <Package size={14} /> {o.productName}
                    </td>

                    <td>
                      <span className="badge bg-warning bg-opacity-10 text-dark rounded-pill px-3 py-2">
                        {o.status}
                      </span>
                    </td>

                    <td className="text-end fw-bold">
                      ฿{Number(o.net).toLocaleString()}
                    </td>
                  </tr>

                ))}

                {needActionOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      🎉 ไม่มีออเดอร์ที่ต้องจัดการตอนนี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
