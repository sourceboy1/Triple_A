import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addItemToCart = (item) => {
    setCart((prevCart) => {
      console.log('Adding item to cart:', item);
      const itemIndex = prevCart.findIndex((i) => i.product_id === item.product_id);
      if (itemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[itemIndex].quantity = (updatedCart[itemIndex].quantity || 0) + item.quantity;
        return updatedCart;
      }
      return [...prevCart, { ...item, quantity: item.quantity || 1 }];
    });
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);










