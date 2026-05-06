// src/components/Cart.jsx
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
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    const fetchAndRefreshCart = async () => {
      setLoadingCart(true);
      await refreshCartItems();
      setLoadingCart(false);
    };
    fetchAndRefreshCart();
  }, []);

  useEffect(() => {
    if (!loadingCart && cart.length > 0) {
      setShowPriceAlert(true);
    }
  }, [cart.length, loadingCart]);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal;

  const formatPrice = (price) => new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN', minimumFractionDigits: 0
  }).format(price);

  const handleCheckout = () => {
    localStorage.setItem('cartData', JSON.stringify(cart));
    navigate('/checkout');
  };

  const handleReturnToShop = () => navigate('/');

  if (loadingCart) return (
    <div className="cart-loading">
      <div className="cart-spinner" />
      <p>Loading your cart…</p>
    </div>
  );

  return (
    <div className="cart-page">

      {/* ── Header ── */}
      <div className="cart-page-header">
        <h1 className="cart-page-title">Your Cart</h1>
        {cart.length > 0 && (
          <span className="cart-item-count">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {cart.length === 0 ? (
        /* ── Empty state ── */
        <div className="cart-empty">
          <img src={emptyCartImage} alt="Empty Cart" className="cart-empty-img" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <button onClick={handleReturnToShop} className="cart-return-btn">
            ← Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">

          {/* ── Left: items ── */}
          <div className="cart-items-col">

            {/* Column labels */}
            <div className="cart-col-labels">
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <ul className="cart-list">
              {cart.map((item) => {
                const deliveryDisplay = item.abroad_delivery_days === 14
                  ? '7–14' : (item.abroad_delivery_days ? `${item.abroad_delivery_days}` : '7–14');
                const isUnavailable = item.stock === 0 || item.errorFetching;

                return (
                  <li key={item.product_id} className={`cart-row ${isUnavailable ? 'cart-row--unavailable' : ''}`}>

                    {/* Image + info */}
                    <div className="cart-row-product">
                      <div className="cart-row-img-wrap">
                        <img src={item.image_url} alt={item.name} className="cart-row-img"
                          onError={(e) => { e.target.src = '/media/default.jpg'; }} />
                      </div>
                      <div className="cart-row-info">
                        <h3 className="cart-row-name">
                          {item.name}
                          {isUnavailable && <span className="cart-unavailable-tag">Unavailable</span>}
                        </h3>
                        <p className="cart-row-price">{formatPrice(item.price)}</p>
                        {item.is_abroad_order && (
                          <span className="cart-abroad-tag">
                            ✈️ Abroad order · Est. {deliveryDisplay} days
                          </span>
                        )}
                        <button
                          className="cart-remove-btn"
                          onClick={() => removeItemFromCart(item.product_id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="cart-row-qty">
                      <div className="cart-qty-ctrl">
                        <button
                          onClick={() => decreaseQuantity(item.product_id)}
                          disabled={item.quantity <= 1 || isUnavailable}
                          aria-label="Decrease"
                        >−</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.product_id)}
                          disabled={item.quantity >= item.stock || isUnavailable}
                          aria-label="Increase"
                        >+</button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="cart-row-total">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Continue shopping */}
            <button className="cart-continue-btn" onClick={handleReturnToShop}>
              ← Continue Shopping
            </button>
          </div>

          {/* ── Right: summary ── */}
          <div className="cart-summary-col">
            <div className="cart-summary-card">
              <h2 className="cart-summary-title">Order Summary</h2>

              {cart.some(item => item.is_abroad_order) && (
                <div className="cart-abroad-notice">
                  <span>ℹ️</span>
                  <p>Your order includes items shipped from abroad. Final shipping costs are calculated at checkout.</p>
                </div>
              )}

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="cart-summary-row cart-summary-row--muted">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="cart-summary-divider" />
                <div className="cart-summary-row cart-summary-row--total">
                  <span>Estimated Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button className="cart-checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout →
              </button>

              {/* Trust badges */}
              <div className="cart-trust-badges">
                <span>🔒 Secure Checkout</span>
                <span>✅ Quality Assured</span>
                <span>🚚 Fast Delivery</span>
              </div>
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