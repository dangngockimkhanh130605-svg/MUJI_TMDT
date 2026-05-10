import axios from "axios";

const API = "http://localhost:5001/api/admin";

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getDashboardStats = () => axios.get(`${API}/dashboard`, getHeaders());
export const getReportStats = () => axios.get(`${API}/reports`, getHeaders());
export const getAllOrders = () => axios.get("http://localhost:5001/api/orders/admin/all", getHeaders());
export const updateOrderStatus = (id, status) => axios.put(`http://localhost:5001/api/orders/admin/${id}/status`, { status }, getHeaders());