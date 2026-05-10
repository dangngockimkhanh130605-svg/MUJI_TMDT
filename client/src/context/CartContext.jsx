import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart as addToCartService } from "@/services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setCartCount(0);
    try {
      const res = await getCart();
      const total = res.data.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

   const addToCart = async (data) => { 
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Chưa đăng nhập");
    await addToCartService(data);
    await refreshCart();
  };

  useEffect(() => { refreshCart(); }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);