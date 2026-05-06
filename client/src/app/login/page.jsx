import { useState } from "react";
import { login } from "@/services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ShoppingBag, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verified = searchParams.get("verified");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const role = res.data.user.role;
      navigate(role === "admin" ? "/admin/products" : "/home");
    } catch (err) {
      setError(err.response?.data?.msg || "Sai email hoặc mật khẩu");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <span
          className="text-xl font-bold tracking-widest"
          style={{ color: "#80001C" }}
        >
          MUJI
        </span>
        <div className="flex items-center gap-4">
          <button><Search size={20} style={{ color: "#80001C" }} strokeWidth={1.5} /></button>
          <button><ShoppingBag size={20} style={{ color: "#80001C" }} strokeWidth={1.5} /></button>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT */}
        <div className="w-1/2 relative bg-gray-100 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1600369671738-58f5a1c7b4ba?w=800"
            alt="MUJI"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/20" />
          <div className="absolute bottom-10 left-10 right-10 z-10">
            <h2 className="text-3xl font-bold text-gray-800 leading-tight mb-2">
              Lower priced for a reason.
            </h2>
            <p className="text-sm text-gray-500">
              Our products are born from a rational manufacturing process,
              prioritizing quality over brand names.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-12 md:px-20 py-12">

          {/* ✅ Thông báo verify — phải nằm TRONG return */}
          {verified && (
            <div className="bg-green-50 border border-green-300 text-green-700 text-sm px-4 py-3 mb-6">
              Xác nhận email thành công! Bạn có thể đăng nhập ngay.
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">
              <span className="text-red-500 text-base mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <h2 style={{ color: "#80001C" }} className="text-2xl font-bold mb-1">
            Đăng nhập
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Chào mừng bạn quay lại với MUJI Online Store.
          </p>

          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
          <input
            type="email"
            placeholder="example@muji.vn"
            className="border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gray-500"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mật khẩu</label>
            <span className="text-xs cursor-pointer hover:underline" style={{ color: "#80001C" }}>QUÊN?</span>
          </div>
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500 pr-10"
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <button
            onClick={handleLogin}
            style={{ backgroundColor: "#80001C" }}
            className="text-white text-sm font-semibold tracking-widest py-3 mb-3 hover:opacity-90 transition"
          >
            ĐĂNG NHẬP
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{ borderColor: "#80001C", color: "#80001C" }}
            className="border text-sm font-semibold tracking-widest py-3 hover:bg-gray-50 transition"
          >
            TẠO TÀI KHOẢN MỚI
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#f5f0eb] py-6 text-center text-xs text-gray-400 space-x-6">
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