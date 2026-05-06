import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User } from "lucide-react";
import { getMyOrders } from "@/services/orderService";

export default function Account() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) {
            navigate("/login");
        } else {
            setUser(userData);
            setFormData(userData);
        }

        getMyOrders()
            .then(res => {
                setOrders(res.data);
                setLoadingOrders(false);
            })
            .catch(err => {
                console.error("Lỗi lấy orders:", err);
                setLoadingOrders(false);
            });
    }, [navigate]);

    const handleSave = () => {
        localStorage.setItem("user", JSON.stringify(formData));
        setUser(formData);
        setIsEditing(false);
        alert("Thông tin đã được cập nhật!");
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>;

    return (
        <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#333]">
            {/* NAVBAR */}
            <header className="bg-white flex items-center justify-between px-12 py-5 border-b border-gray-100">
                <span onClick={() => navigate("/home")} className="text-2xl font-bold tracking-[0.2em] cursor-pointer text-[#80001C]">MUJI</span>
                <nav className="hidden md:flex items-center gap-10 text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase">
                    {["apparel", "household", "food", "furniture"].map(cat => (
                        <span key={cat} onClick={() => navigate(`/products?category=${cat}`)} className="cursor-pointer hover:text-black">{cat}</span>
                    ))}
                </nav>
                <div className="flex items-center gap-6">
                    <Search size={18} className="cursor-pointer" />
                    <ShoppingBag size={18} className="cursor-pointer" onClick={() => navigate("/cart")} />
                    <User size={18} className="cursor-pointer text-[#80001C]" onClick={() => setShowDropdown(!showDropdown)} />
                </div>
            </header>

            <div className="flex max-w-[1400px] mx-auto min-h-[calc(100vh-80px)]">
                {/* SIDEBAR */}
                <aside className="w-64 border-r border-gray-200 p-10 hidden lg:block bg-white">
                    <h2 className="text-[12px] font-black tracking-widest text-[#80001C] mb-8 uppercase">My Account</h2>
                    <nav className="flex flex-col gap-5 text-[10px] font-bold tracking-widest uppercase">
                        <span
                            onClick={() => setActiveTab("overview")}
                            className={`cursor-pointer transition ${activeTab === "overview" ? "text-black" : "text-gray-400 hover:text-black"}`}
                        >Overview</span>
                        <span
                            onClick={() => setActiveTab("orders")}
                            className={`cursor-pointer transition ${activeTab === "orders" ? "text-black" : "text-gray-400 hover:text-black"}`}
                        >Orders</span>
                        <div className="h-[1px] bg-gray-100 my-4"></div>
                        <span className="text-gray-400 hover:text-black cursor-pointer" onClick={() => { localStorage.clear(); navigate("/login"); }}>Sign Out</span>
                    </nav>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-12">
                    {activeTab === "overview" ? (
                        <div>
                            <div className="mb-10">
                                <h1 className="text-3xl font-medium mb-2">Welcome back, {user.fullName?.split(' ')[0] || "User"}.</h1>
                                <p className="text-sm text-gray-500">Manage your MUJI account and track your latest activity.</p>
                            </div>

                            <div className="grid grid-cols-12 gap-8">
                                {/* PROFILE CARD */}
                                <div className="col-span-12 lg:col-span-4">
                                    <div className="bg-white p-8 border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-sm text-gray-300"><User size={30} /></div>
                                            <div>
                                                <h3 className="font-bold text-sm uppercase tracking-wider">{user.fullName || "User Name"}</h3>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Member since 2026</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4 mb-8">
                                            <div className="flex flex-col border-b border-gray-50 pb-2">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email</span>
                                                <span className="text-xs mt-1">{user.email}</span>
                                            </div>
                                            <div className="flex flex-col border-b border-gray-50 pb-2">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                                                <span className="text-xs mt-1">{user.phone || "Not updated"}</span>
                                            </div>
                                            <div className="flex flex-col border-b border-gray-50 pb-2">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Default Address</span>
                                                <span className="text-xs mt-1 leading-relaxed">{user.address || "No address added yet"}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsEditing(true)} className="w-full border border-gray-300 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all">Edit Profile</button>
                                    </div>
                                </div>

                                {/* LATEST ACTIVITY */}
                                <div className="col-span-12 lg:col-span-8">
                                    <div className="bg-white border border-gray-100 shadow-sm p-8 mb-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-[10px] font-bold tracking-widest uppercase">Latest Activity</h3>
                                            {orders[0] && (
                                                <span className="text-[10px] font-bold text-[#80001C] tracking-widest uppercase">
                                                    {orders[0].status}
                                                </span>
                                            )}
                                        </div>

                                        {loadingOrders ? (
                                            <p className="text-xs text-gray-400">Đang tải...</p>
                                        ) : orders.length === 0 ? (
                                            <p className="text-xs text-gray-400">Chưa có đơn hàng nào.</p>
                                        ) : (
                                            <div className="flex gap-6 py-4">
                                                <img
                                                    src={orders[0].items?.[0]?.image || "https://via.placeholder.com/64"}
                                                    alt="p"
                                                    className="w-16 h-16 object-cover bg-gray-50"
                                                />
                                                <div>
                                                    <h4 className="text-sm font-bold">{orders[0].items?.[0]?.name}</h4>
                                                    <p className="text-[11px] text-gray-400 mt-1">Order #{orders[0].orderNumber}</p>
                                                </div>
                                            </div>
                                        )}

                                        <button onClick={() => setActiveTab("orders")} className="mt-4 text-[10px] font-bold tracking-widest uppercase border-b border-black pb-1">
                                            View all orders
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ORDER HISTORY */
                        <div>
                            <h1 className="text-2xl font-medium mb-8">Order History</h1>
                            {loadingOrders ? (
                                <p className="text-xs text-gray-400">Đang tải đơn hàng...</p>
                            ) : orders.length === 0 ? (
                                <p className="text-xs text-gray-400">Chưa có đơn hàng nào.</p>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order._id} className="bg-white border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-16 h-16 bg-gray-50 p-2">
                                                    <img
                                                        src={order.items?.[0]?.image || "https://via.placeholder.com/64"}
                                                        alt="p"
                                                        className="mix-blend-multiply w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">#{order.orderNumber}</p>
                                                    <h4 className="text-sm font-bold">{order.items?.[0]?.name}</h4>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold mb-1">
                                                    {Number(order.total).toLocaleString("vi-VN")} VND
                                                </p>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                                    order.status === "delivered" ? "text-green-600" : "text-[#80001C]"
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* MODAL EDIT */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-[2px]">
                    <div className="bg-white p-10 max-w-lg w-full shadow-2xl mx-4">
                        <h2 className="text-xl font-bold mb-8 text-[#80001C] tracking-widest uppercase">Update Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                                <input className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#80001C] text-sm"
                                    value={formData.fullName || ""} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                                <input className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#80001C] text-sm"
                                    value={formData.phone || ""} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Address</label>
                                <textarea className="w-full border border-gray-100 p-3 mt-2 outline-none focus:border-[#80001C] text-sm min-h-[100px] bg-gray-50"
                                    value={formData.address || ""} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-10">
                            <button onClick={handleSave} className="flex-1 bg-[#80001C] text-white py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-red-900 transition">Save Changes</button>
                            <button onClick={() => setIsEditing(false)} className="flex-1 border border-gray-300 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="bg-white py-12 text-center border-t border-gray-100">
                <div className="flex flex-wrap justify-center gap-10 text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4 uppercase">
                    <span>Store Locator</span><span>About MUJI</span><span>Sustainability</span><span>Contact Us</span>
                </div>
                <div className="text-[10px] text-gray-300 tracking-widest uppercase">© RYOHIN KEIKAKU CO., LTD.</div>
            </footer>
        </div>
    );
}