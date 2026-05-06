import axios from "axios";

const API = "http://localhost:5001/api/products";

const getHeaders = () => ({
  headers: { Authorization: localStorage.getItem("token") }
});

export const getProducts = (params) => axios.get(API, { params }); // không cần token vì public
export const getProductById = (id) => axios.get(`${API}/${id}`);
export const createProduct = (data) => axios.post(API, data, getHeaders());
export const updateProduct = (id, data) => axios.put(`${API}/${id}`, data, getHeaders());
export const deleteProduct = (id) => axios.delete(`${API}/${id}`, getHeaders());