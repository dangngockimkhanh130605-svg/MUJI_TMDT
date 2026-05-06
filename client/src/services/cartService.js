import axios from "axios";

const API = "http://localhost:5001/api/cart";
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const getCart = () => axios.get(API, getHeaders());
export const addToCart = (data) => axios.post(API, data, getHeaders());
export const updateCartItem = (data) => axios.put(API, data, getHeaders());
export const removeFromCart = (itemId) => axios.delete(`${API}/${itemId}`, getHeaders());
export const clearCart = () => axios.delete(`${API}/clear`, getHeaders());