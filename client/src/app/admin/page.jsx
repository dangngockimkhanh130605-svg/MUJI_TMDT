import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, User, TrendingUp, Package, BarChart2, AlertTriangle, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect } from "react";
import { getAllOrders, updateOrderStatus, getDashboardStats, getReportStats } from "@/services/adminService";

const revenueData = [
    { day: "MON", revenue: 32000 },
    { day: "TUE", revenue: 28000 },
    { day: "WED", revenue: 45000 },
    { day: "THU", revenue: 38000 },
    { day: "FRI", revenue: 52000 },
    { day: "SAT", revenue: 41000 },
    { day: "SUN", revenue: 35000 },
];

const transactions = [
    { id: "#MJ-92834", customer: "Takahashi Kenji", product: "Beads Sofa Set", date: "Oct 24, 2023", amount: "$159.00", status: "SHIPPED" },
    { id: "#MJ-92835", customer: "Sarah Williams", product: "PP Storage Box (L) x4", date: "Oct 24, 2023", amount: "$48.00", status: "PROCESSING" },
    { id: "#MJ-92836", customer: "Hiroshi Sato", product: "Aluminum Hanger Set", date: "Oct 23, 2023", amount: "$24.50", status: "DELIVERED" },
    { id: "#MJ-92837", customer: "Elena Petrova", product: "Face Towel (Navy) x6", date: "Oct 23, 2023", amount: "$36.00", status: "DELIVERED" },
];

const alerts = [
    { name: "OAK BED FRAME", stock: "2 UNITS LEFT" },
    { name: "COTTON T-SHIRT (M)", stock: "15 UNITS LEFT" },
    { name: "AROMATIC DIFFUSER", stock: "5 UNITS LEFT" },
];

const statusColor = {
    SHIPPED: "text-blue-600 bg-blue-50",
    PROCESSING: "text-[#80001C] bg-red-50",
    DELIVERED: "text-gray-500 bg-gray-100",
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activePage, setActivePage] = useState(searchParams.get("page") || "DASHBOARD");
    const [showDropdown, setShowDropdown] = useState(false);

    const renderContent = () => {
        if (activePage === "INVENTORY") return <InventoryPage />; 
        if (activePage === "REPORTS") return <ReportsPage />;
        if (activePage === "SETTINGS") return <SettingsPage />;
        if (activePage === "ORDERS") return <OrdersPage />;
        return <DashboardContent />;
    };

    useEffect(() => {
        const handler = () => setShowDropdown(false);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <span className="text-xl font-bold tracking-widest cursor-pointer" style={{ color: "#80001C" }}>MUJI</span>
                    <nav className="flex items-center gap-8 text-xs tracking-widest">
                        {/* DASHBOARD */}
                        <span
                            onClick={() => setActivePage("DASHBOARD")}
                            className={`cursor-pointer pb-1 transition ${activePage === "DASHBOARD"
                                ? "font-bold border-b-2 text-gray-900"
                                : "text-gray-400 hover:text-gray-700"
                                }`}
                            style={activePage === "DASHBOARD" ? { borderColor: "#80001C" } : {}}
                        >
                            DASHBOARD
                        </span>

                        {/* INVENTORY → navigate sang trang riêng */}
                        <span
                            onClick={() => navigate("/admin/products")}
                            className="cursor-pointer pb-1 text-gray-400 hover:text-gray-700 transition"
                        >
                            INVENTORY
                        </span>

                        {/* REPORTS */}
                        <span
                            onClick={() => setActivePage("REPORTS")}
                            className={`cursor-pointer pb-1 transition ${activePage === "REPORTS"
                                ? "font-bold border-b-2 text-gray-900"
                                : "text-gray-400 hover:text-gray-700"
                                }`}
                            style={activePage === "REPORTS" ? { borderColor: "#80001C" } : {}}
                        >
                            REPORTS
                        </span>

                        {/* SETTINGS */}
                        <span
                            onClick={() => setActivePage("SETTINGS")}
                            className={`cursor-pointer pb-1 transition ${activePage === "SETTINGS"
                                ? "font-bold border-b-2 text-gray-900"
                                : "text-gray-400 hover:text-gray-700"
                                }`}
                            style={activePage === "SETTINGS" ? { borderColor: "#80001C" } : {}}
                        >
                            SETTINGS
                        </span>

                        <span
                            onClick={() => setActivePage("ORDERS")}
                            className={`cursor-pointer pb-1 transition ${activePage === "ORDERS"
                                ? "font-bold border-b-2 text-gray-900"
                                : "text-gray-400 hover:text-gray-700"}`}
                            style={activePage === "ORDERS" ? { borderColor: "#80001C" } : {}}
                            >
                            ORDERS
                        </span>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                            className="flex items-center gap-2 text-xs text-gray-600"
                        >
                            <User size={16} strokeWidth={1.5} />
                            <span>Admin</span>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 top-8 bg-white shadow-lg w-40 z-50 border border-gray-100">
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        navigate("/login");
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex-1 px-8 py-8 max-w-6xl mx-auto w-full">
                {renderContent()}
            </div>
        </div>
    );
}

function DashboardContent() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        getDashboardStats().then(res => setStats(res.data)).catch(console.error);
    }, []);

    if (!stats) return <div className="text-center py-20 text-gray-400 text-sm">Đang tải...</div>;

    return (
        <>
            <div className="mb-6">
                <h1 className="text-sm font-semibold text-gray-700">Performance Summary</h1>
                <p className="text-xs text-gray-400 mt-1">Overview of MUJI store operational health.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: "TOTAL REVENUE", value: `${Number(stats.totalRevenue).toLocaleString("vi-VN")}đ`, sub: "Tổng doanh thu" },
                    { label: "ACTIVE ORDERS", value: stats.activeOrders, sub: `⏱ ${stats.pendingShipment} pending shipment` },
                    { label: "INVENTORY HEALTH", value: `${stats.lowStock.length === 0 ? "100%" : "Cần kiểm tra"}`, sub: `${stats.lowStock.length} sản phẩm sắp hết` },
                    { label: "STORE VISITORS", value: stats.totalUsers, sub: "Tổng khách hàng" },
                ].map((card, i) => (
                    <div key={i} className="bg-white border border-gray-200 p-5">
                        <p className="text-xs text-gray-400 tracking-widest mb-2">{card.label}</p>
                        <p className="text-xl font-semibold text-gray-800 mb-2">{card.value}</p>
                        <p className="text-xs text-gray-400">{card.sub}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="col-span-2 bg-white border border-gray-200 p-5">
                    <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">REVENUE TREND</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={stats.revenueChart}>
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip formatter={(v) => [`${Number(v).toLocaleString("vi-VN")}đ`, "Revenue"]} contentStyle={{ fontSize: 11 }} />
                            <Line type="monotone" dataKey="revenue" stroke="#80001C" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 p-5">
                    <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">INVENTORY ALERTS</p>
                    <div className="space-y-4">
                        {stats.lowStock.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-4">Tồn kho ổn định ✅</p>
                        ) : (
                            stats.lowStock.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-amber-50 flex items-center justify-center">
                                            <AlertTriangle size={14} className="text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700">{item.name.toUpperCase()}</p>
                                            <p className="text-xs text-gray-400">STOCK: {item.stock} UNITS LEFT</p>
                                        </div>
                                    </div>
                                    <button className="text-xs text-white px-2 py-1" style={{ backgroundColor: "#80001C" }}>
                                        REPLENISH
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white border border-gray-200 p-5">
                <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">RECENT TRANSACTIONS</p>
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {["ORDER ID", "CUSTOMER", "DATE", "AMOUNT", "STATUS"].map(h => (
                                <th key={h} className="text-left text-gray-400 tracking-widest pb-3 font-normal">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentOrders.map((t, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-3 text-gray-600">{t.orderNumber}</td>
                                <td className="py-3 text-gray-700">{t.user?.name || "—"}</td>
                                <td className="py-3 text-gray-400">{new Date(t.createdAt).toLocaleDateString("vi-VN")}</td>
                                <td className="py-3 font-semibold text-gray-800">{Number(t.total).toLocaleString("vi-VN")}đ</td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 text-xs tracking-wider ${statusColor[t.status.toUpperCase()] || "text-gray-500 bg-gray-100"}`}>
                                        {t.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function ReportsPage() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        getReportStats().then(res => setStats(res.data)).catch(console.error);
    }, []);

    if (!stats) return <div className="text-center py-20 text-gray-400 text-sm">Đang tải...</div>;

    return (
        <>
            <div className="mb-6">
                <h1 className="text-sm font-semibold text-gray-700">Reports</h1>
                <p className="text-xs text-gray-400 mt-1">Sales performance and analytics overview.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "TOTAL REVENUE (YTD)", value: `${Number(stats.ytd.totalRevenue).toLocaleString("vi-VN")}đ`, sub: "Năm nay" },
                    { label: "TOTAL ORDERS (YTD)", value: stats.ytd.totalOrders, sub: "Tổng đơn hàng" },
                    { label: "AVG ORDER VALUE", value: `${Number(stats.ytd.avgOrderValue || 0).toLocaleString("vi-VN")}đ`, sub: "Giá trị trung bình" },
                ].map((card, i) => (
                    <div key={i} className="bg-white border border-gray-200 p-5">
                        <p className="text-xs text-gray-400 tracking-widest mb-2">{card.label}</p>
                        <p className="text-xl font-semibold text-gray-800 mb-1">{card.value}</p>
                        <p className="text-xs text-gray-400">{card.sub}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-gray-200 p-5 mb-6">
                <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">MONTHLY REVENUE</p>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={stats.monthlyData}>
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip formatter={(v) => [`${Number(v).toLocaleString("vi-VN")}đ`, "Revenue"]} contentStyle={{ fontSize: 11 }} />
                        <Line type="monotone" dataKey="revenue" stroke="#80001C" strokeWidth={2} dot={{ fill: "#80001C", r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}

function SettingsPage() {
    const [settings, setSettings] = useState({
        storeName: "MUJI Online Store",
        email: "admin@muji.vn",
        currency: "VND",
        language: "Vietnamese",
        notifications: true,
        lowStockAlert: true,
        orderAlert: true,
        taxRate: "10",
        freeShippingThreshold: "500000",
    });

    const handleSave = () => alert("Đã lưu cài đặt!");

    return (
        <>
            <div className="mb-6">
                <h1 className="text-sm font-semibold text-gray-700">Settings</h1>
                <p className="text-xs text-gray-400 mt-1">Manage your store configuration.</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-5">
                    <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">STORE INFORMATION</p>
                    <div className="space-y-4">
                        {[
                            { label: "Store Name", key: "storeName" },
                            { label: "Admin Email", key: "email" },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{label}</label>
                                <input
                                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                                    value={settings[key]}
                                    onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                                />
                            </div>
                        ))}
                        {[
                            { label: "Currency", key: "currency", options: ["VND", "USD", "JPY"] },
                            { label: "Language", key: "language", options: ["Vietnamese", "English", "Japanese"] },
                        ].map(({ label, key, options }) => (
                            <div key={key}>
                                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{label}</label>
                                <select
                                    className="w-full border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none"
                                    value={settings[key]}
                                    onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                                >
                                    {options.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white border border-gray-200 p-5">
                    <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">NOTIFICATIONS</p>
                    <div className="space-y-4">
                        {[
                            { key: "notifications", label: "Enable All Notifications" },
                            { key: "lowStockAlert", label: "Low Stock Alerts" },
                            { key: "orderAlert", label: "New Order Alerts" },
                        ].map(item => (
                            <div key={item.key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{item.label}</span>
                                <button
                                    onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                                    className={`w-10 h-5 rounded-full transition relative ${settings[item.key] ? "bg-[#80001C]" : "bg-gray-200"}`}
                                >
                                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${settings[item.key] ? "left-5" : "left-0.5"}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <hr className="my-5 border-gray-100" />
                    <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">PRICING</p>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Tax Rate (%)</label>
                            <input type="number" className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                                value={settings.taxRate} onChange={e => setSettings({ ...settings, taxRate: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Free Shipping Threshold (VND)</label>
                            <input type="number" className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                                value={settings.freeShippingThreshold} onChange={e => setSettings({ ...settings, freeShippingThreshold: e.target.value })} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button onClick={handleSave} style={{ backgroundColor: "#80001C" }}
                    className="text-white text-xs tracking-widest px-8 py-3 hover:opacity-90 transition">
                    SAVE CHANGES
                </button>
            </div>
        </>
    );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const STATUS_OPTIONS = ["pending", "processing", "in_transit", "delivered", "cancelled"];
  const STATUS_LABEL = {
    pending: "Chờ xác nhận",
    processing: "Đang xử lý",
    in_transit: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã huỷ",
  };
  const STATUS_COLOR = {
    pending: "text-amber-600 bg-amber-50",
    processing: "text-blue-600 bg-blue-50",
    in_transit: "text-sky-600 bg-sky-50",
    delivered: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
  };

  useEffect(() => {
    getAllOrders().then(res => { setOrders(res.data); setLoading(false); });
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
  };

  if (loading) return <div className="text-center py-20 text-gray-400 text-sm">Đang tải...</div>;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-sm font-semibold text-gray-700">Quản lý đơn hàng</h1>
        <p className="text-xs text-gray-400 mt-1">Xem và cập nhật trạng thái đơn hàng.</p>
      </div>

      <div className="bg-white border border-gray-200">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Mã đơn", "Khách hàng", "Ngày đặt", "Tổng tiền", "Sản phẩm", "Trạng thái", "Cập nhật"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-gray-500 uppercase tracking-widest font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Chưa có đơn hàng nào</td></tr>
            )}
            {orders.map(order => (
              <tr key={order._id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">{order.orderNumber}</td>
                <td className="px-4 py-3 text-gray-600">
                  <p>{order.user?.name || "—"}</p>
                  <p className="text-gray-400">{order.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3 font-semibold" style={{ color: "#80001C" }}>
                  {Number(order.total).toLocaleString("vi-VN")}đ
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {order.items.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.image || "https://via.placeholder.com/30"}
                        alt={item.name} className="w-8 h-8 object-cover bg-gray-100" />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-400">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold ${STATUS_COLOR[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className="border border-gray-200 px-2 py-1 text-xs bg-white focus:outline-none"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
