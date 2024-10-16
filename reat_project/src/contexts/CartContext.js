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
    if (!product.product_id || !product.name || !product.image_url || !product.price || !product.stock) {
      console.error('Product data is incomplete:', product);
      return;
    }
  
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.product_id === product.product_id);
      if (existingProduct) {
        console.log('Product already in cart:', product);
        return prevCart; // Return the previous cart without any changes if the product is already in the cart
      }
      return [...prevCart, { ...product, quantity: 1 }];  // Add stock to cart item
    });
  };

  const removeItemFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.product_id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart((prevCart) => prevCart.map(item => {
      if (item.product_id === productId) {
        // Check if the current quantity is less than the available stock
        if (item.quantity < item.stock) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          console.log('Cannot add more. Stock limit reached.');
          return item; // Return the item unchanged if stock limit is reached
        }
      }
      return item;
    }));
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) => prevCart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    ));
  };

  const getCartItemCount = () => {
    // Return the count of unique items in the cart, not quantity
    return cart.length;
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
