import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api/admin";

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getDashboardStats = () => axios.get(`${API}/dashboard`, getHeaders());
export const getReportStats = () => axios.get(`${API}/reports`, getHeaders());
export const getAllOrders = () => axios.get(`${API}/orders/admin/all`, getHeaders());
export const updateOrderStatus = (id, status) => axios.put(`${API}/orders/admin/${id}/status`, { status }, getHeaders());