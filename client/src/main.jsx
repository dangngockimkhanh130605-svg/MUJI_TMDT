import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./index.css";
import VerifyEmail from "./app/verify-email/page";
import Home from "./app/page";
import Login from "./app/login/page";
import Register from "./app/register/page";
import AdminDashboard from "./app/admin/page";
import AdminProducts from "./app/admin/products/page";
import ProductList from "./app/products/page";
import ProductDetail from "./app/products/[id]/page";
import Cart from "./app/cart/page";
import Account from "./app/account/page";
import Checkout from "./app/checkout/page";
import Orders from "./app/orders/page";
import OrderSuccess from "./app/orders/[id]/page";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderSuccess />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);