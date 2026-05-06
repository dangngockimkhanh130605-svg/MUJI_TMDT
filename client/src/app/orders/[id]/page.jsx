import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById } from "@/services/orderService";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getOrderById(id).then(res => setOrder(res.data));
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#80001C" }}>
          <span className="text-white text-2xl">✓</span>
        </div>
        <h1 className="text-lg font-bold tracking-widest mb-2" style={{ color: "#80001C" }}>ĐẶT HÀNG THÀNH CÔNG!</h1>
        <p className="text-sm text-gray-500 mb-1">Cảm ơn bạn đã mua sắm tại MUJI Online Store.</p>
        {order && (
          <p className="text-xs text-gray-400 mb-8">Mã đơn hàng: <strong>{order.orderNumber}</strong></p>
        )}
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/orders")}
            className="text-white text-xs tracking-widest px-6 py-3 hover:opacity-90"
            style={{ backgroundColor: "#80001C" }}>XEM ĐƠN HÀNG</button>
          <button onClick={() => navigate("/products")}
            className="text-xs tracking-widest px-6 py-3 border border-gray-300 text-gray-600 hover:border-gray-500">
            TIẾP TỤC MUA SẮM
          </button>
        </div>
      </div>
    </div>
  );
}