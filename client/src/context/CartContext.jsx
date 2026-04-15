import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find(item => item.bookId === book.id);
      if (existing) {
        return prev.map(item => item.bookId === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { bookId: book.id, ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter(item => item.bookId !== bookId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
