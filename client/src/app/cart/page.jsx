import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Minus, Plus, X } from "lucide-react";
import { getCart, updateCartItem, removeFromCart } from "@/services/cartService";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const { cartCount, refreshCart } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    fetchCart();
  }, []);

    useEffect(() => {
        const handler = () => setShowDropdown(false);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data || { items: [] });
    } catch {
      setCart({ items: [] });
    }
    setLoading(false);
  };

  const handleQuantity = async (itemId, quantity) => {
    await updateCartItem({ itemId, quantity });
    fetchCart();
    refreshCart();
  };

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
    fetchCart();
    refreshCart();
  };

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + shippingFee + vat;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Đang tải...</div>
  );

  return (
    <div className="min-h-screen flex flex-col">
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
          <button onClick={() => navigate("/cart")} className="relative">
            <ShoppingBag size={20} style={{ color: "#80001C" }} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                style={{ backgroundColor: "#80001C", fontSize: "10px" }}>
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
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

      <div className="flex-1 px-8 py-8">
        <h1 className="text-sm font-bold tracking-widest mb-8 uppercase">Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm mb-6">Giỏ hàng của bạn đang trống</p>
            <button onClick={() => navigate("/products")}
              className="text-white text-xs tracking-widest px-8 py-3 hover:opacity-90"
              style={{ backgroundColor: "#80001C" }}>
              TIẾP TỤC MUA SẮM
            </button>
          </div>
        ) : (
          <div className="flex gap-8">
            {/* LEFT - Cart Items */}
            <div className="flex-1">
              <div className="grid grid-cols-12 text-xs text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-200">
                <span className="col-span-6">Product Details</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-center">Price</span>
                <span className="col-span-2 text-center">Total</span>
              </div>

              {cart.items.map(item => (
                <div key={item._id} className="grid grid-cols-12 items-center py-6 border-b border-gray-100">
                  <div className="col-span-6 flex gap-4">
                    <img src={item.image || "https://via.placeholder.com/80"} alt={item.name}
                      className="w-20 h-20 object-cover bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/products/${item.product}`)} />
                    <div>
                      <p className="text-sm font-medium text-gray-800 mb-1">{item.name}</p>
                      {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                      <button onClick={() => handleRemove(item._id)}
                        className="text-xs text-gray-400 hover:text-red-500 mt-2 flex items-center gap-1">
                        <X size={12} /> REMOVE
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center justify-center gap-2 border border-gray-200 w-fit mx-auto">
                    <button onClick={() => handleQuantity(item._id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-50">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm w-6 text-center">{String(item.quantity).padStart(2, "0")}</span>
                    <button onClick={() => handleQuantity(item._id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-50">
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="col-span-2 text-center text-sm text-gray-600">
                    ₫{Number(item.price).toLocaleString("vi-VN")}
                  </div>
                  <div className="col-span-2 text-center text-sm font-semibold" style={{ color: "#80001C" }}>
                    ₫{Number(item.price * item.quantity).toLocaleString("vi-VN")}
                  </div>
                </div>
              ))}

              {shippingFee === 0 ? (
                <div className="mt-4 flex items-center gap-3 border border-gray-200 px-4 py-3 text-xs text-gray-500">
                  🚚 FREE STANDARD SHIPPING — Estimated arrival: 3-5 business days.
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3 border border-gray-200 px-4 py-3 text-xs text-gray-500">
                  🚚 Mua thêm <strong>₫{Number(500000 - subtotal).toLocaleString("vi-VN")}</strong> để được miễn phí vận chuyển!
                </div>
              )}
            </div>

            {/* RIGHT - Order Summary */}
            <div className="w-72 shrink-0">
              <div className="border border-gray-200 p-6 bg-white">
                <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">ORDER SUMMARY</p>
                {cart.items.map(item => (
                  <div key={item._id} className="flex gap-3 mb-4">
                    <img src={item.image || "https://via.placeholder.com/50"} alt={item.name}
                      className="w-14 h-14 object-cover bg-gray-100" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">{item.name.toUpperCase()}</p>
                      {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                      <p className="text-xs font-semibold mt-1" style={{ color: "#80001C" }}>
                        ₫{Number(item.price).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-500">
                  <div className="flex justify-between"><span>Subtotal</span><span>₫{Number(subtotal).toLocaleString("vi-VN")}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "FREE" : `₫${Number(shippingFee).toLocaleString("vi-VN")}`}</span></div>
                  <div className="flex justify-between"><span>VAT (10%)</span><span>₫{Number(vat).toLocaleString("vi-VN")}</span></div>
                  <div className="flex justify-between font-bold text-sm text-gray-800 pt-2 border-t border-gray-100">
                    <span>TOTAL</span>
                    <span style={{ color: "#80001C" }}>₫{Number(total).toLocaleString("vi-VN")}</span>
                  </div>
                </div>

                <button onClick={() => navigate("/checkout")}
                  className="w-full text-white text-xs font-semibold tracking-widest py-4 mt-4 hover:opacity-90 transition"
                  style={{ backgroundColor: "#80001C" }}>
                  PROCEED TO CHECKOUT
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  🔒 SECURE CHECKOUT WITH SSL ENCRYPTION
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-[#f5f0eb] py-6 text-center text-xs text-gray-400 space-x-6 border-t border-gray-200 mt-8">
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