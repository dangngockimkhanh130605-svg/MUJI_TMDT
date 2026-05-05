import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "@/services/authService";
import { Search, ShoppingBag, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    email: "", password: "", phone: "", name: "",
    dob: "", gender: "Other", newsletter: true, agreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");   
    setSuccess("");

    if (!form.agreed) {
      setError("Bạn cần đồng ý với Terms and Conditions");
      setTimeout(() => setError(""), 5000);
      return;  
    }

    try {
      const res = await register({ ...form });
      setSuccess(res.data.msg);
      setTimeout(() => {
        setSuccess("");
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Có lỗi xảy ra");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <span
          className="text-xl font-bold tracking-widest cursor-pointer"
          onClick={() => navigate("/")}
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
        {/* LEFT - ảnh */}
        <div className="w-1/2 relative hidden md:block bg-gray-100">
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
            <p className="text-sm text-gray-600">
              Our products are born from a rational manufacturing process,
              prioritizing quality over brand names.
            </p>
          </div>
        </div>

        {/* RIGHT - form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-12 md:px-20 py-12 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-1" style={{ color: "#80001C" }}>
            Đăng ký
          </h2>
          <p className="text-sm text-gray-500 mb-8">Tạo tài khoản MUJI Online Store mới.</p>
          {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-300 text-green-700 text-sm px-4 py-3 mb-6">
                <span className="mt-0.5">✅</span>
                <span>{success}</span>
              </div>
            )}

          {/* Email */}
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gray-500"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          {/* Password */}
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mật khẩu</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500 pr-10"
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          {/* Phone */}
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Số điện thoại</label>
          <input
            type="tel"
            placeholder="Enter phone number"
            className="border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gray-500"
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />

          {/* Full Name */}
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Họ và tên</label>
          <input
            type="text"
            placeholder="Enter full name"
            className="border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gray-500"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          {/* Date of Birth */}
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ngày sinh</label>
          <input
            type="date"
            className="border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gray-500 text-gray-500"
            onChange={e => setForm({ ...form, dob: e.target.value })}
          />

          {/* Gender */}
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Giới tính</label>
          <select
            className="border border-gray-300 px-3 py-2 text-sm mb-6 focus:outline-none focus:border-gray-500 bg-white"
            onChange={e => setForm({ ...form, gender: e.target.value })}
          >
            <option>Other</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          {/* Checkboxes */}
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox" id="newsletter"
              checked={form.newsletter}
              className="w-4 h-4 accent-[#80001C]"
              onChange={e => setForm({ ...form, newsletter: e.target.checked })}
            />
            <label htmlFor="newsletter" className="text-sm text-gray-600">
              Sign up for newsletter (Optional)
            </label>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <input
              type="checkbox" id="agreed"
              checked={form.agreed}
              className="w-4 h-4 mt-0.5 accent-[#80001C]"
              onChange={e => setForm({ ...form, agreed: e.target.checked })}
            />
            <label htmlFor="agreed" className="text-sm text-gray-600">
              I am over 16 years old and agree with{" "}
              <span style={{ color: "#80001C" }} className="cursor-pointer hover:underline">
                Terms and Conditions
              </span>
            </label>
          </div>

          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            By proceeding to sign up, I acknowledge that I have read and consented to MUJI's
            Terms of Use and Privacy Policy.
          </p>

          {/* Buttons */}
          <button
            onClick={handleRegister}
            style={{ backgroundColor: "#80001C" }}
            className="text-white text-sm font-semibold tracking-widest py-3 mb-3 hover:opacity-90 transition"
          >
            TẠO TÀI KHOẢN
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{ borderColor: "#80001C", color: "#80001C" }}
            className="border text-sm font-semibold tracking-widest py-3 hover:bg-red-50 transition"
          >
            ĐĂNG NHẬP NGAY
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