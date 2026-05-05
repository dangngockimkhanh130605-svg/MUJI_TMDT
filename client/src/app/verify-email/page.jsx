import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    axios.get(`http://localhost:5001/api/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/login?verified=true"), 2000);
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-8">
        <h2 className="text-xl font-bold mb-4 tracking-widest" style={{ color: "#80001C" }}>
          MUJI
        </h2>

        {status === "loading" && (
          <div className="text-gray-600 text-sm mb-4">Đang xác nhận tài khoản...</div>
        )}
        {status === "success" && (
          <div className="text-green-600 text-sm mb-4">Xác nhận đăng ký thành công!</div>
        )}
        {status === "error" && (
          <div className="text-red-600 text-sm mb-4">Link hết hạn hoặc không hợp lệ.</div>
        )}

        <button
          onClick={() => navigate("/login")}
          className="text-sm underline"
          style={{ color: "#80001C" }}
        >
          Về trang đăng nhập
        </button>
      </div>
    </div>
  );
}