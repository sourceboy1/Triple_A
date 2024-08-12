// src/components/Checkout.js
import React from 'react';
import { useCart } from '../contexts/CartContext';
import './Styling.css';

const Checkout = () => {
  const { cart, clearCart } = useCart();

  const handlePlaceOrder = () => {
    // Implement order placement logic here
    clearCart(); // Clear cart after placing the order
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. Add some items to proceed.</p>
      ) : (
        <div>
          <ul>
            {cart.map(item => (
              <li key={item.product_id}>
                <img src={item.image_url} alt={item.name} className="checkout-item-image" />
                <div>
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={handlePlaceOrder} className="button is-primary">Place Order</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
