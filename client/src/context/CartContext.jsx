import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity = 1, size = null) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id && i.size === size);
      if (exists) {
        return prev.map(i => i._id === product._id && i.size === size
          ? { ...i, quantity: i.quantity + quantity }
          : i
        );
      }
      return [...prev, { ...product, quantity, size }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(i => !(i._id === productId && i.size === size)));
  };

  const updateQuantity = (productId, size, quantity) => {
    setCart(prev => prev.map(i =>
      i._id === productId && i.size === size ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);