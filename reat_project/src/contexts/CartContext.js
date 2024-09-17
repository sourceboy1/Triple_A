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
    console.log('Adding to cart:', product); // Log the product data

    // Ensure product has necessary fields
    if (!product.product_id || !product.name || !product.image_url || !product.price) {
        console.error('Product data is incomplete:', product);
        return;
    }

    setCart((prevCart) => {
        const existingProductIndex = prevCart.findIndex(item => item.product_id === product.product_id);
        if (existingProductIndex !== -1) {
            const updatedCart = [...prevCart];
            updatedCart[existingProductIndex].quantity += 1;
            return updatedCart;
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

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, increaseQuantity, decreaseQuantity, getCartItemCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
