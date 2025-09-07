// contexts/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Cart Context
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    return storedCart;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItemToCart = (product) => {
    // Validate required fields before adding
    if (
      !product.product_id ||
      !product.name ||
      !product.image_url ||
      !product.price ||
      product.stock === undefined // Ensure stock is present
    ) {
      console.error('Incomplete product data:', product);
      return;
    }

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.product_id === product.product_id
      );
      if (existingProduct) {
        // If product already exists, you might want to increase quantity instead of doing nothing
        // For now, based on your original logic, it does nothing.
        // If you want to increase quantity for existing items:
        // return prevCart.map(item =>
        //   item.product_id === product.product_id
        //     ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
        //     : item
        // );
        return prevCart; // Don't duplicate, keep existing behavior for now
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeItemFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product_id !== productId)
    );
  };

  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product_id === productId) {
          // Ensure item.stock exists before comparing
          if (item.stock !== undefined && item.quantity < item.stock) {
            return { ...item, quantity: item.quantity + 1 };
          }
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const getCartItemCount = () => cart.length;

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItemToCart,
        removeItemFromCart,
        increaseQuantity,
        decreaseQuantity,
        getCartItemCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};