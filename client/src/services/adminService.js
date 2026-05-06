import axios from "axios";

const API = "http://localhost:5001/api/admin";

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }  // ✅ thêm Bearer
});

export const getDashboardStats = () => axios.get(`${API}/dashboard`, getHeaders());
export const getReportStats = () => axios.get(`${API}/reports`, getHeaders());