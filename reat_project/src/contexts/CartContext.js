import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Cart Context
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    return storedCart;
  });

  useEffect(() => {
    // Save cart items to localStorage whenever cart updates
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItemToCart = (product) => {
    setCart((prevCart) => {
      // Check if the product is already in the cart
      const isProductInCart = prevCart.some(item => item.product_id === product.product_id);
      if (isProductInCart) {
        // If the product is already in the cart, don't add it again
        return prevCart;
      }
      // If the product is not in the cart, add it with a default quantity of 1
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
    return cart.length; 
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, increaseQuantity, decreaseQuantity, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};
