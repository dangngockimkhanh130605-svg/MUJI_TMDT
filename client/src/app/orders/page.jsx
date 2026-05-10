import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User } from "lucide-react";
import { getMyOrders } from "@/services/orderService";

const STATUS_COLOR = {
  pending: "text-amber-600 bg-amber-50",
  processing: "text-blue-600 bg-blue-50",
  in_transit: "text-sky-600 bg-sky-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
};

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  in_transit: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã huỷ",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    getMyOrders().then(res => { setOrders(res.data); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Đang tải...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-40">
        <span onClick={() => navigate("/home")} className="text-xl font-bold tracking-widest cursor-pointer" style={{ color: "#80001C" }}>MUJI</span>
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest text-gray-600">
          {["apparel", "household", "food", "furniture"].map(cat => (
            <span key={cat} onClick={() => navigate(`/products?category=${cat}`)}
              className="cursor-pointer hover:text-gray-900 uppercase">{cat}</span>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/products")}><Search size={20} style={{ color: "#80001C" }} strokeWidth={1.5} /></button>
          <button onClick={() => navigate("/cart")}><ShoppingBag size={20} style={{ color: "#80001C" }} strokeWidth={1.5} /></button>
          <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}>
                    <User size={20} style={{ color: "#80001C" }} strokeWidth={1.5} />
                </button>
                {showDropdown && (
                    <div className="absolute right-0 top-8 bg-white shadow-lg w-48 z-50 border border-gray-100">
                    {[
                        { label: "Account Information", path: "/account" },
                        { label: "My Orders", path: "/orders" },
                    ].map(item => (
                        <button key={item.path} onClick={() => { navigate(item.path); setShowDropdown(false); }}
                        className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left">
                        {item.label}
                        </button>
                    ))}
                    <div className="border-t border-gray-100">
                        <button onClick={() => { localStorage.clear(); navigate("/login"); }}
                        className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left">
                        Logout
                        </button>
                    </div>
                    </div>
                )}
            </div>
        </div>
      </header>

      <div className="flex-1 px-8 py-8 max-w-4xl mx-auto w-full">
        <h1 className="text-sm font-bold tracking-widest mb-8 uppercase">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm mb-6">Bạn chưa có đơn hàng nào</p>
            <button onClick={() => navigate("/products")}
              className="text-white text-xs tracking-widest px-8 py-3"
              style={{ backgroundColor: "#80001C" }}>BẮT ĐẦU MUA SẮM</button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-semibold px-3 py-1 ${STATUS_COLOR[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#80001C" }}>
                      {Number(order.total).toLocaleString("vi-VN")} VND
                    </span>
                    <button onClick={() => setSelected(selected?._id === order._id ? null : order)}
                      className="text-xs text-gray-400 hover:text-gray-700 tracking-widest underline">
                      {selected?._id === order._id ? "ẨN" : "CHI TIẾT"}
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 flex gap-2">
                  {order.items.slice(0, 4).map((item, i) => (
                    <img key={i} src={item.image || "https://via.placeholder.com/60"} alt={item.name}
                      className="w-14 h-14 object-cover bg-gray-100" />
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-14 h-14 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                {selected?._id === order._id && (
                  <div className="border-t border-gray-100 px-6 py-4">
                    <div className="space-y-3 mb-6">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <img src={item.image || "https://via.placeholder.com/60"} alt={item.name}
                            className="w-16 h-16 object-cover bg-gray-100" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{item.name}</p>
                            {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                            <p className="text-xs text-gray-400">x{item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: "#80001C" }}>
                            {Number(item.price * item.quantity).toLocaleString("vi-VN")} VND
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-xs text-gray-500">
                      <div>
                        <p className="text-xs font-bold tracking-widest text-gray-700 mb-2">ĐỊA CHỈ GIAO HÀNG</p>
                        <p>{order.shippingInfo?.firstName} {order.shippingInfo?.lastName}</p>
                        <p>{order.shippingInfo?.phone}</p>
                        <p>{order.shippingInfo?.address}</p>
                        <p>{order.shippingInfo?.city}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-widest text-gray-700 mb-2">CHI TIẾT THANH TOÁN</p>
                        <div className="space-y-1">
                          <div className="flex justify-between"><span>Subtotal</span><span>{Number(order.subtotal).toLocaleString("vi-VN")} VND</span></div>
                          <div className="flex justify-between"><span>Shipping</span><span>{order.shippingFee === 0 ? "FREE" : `${Number(order.shippingFee).toLocaleString("vi-VN")} VND`}</span></div>
                          <div className="flex justify-between"><span>VAT</span><span>{Number(order.vat).toLocaleString("vi-VN")} VND</span></div>
                          <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
                            <span>TOTAL</span><span style={{ color: "#80001C" }}>{Number(order.total).toLocaleString("vi-VN")} VND</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-[#f5f0eb] py-6 text-center text-xs text-gray-400 border-t border-gray-200 mt-8">
        © RYOHIN KEIKAKU CO., LTD.
      </footer>
    </div>
  );
}