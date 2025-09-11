import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import emptyCartImage from '../pictures/emptycart.jpg';
import { useNavigate } from 'react-router-dom';
import PriceAlertModal from './PriceAlertModal';
import './Cart.css';

const Cart = () => {
  const { cart, removeItemFromCart, increaseQuantity, decreaseQuantity, refreshCartItems } = useCart();
  const navigate = useNavigate();
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true); // New loading state

  useEffect(() => {
    const fetchAndRefreshCart = async () => {
      setLoadingCart(true);
      await refreshCartItems(); // Refresh cart items from API
      setLoadingCart(false);
    };

    fetchAndRefreshCart();
  }, []); // Run only once on mount to refresh cart

  useEffect(() => {
    if (!loadingCart && cart.length > 0) { // Only show price alert if cart is loaded and has items
      setShowPriceAlert(true);
    }
  }, [cart.length, loadingCart]);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal; // Assuming no shipping cost is calculated in the cart view itself

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

  if (loadingCart) {
    return <div className="cart-container">Loading cart...</div>; // Show loading indicator
  }

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
              {cart.map((item) => {
                // Consistent delivery display logic
                const deliveryDisplay = item.abroad_delivery_days === 14 ? '7-14' : (item.abroad_delivery_days ? `${item.abroad_delivery_days}` : '7-14');
                const isItemUnavailable = item.stock === 0 || item.errorFetching;

                return (
                <li key={item.product_id} className={`cart-item ${isItemUnavailable ? 'unavailable-item' : ''}`}>
                  <img src={item.image_url} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name} {isItemUnavailable && <span style={{color: 'red', fontSize: '0.8em'}}>(Unavailable)</span>}</h3>
                    <p>Price: ₦{formatPrice(item.price)}</p>

                    {item.is_abroad_order && (
                        <p className="abroad-order-cart-message">
                            <span role="img" aria-label="airplane">✈️</span> Shipped from Abroad (Est. {deliveryDisplay} days)
                        </p>
                    )}

                    <div className="cart-item-quantity">
                      <button
                        onClick={() => decreaseQuantity(item.product_id)}
                        disabled={item.quantity <= 1 || isItemUnavailable}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.product_id)}
                        disabled={item.quantity >= item.stock || isItemUnavailable}
                      >
                        +
                      </button>
                    </div>
                    <p>Total: ₦{formatPrice(item.price * item.quantity)}</p>
                    <button onClick={() => removeItemFromCart(item.product_id)} className="remove-button">Remove</button>
                  </div>
                </li>
              );
            })}
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