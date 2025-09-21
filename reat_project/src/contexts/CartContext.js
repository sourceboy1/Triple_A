import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../Api';

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

  const updateCartItemDetails = useCallback((productId, newDetails) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product_id === productId ? { ...item, ...newDetails } : item
      )
    );
  }, []);

  const addItemToCart = useCallback((product) => {
    if (
      !product.product_id ||
      !product.name ||
      !product.image_url ||
      product.price === undefined ||
      product.stock === undefined
    ) {
      console.error('Incomplete product data:', product);
      return;
    }

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.product_id === product.product_id
      );

      if (existingProduct) {
        // Do nothing if the product is already in the cart
        return prevCart;
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItemFromCart = useCallback((productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product_id !== productId)
    );
  }, []);

  const increaseQuantity = useCallback((productId) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product_id === productId) {
          if (item.stock !== undefined && item.quantity < item.stock) {
            return { ...item, quantity: item.quantity + 1 };
          } else if (item.stock === undefined) {
            console.warn(`Stock information missing for product ${productId}. Cannot increase quantity past 1.`);
            return item;
          }
        }
        return item;
      })
    );
  }, []);

  const decreaseQuantity = useCallback((productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  }, []);

  const getCartItemCount = useCallback(() => cart.length, [cart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const refreshCartItems = useCallback(async () => {
    if (cart.length === 0) {
      setCart([]);
      return;
    }

    const updatedCartItems = [];
    for (const item of cart) {
      try {
        const response = await api.get(`products/${item.product_id}/`);
        const latestProductData = response.data;

        const mainImage =
          latestProductData.image_urls?.large ||
          latestProductData.secondary_image_urls?.large ||
          (latestProductData.additional_images?.[0]?.image_urls?.large) ||
          '/media/default.jpg';

        updatedCartItems.push({
          ...item,
          name: latestProductData.name,
          image_url: mainImage,
          price: latestProductData.price,
          stock: latestProductData.stock,
          is_abroad_order: latestProductData.is_abroad_order,
          abroad_delivery_days: latestProductData.abroad_delivery_days,
          quantity: Math.min(item.quantity, latestProductData.stock),
          errorFetching: false,
        });
      } catch (error) {
        console.error(`Error refreshing product ${item.product_id}:`, error.response?.data || error.message);
        updatedCartItems.push({
          ...item,
          stock: 0,
          errorFetching: true,
          quantity: 0,
        });
      }
    }
    setCart(updatedCartItems);
  }, [cart]);

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
        refreshCartItems,
        updateCartItemDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
