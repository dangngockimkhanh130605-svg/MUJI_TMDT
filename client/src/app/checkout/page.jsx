import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User } from "lucide-react";
import { getCart } from "@/services/cartService";
import { createOrder } from "@/services/orderService";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        address: "", city: "", province: "", postalCode: "",
        paymentMethod: "credit_card",
    });
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const { refreshCart } = useCart();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        getCart().then(res => {
            console.log("🛒 Cart response:", JSON.stringify(res.data, null, 2));
            
            // Sau populate, items.product là object chứa toàn bộ thông tin
            const rawItems = res.data?.items || [];
            const formattedItems = rawItems.map(item => ({
                product: item.product?._id || item.product,
                name: item.name || item.product?.name,
                image: item.image || item.product?.images?.[0] || "",
                price: item.price || item.product?.price,
                quantity: item.quantity,
                size: item.size,
            }));

            setCart({ items: formattedItems });
            setLoading(false);
        }).catch(err => {
            console.error("❌ Cart lỗi:", err);
            setLoading(false);
        });
    }, []);

    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const vat = Math.round(subtotal * 0.1);
    const total = subtotal + shippingFee + vat;

    const handleSubmit = async () => {
        if (!form.firstName || !form.phone || !form.address || !form.city)
            return alert("Vui lòng điền đầy đủ thông tin giao hàng");

        if (cart.items.length === 0)
            return alert("Giỏ hàng trống! Vui lòng thêm sản phẩm.");

        setSubmitting(true);
        try {
            const orderData = {
                shippingAddress: {
                    fullName: `${form.firstName} ${form.lastName}`.trim(),
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                },
                paymentMethod: form.paymentMethod,
            };

            console.log("📦 orderData gửi đi:", JSON.stringify(orderData, null, 2));
            await createOrder(orderData);
            await refreshCart();
            alert("Đặt hàng thành công!");
            navigate("/account");

        } catch (error) {
            console.error("❌ Lỗi full:", error.response?.data);
            alert("Đặt hàng thất bại: " + (error.response?.data?.message || JSON.stringify(error.response?.data)));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Đang tải...</div>;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* NAVBAR */}
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
                                🚪 Logout
                                </button>
                            </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* STEPS */}
            <div className="flex items-center justify-center gap-8 py-6 border-b border-gray-100">
                {[{ n: 1, label: "SHIPPING" }, { n: 2, label: "PAYMENT" }, { n: 3, label: "REVIEW" }].map(s => (
                    <div key={s.n} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.n ? "text-white" : "text-gray-300 border border-gray-300"}`}
                            style={step >= s.n ? { backgroundColor: "#80001C" } : {}}>
                            {s.n}
                        </div>
                        <span className={`text-xs tracking-widest ${step >= s.n ? "text-gray-800 font-semibold" : "text-gray-300"}`}>{s.label}</span>
                        {s.n < 3 && <div className={`w-16 h-px mx-2 ${step > s.n ? "bg-gray-400" : "bg-gray-200"}`} />}
                    </div>
                ))}
            </div>

            <div className="flex-1 px-8 py-8 max-w-5xl mx-auto w-full">
                <div className="flex gap-8">
                    {/* LEFT - Form */}
                    <div className="flex-1">
                        {/* Shipping Info */}
                        <div className="mb-8">
                            <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">SHIPPING INFORMATION</p>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                {[
                                    { key: "firstName", placeholder: "Enter first name", label: "FIRST NAME", col: 1 },
                                    { key: "lastName", placeholder: "Enter last name", label: "LAST NAME", col: 1 },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{f.label}</label>
                                        <input placeholder={f.placeholder} value={form[f.key]}
                                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
                                    </div>
                                ))}
                            </div>
                            {[
                                { key: "email", placeholder: "example@email.com", label: "EMAIL ADDRESS" },
                                { key: "phone", placeholder: "000-000-0000", label: "PHONE NUMBER" },
                            ].map(f => (
                                <div key={f.key} className="mb-3">
                                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{f.label}</label>
                                    <input placeholder={f.placeholder} value={form[f.key]}
                                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
                                </div>
                            ))}
                            <div className="mb-3">
                                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">SHIPPING ADDRESS</label>
                                <input placeholder="Street address" value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 mb-2" />
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: "city", placeholder: "City" },
                                        { key: "province", placeholder: "Province" },
                                        { key: "postalCode", placeholder: "Postal Code" },
                                    ].map(f => (
                                        <input key={f.key} placeholder={f.placeholder} value={form[f.key]}
                                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                            className="border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-gray-400" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">PAYMENT METHOD</p>
                            <div className="flex gap-3">
                                {[
                                    { value: "credit_card", label: "CREDIT CARD", icon: "💳" },
                                    { value: "momo", label: "MOMO / E-WALLET", icon: "📱" },
                                    { value: "cod", label: "COD", icon: "💵" },
                                ].map(opt => (
                                    <label key={opt.value}
                                        className={`flex items-center gap-2 border px-4 py-3 cursor-pointer flex-1 text-xs font-semibold tracking-wider transition ${form.paymentMethod === opt.value ? "border-gray-800 text-gray-800" : "border-gray-200 text-gray-400 hover:border-gray-400"}`}>
                                        <input type="radio" name="paymentMethod" value={opt.value}
                                            checked={form.paymentMethod === opt.value}
                                            onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                                            className="accent-[#80001C]" />
                                        {opt.icon} {opt.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - Order Summary */}
                    <div className="w-72 shrink-0">
                        <div className="border border-gray-200 p-6">
                            <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">ORDER SUMMARY</p>
                            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                {cart.items.map(item => (
                                    <div key={item._id} className="flex gap-3">
                                        <img src={item.image || "https://via.placeholder.com/50"} alt={item.name}
                                            className="w-14 h-14 object-cover bg-gray-100 shrink-0" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-700 uppercase">{item.name}</p>
                                            {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                                            <p className="text-xs font-semibold mt-1" style={{ color: "#80001C" }}>
                                                {Number(item.price).toLocaleString("vi-VN")} VND
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-500">
                                <div className="flex justify-between"><span>Subtotal</span><span>{Number(subtotal).toLocaleString("vi-VN")} VND</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "FREE" : `${Number(shippingFee).toLocaleString("vi-VN")} VND`}</span></div>
                                <div className="flex justify-between"><span>VAT (10%)</span><span>{Number(vat).toLocaleString("vi-VN")} VND</span></div>
                                <div className="flex justify-between font-bold text-sm text-gray-800 pt-2 border-t border-gray-100">
                                    <span>TOTAL</span>
                                    <span style={{ color: "#80001C" }}>{Number(total).toLocaleString("vi-VN")} VND</span>
                                </div>
                            </div>

                            <button onClick={handleSubmit} disabled={submitting}
                                className="w-full text-white text-xs font-semibold tracking-widest py-4 mt-4 hover:opacity-90 transition disabled:opacity-50"
                                style={{ backgroundColor: "#80001C" }}>
                                {submitting ? "ĐANG ĐẶT HÀNG..." : "COMPLETE ORDER"}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-2">
                                BY CLICKING, YOU AGREE TO OUR TERMS OF SERVICE & PRIVACY POLICY
                            </p>

                            <div className="mt-4 border border-gray-100 p-3 flex items-start gap-2">
                                <span className="text-green-600">🔒</span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-700">MUJI SECURE CHECKOUT</p>
                                    <p className="text-xs text-gray-400 mt-1">Your transaction is protected by 256-bit SSL encryption. We do not store your full card details.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-[#f5f0eb] py-6 text-center text-xs text-gray-400 border-t border-gray-200 mt-8 space-x-6">
                <span className="cursor-pointer hover:underline">STORE LOCATOR</span>
                <span className="cursor-pointer hover:underline">ABOUT MUJI</span>
                <span className="cursor-pointer hover:underline">SUSTAINABILITY</span>
                <span className="cursor-pointer hover:underline">CONTACT US</span>
                <span className="cursor-pointer hover:underline">PRIVACY POLICY</span>
                <div className="mt-2">© RYOHIN KEIKAKU CO., LTD.</div>
            </footer>
        </div>
    );
}