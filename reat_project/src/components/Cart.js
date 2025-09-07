// Cart.jsx
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useCart } from '../contexts/CartContext';
import emptyCartImage from '../pictures/emptycart.jpg';
import { useNavigate } from 'react-router-dom';
import PriceAlertModal from './PriceAlertModal'; // Import the modal
import './Cart.css';

const Cart = () => {
  const { cart, removeItemFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();
  const [showPriceAlert, setShowPriceAlert] = useState(false); // State for modal visibility

  // Show the price alert when the Cart component mounts
  useEffect(() => {
    if (cart.length > 0) { // Only show if there are items in the cart
      setShowPriceAlert(true);
    }
  }, []); // Empty dependency array means this runs once on mount

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal;

  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  const handleCheckout = () => {
    localStorage.setItem('cartData', JSON.stringify(cart));
    navigate('/checkout');
  };

  const handleReturnToShop = () => {
    navigate('/');
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
          <div className="cart-items-container">
            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item.product_id} className="cart-item">
                  <img src={item.image_url} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>Price: ₦{formatPrice(item.price)}</p>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => decreaseQuantity(item.product_id)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.product_id)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <p>Total: ₦{formatPrice(item.price * item.quantity)}</p>
                    <button onClick={() => removeItemFromCart(item.product_id)} className="remove-button">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="cart-summary-container">
            <div className="cart-summary">
              <h3>Cart Summary</h3>
              <div className="cart-totals">
                <div className="subtotal">
                  <span>Subtotal:</span>
                  <span>₦{formatPrice(subtotal)}</span>
                </div>
                <div className="total-amount">
                  <span>Total:</span>
                  <span>₦{formatPrice(total)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} className="checkout-button">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}

      {/* Price Alert Modal for Cart */}
      <PriceAlertModal
        show={showPriceAlert}
        onClose={() => setShowPriceAlert(false)}
        type="cart" // Indicate this is from the cart
      />
    </div>
  );
};

export default Cart;