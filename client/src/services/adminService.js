import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDashboardStats = () =>
  axios.get(`${API}/api/admin/dashboard`, getHeaders());

export const getReportStats = () =>
  axios.get(`${API}/api/admin/reports`, getHeaders());

export const getAllOrders = () =>
  axios.get(`${API}/api/orders/admin/all`, getHeaders());

export const updateOrderStatus = (id, status) =>
  axios.put(
    `${API}/api/orders/admin/${id}/status`,
    { status },
    getHeaders()
  );import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDashboardStats = () =>
  axios.get(`${API}/api/admin/dashboard`, getHeaders());

export const getReportStats = () =>
  axios.get(`${API}/api/admin/reports`, getHeaders());

export const getAllOrders = () =>
  axios.get(`${API}/api/orders/admin/all`, getHeaders());

export const updateOrderStatus = (id, status) =>
  axios.put(
    `${API}/api/orders/admin/${id}/status`,
    { status },
    getHeaders()
  );