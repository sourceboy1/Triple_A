import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import emptyCartImage from '../pictures/emptycart.jpg';
import { useNavigate } from 'react-router-dom';
import PriceAlertModal from './PriceAlertModal';
import './Cart.css';

const Cart = () => {
  const { cart, removeItemFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  useEffect(() => {
    // Only show price alert if the cart has items initially
    if (cart.length > 0) {
      setShowPriceAlert(true);
    }
  }, [cart.length]); // Added cart.length to dependency array to re-evaluate when cart changes


  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal; // Assuming no shipping cost is calculated in the cart view itself

  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  const handleCheckout = () => {
    // It's generally better to let the CartContext manage the cart state
    // and rely on that state in the Checkout component.
    // However, if you specifically need to store it in localStorage here, keep this line.
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

                    {/* Display abroad order message if applicable */}
                    {item.is_abroad_order && (
                        <p className="abroad-order-cart-message">
                            <span role="img" aria-label="airplane">✈️</span> Shipped from Abroad (Est. {item.abroad_delivery_days || 7-14} days)
                        </p>
                    )}

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
              {cart.some(item => item.is_abroad_order) && (
                  <p className="abroad-cart-warning">
                      <span role="img" aria-label="info">ℹ️</span> Note: Your order includes items shipped from abroad.
                      Final shipping costs will be calculated at checkout.
                  </p>
              )}
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

      <PriceAlertModal
        show={showPriceAlert}
        onClose={() => setShowPriceAlert(false)}
        type="cart"
      />
    </div>
  );
};

export default Cart;