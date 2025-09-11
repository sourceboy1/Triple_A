import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../Api'; // Assuming 'api' is configured to your backend

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

  // New: Function to update specific details of a cart item
  const updateCartItemDetails = useCallback((productId, newDetails) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product_id === productId ? { ...item, ...newDetails } : item
      )
    );
  }, []);

  const addItemToCart = (product) => {
    if (
      !product.product_id ||
      !product.name ||
      !product.image_url ||
      product.price === undefined || // Allow price to be 0
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
        // If product already exists, let's update its quantity if possible,
        // and also ensure its details are up-to-date from the latest product object.
        return prevCart.map(item =>
          item.product_id === product.product_id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.stock), // Increase quantity, cap at new stock
                name: product.name, // Update name
                image_url: product.image_url, // Update image
                price: product.price, // Update price
                stock: product.stock, // Update stock
                is_abroad_order: product.is_abroad_order, // Update abroad status
                abroad_delivery_days: product.abroad_delivery_days // Update delivery days
              }
            : item
        );
      }
      // If new product, add with quantity 1
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
          if (item.stock !== undefined && item.quantity < item.stock) {
            return { ...item, quantity: item.quantity + 1 };
          } else if (item.stock === undefined) {
             console.warn(`Stock information missing for product ${productId}. Cannot increase quantity past 1.`);
             return item; // Do not increase if stock is unknown
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

  // NEW: Function to refresh all cart items from the API
  const refreshCartItems = useCallback(async () => {
    if (cart.length === 0) return;

    const updatedCartPromises = cart.map(async (item) => {
      try {
        const response = await api.get(`products/${item.product_id}/`);
        const latestProductData = response.data;

        // Determine the main image URL to ensure it's up to date
        const mainImage =
            latestProductData.image_urls?.large ||
            latestProductData.secondary_image_urls?.large ||
            (latestProductData.additional_images?.[0]?.image_urls?.large) ||
            '/media/default.jpg';


        return {
          ...item,
          name: latestProductData.name,
          image_url: mainImage,
          price: latestProductData.price,
          stock: latestProductData.stock,
          is_abroad_order: latestProductData.is_abroad_order,
          abroad_delivery_days: latestProductData.abroad_delivery_days,
          // Ensure quantity doesn't exceed new stock
          quantity: Math.min(item.quantity, latestProductData.stock > 0 ? latestProductData.stock : item.quantity),
        };
      } catch (error) {
        console.error(`Error refreshing product ${item.product_id}:`, error.response?.data || error.message);
        // If product is no longer available or an error occurs,
        // you might want to remove it or mark it as unavailable.
        // For now, we'll return the original item, but you could:
        // return { ...item, unavailable: true, stock: 0 };
        // Or filter it out in the .allSettled below.
        return { ...item, errorFetching: true, stock: 0 }; // Mark as error/out of stock
      }
    });

    const results = await Promise.allSettled(updatedCartPromises);

    const newCart = results.map(result => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            // If a product failed to refresh, we can decide to keep the old data
            // or remove it. For now, let's keep the old data but mark it as potentially invalid.
            // You might want to remove it:
            // return null;
            return { ...cart.find(ci => ci.product_id === null), errorFetching: true }; // This needs proper ID handling if we want to retain item.
        }
    }).filter(Boolean); // Remove any nulls if we decided to filter out failed items

    // A more robust approach if an item truly failed to fetch:
    const finalNewCart = [];
    for (let i = 0; i < results.length; i++) {
        if (results[i].status === 'fulfilled') {
            finalNewCart.push(results[i].value);
        } else {
            // Option 1: Keep the original item, mark it with an error
            const originalItem = cart[i];
            console.warn(`Product ID ${originalItem?.product_id} could not be refreshed. Keeping old data or marking as error.`);
            finalNewCart.push({ ...originalItem, errorFetching: true, stock: 0 });

            // Option 2: Remove the item completely from the cart if it failed to fetch
            // console.warn(`Product ID ${originalItem?.product_id} could not be refreshed and will be removed from cart.`);
            // No push to finalNewCart
        }
    }


    setCart(finalNewCart);
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
        refreshCartItems, // Provide the new refresh function
        updateCartItemDetails, // Provide update specific details function
      }}
    >
      {children}
    </CartContext.Provider>
  );
};