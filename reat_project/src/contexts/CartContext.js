import React, { createContext, useState, useContext } from 'react';

// Create Cart Context
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addItemToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.product_id === product.product_id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeItemFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.product_id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart((prevCart) => prevCart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) => prevCart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    ));
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, increaseQuantity, decreaseQuantity, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};











