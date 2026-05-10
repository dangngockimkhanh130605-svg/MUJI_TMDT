import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/orders`;
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const createOrder = (data) => axios.post(API, data, getHeaders());
export const getMyOrders = () => axios.get(API, getHeaders());
export const getOrderById = (id) => axios.get(`${API}/${id}`, getHeaders());