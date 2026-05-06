import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
          <span
            className="text-xl font-bold tracking-widest cursor-pointer"
            onClick={() => navigate("/home")}
            style={{ color: "#80001C" }}
          >
            MUJI
          </span>
          <button
            onClick={() => navigate("/home")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Quay lại
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#80001C" }}>
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng</p>
            <button
              onClick={() => navigate("/products")}
              style={{ backgroundColor: "#80001C" }}
              className="text-white px-6 py-2 rounded hover:opacity-90 transition"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <span
          className="text-xl font-bold tracking-widest cursor-pointer"
          onClick={() => navigate("/home")}
          style={{ color: "#80001C" }}
        >
          MUJI
        </span>
        <h1 className="text-2xl font-bold">Giỏ hàng</h1>
        <button
          onClick={() => navigate("/home")}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Quay lại
        </button>
      </header>

      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Danh sách sản phẩm */}
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div
                key={`${item._id}-${item.size}`}
                className="flex items-center gap-4 border border-gray-200 p-4 rounded"
              >
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/100"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  {item.size && (
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  )}
                  <p style={{ color: "#80001C" }} className="font-bold">
                    {item.price?.toLocaleString("vi-VN")} VND
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border border-gray-300 rounded">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))
                    }
                    className="p-1 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 py-1 text-sm">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.size, item.quantity + 1)
                    }
                    className="p-1 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="font-semibold w-32 text-right">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                </p>

                <button
                  onClick={() => removeFromCart(item._id, item.size)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Tóm tắt */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Tổng cộng:</span>
              <span style={{ color: "#80001C" }}>
                {total?.toLocaleString("vi-VN")} VND
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="flex-1 border border-gray-300 py-3 rounded hover:bg-gray-50"
              >
                Xóa giỏ hàng
              </button>
              <button
                onClick={() => navigate("/checkout")}
                style={{ backgroundColor: "#80001C" }}
                className="flex-1 text-white py-3 rounded hover:opacity-90 transition font-semibold"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}