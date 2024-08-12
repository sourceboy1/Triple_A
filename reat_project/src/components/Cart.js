import React from 'react';
import { useCart } from '../contexts/CartContext'; // Import the custom hook
import emptyCartImage from '../pictures/emptycart.jpg';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, removeItemFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  console.log('Cart Items:', cart); // Debugging line

  const subtotal = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 0 ? 1000 : 0;
  const total = subtotal + shipping;

  const handleReturnToShop = () => {
    navigate('/'); // Navigate back to the home page
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <img src={emptyCartImage} alt="Empty Cart" className="empty-cart-image" />
          <p>Your cart is currently empty.</p>
          <button onClick={handleReturnToShop} className="return-button">Return to Shop</button>
        </div>
      ) : (
        <div className="cart-content">
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.product_id} className="cart-item">
                <img src={item.image_url} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Price: #{parseFloat(item.price).toFixed(2)}</p>
                  <div className="cart-item-quantity">
                    <button onClick={() => decreaseQuantity(item.product_id)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => increaseQuantity(item.product_id)}>+</button>
                  </div>
                  <p>Total: #{parseFloat((item.price * (item.quantity || 1))).toFixed(2)}</p>
                  <button onClick={() => removeItemFromCart(item.product_id)} className="remove-button">Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h3>Cart Summary</h3>
            <div className="cart-totals">
              <div className="subtotal">
                <span>Subtotal:</span>
                <span>#{parseFloat(subtotal).toFixed(2)}</span>
              </div>
              <div className="shipping">
                <span>Shipping:</span>
                <span>#{parseFloat(shipping).toFixed(2)}</span>
              </div>
              <div className="total">
                <span>Total:</span>
                <span>#{parseFloat(total).toFixed(2)}</span>
              </div>
            </div>
            <button className="checkout-button">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;







