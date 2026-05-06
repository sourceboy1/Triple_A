// src/components/Checkout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Checkout.css';
import guaranteeIcon from '../icons/guarantee-icon.jpg';
import fastShipIcon from '../icons/fast-ship-icon.jpg';
import qualityAssuredIcon from '../icons/quality-assured-icon.jpg';
import customerServiceIcon from '../icons/customer-service-icon.jpg';
import debitcardImage from '../pictures/debitcard.jpg';
import PhoneInputComponent from '../PhoneInput';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import countryList from 'react-select-country-list';
import api from '../Api';
import 'react-phone-input-2/lib/style.css';
import { useLoading } from '../contexts/LoadingContext';

const Checkout = () => {
  const [email, setEmail]               = useState('');
  const [emailError, setEmailError]     = useState('');
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity]                 = useState('');
  const [state, setState]               = useState('');
  const [postalCode, setPostalCode]     = useState('');
  const [country, setCountry]           = useState('NG');
  const [phone, setPhone]               = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [orderNote, setOrderNote]       = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [termsAgreed, setTermsAgreed]   = useState(false);
  const [showTerms, setShowTerms]       = useState(false);
  const [loadingCheckoutDetails, setLoadingCheckoutDetails] = useState(true);

  const { cart, clearCart, refreshCartItems } = useCart();
  const { isLoggedIn, firstName: userFirstName, lastName: userLastName, email: userEmail } = useUser();
  const token    = localStorage.getItem('access_token');
  const navigate = useNavigate();
  const options  = countryList().getData();
  const { loading, setLoading } = useLoading();

  const emailRef      = useRef(null);
  const firstNameRef  = useRef(null);
  const lastNameRef   = useRef(null);
  const addressRef    = useRef(null);
  const cityRef       = useRef(null);
  const stateRef      = useRef(null);
  const postalCodeRef = useRef(null);
  const phoneRef      = useRef(null);

  const paymentMethodIds = { bank_transfer: 1, debit_credit_cards: 2 };
  const hasAbroadProduct = cart.some(item => item.is_abroad_order);
  const ABROAD_SHIPPING_SURCHARGE = 30000;

  useEffect(() => {
    window.scrollTo(0, 0);
    const initializeCheckout = async () => {
      setLoadingCheckoutDetails(true);
      await refreshCartItems();
      if (isLoggedIn) {
        setEmail(userEmail || '');
        setFirstName(userFirstName || '');
        setLastName(userLastName || '');
      }
      setLoadingCheckoutDetails(false);
    };
    initializeCheckout();
  }, [isLoggedIn, userEmail, userFirstName, userLastName]);

  const getShippingCost = () => {
    let baseCost = 0;
    switch (shippingMethod) {
      case 'pickup':      baseCost = 0;     break;
      case 'express':     baseCost = 15000; break;
      case 'area1':       baseCost = 10000; break;
      case 'satellite':   baseCost = 12000; break;
      case 'area2':       baseCost = 10000; break;
      case 'abule_egba':  baseCost = 8000;  break;
      case 'ikeja':       baseCost = 5000;  break;
      case 'lagos_island':baseCost = 12000; break;
      default:            baseCost = 0;
    }
    if (hasAbroadProduct) baseCost += ABROAD_SHIPPING_SURCHARGE;
    return baseCost;
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN', minimumFractionDigits: 0
  }).format(price);

  const subtotal     = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost = getShippingCost();
  const total        = subtotal + shippingCost;

  const getShippingLabel = (method, basePrice) => {
    const surcharge = formatPrice(ABROAD_SHIPPING_SURCHARGE);
    const labels = {
      pickup:       'Store Pickup — Free',
      express:      `Express / Same Day Delivery — ${formatPrice(basePrice)}`,
      area1:        `Amuwo Odofin GRA / Festac — ${formatPrice(basePrice)}`,
      satellite:    `Satellite Town / Suru Alaba / Isolo / Maza Maza — ${formatPrice(basePrice)}`,
      area2:        `Ajao Estate / Oshodi / Lawanson / Orile / Itire / Gbagada / Apapa / Surulere / Tradefair — ${formatPrice(basePrice)}`,
      abule_egba:   `Abule Egba / Iyana Ipaja / Ayobo — ${formatPrice(basePrice)}`,
      ikeja:        `Ikeja Axis / Bariga / Alagomeji / Fadeyi / Palm Groove — ${formatPrice(basePrice)}`,
      lagos_island: `Lagos Island — ${formatPrice(basePrice)}`,
    };
    const label = labels[method] || '';
    if (hasAbroadProduct && method !== 'pickup') return `${surcharge} abroad surcharge + ${label}`;
    return label;
  };

  const handlePlaceOrder = async () => {
    setEmailError('');
    if (loading || loadingCheckoutDetails) return;
    if (!isLoggedIn) {
      window.scrollTo(0, 0);
      setEmailError('Please log in or register to place your order.');
      return;
    }
    if (!termsAgreed) {
      window.scrollTo(0, 0);
      setEmailError('You must agree to the terms and conditions before placing the order.');
      return;
    }
    if (!email || !firstName || !lastName || !addressLine1 || !city || !state || !postalCode || !country || !phone) {
      window.scrollTo(0, 0);
      setEmailError('Please fill in all required fields.');
      return;
    }
    const unavailableItems = cart.filter(item => item.stock === 0 || item.errorFetching);
    if (unavailableItems.length > 0) {
      window.scrollTo(0, 0);
      setEmailError(`The following items are unavailable: ${unavailableItems.map(i => i.name).join(', ')}. Please remove them from your cart.`);
      return;
    }

    setLoading(true);
    const fullAddress = `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}`;
    const userId = parseInt(localStorage.getItem('userId'), 10);
    if (!token || isNaN(userId)) {
      window.scrollTo(0, 0);
      setEmailError('Authentication error. Please log in again.');
      setLoading(false);
      return;
    }

    const orderData = {
      user_id: userId, email, first_name: firstName, last_name: lastName,
      address: fullAddress, city, state, postal_code: postalCode, country, phone,
      shipping_method: shippingMethod, order_note: orderNote,
      payment_method_id: paymentMethodIds[paymentMethod] || 1,
      shipping_cost: shippingCost, total_amount: total,
      cart_items: cart.map(item => ({
        product: item.product_id, name: item.name, image_url: item.image_url,
        quantity: item.quantity, price: item.price,
        is_abroad_order: item.is_abroad_order, abroad_delivery_days: item.abroad_delivery_days
      }))
    };

    try {
      const response = await api.post('/orders/', orderData);
      clearCart();
      const redirectPath = paymentMethod === 'debit_credit_cards'
        ? '/payment/debit-credit-card' : '/payment/bank-transfer';
      navigate(redirectPath, {
        state: { orderId: response.data.order_id, email, phone, address: fullAddress,
          subtotal, shippingCost, total, products: cart, shippingMethod }
      });
    } catch (error) {
      window.scrollTo(0, 0);
      setEmailError('There was an error placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTerms = (e) => { e.preventDefault(); setShowTerms(!showTerms); };

  if (loadingCheckoutDetails) return (
    <div className="co-loading">
      <div className="co-spinner" />
      <p>Loading checkout…</p>
    </div>
  );

  if (cart.length === 0 && !loadingCheckoutDetails) return (
    <div className="co-empty">
      <h2>Your cart is empty</h2>
      <p>Add items to your cart before checking out.</p>
      <button onClick={() => navigate('/')} className="co-empty-btn">← Return to Shop</button>
    </div>
  );

  const shippingOptions = [
    { value: 'pickup',       price: 0 },
    { value: 'express',      price: 15000 },
    { value: 'area1',        price: 10000 },
    { value: 'satellite',    price: 12000 },
    { value: 'area2',        price: 10000 },
    { value: 'abule_egba',   price: 8000  },
    { value: 'ikeja',        price: 5000  },
    { value: 'lagos_island', price: 12000 },
  ];

  return (
    <div className="co-page">
      <div className="co-layout">

        {/* ══════════ LEFT — Form ══════════ */}
        <div className="co-form-col">

          <h1 className="co-page-title">Checkout</h1>

          {!isLoggedIn && (
            <div className="co-login-notice">
              <span>👤</span>
              <p>Returning customer? <Link to="/signin">Click here to login</Link></p>
            </div>
          )}

          {emailError && (
            <div className="co-error-banner">
              <span>⚠️</span>
              <p>{emailError}</p>
            </div>
          )}

          {/* Contact info */}
          <div className="co-section">
            <h2 className="co-section-title">
              <span className="co-step">1</span> Contact Information
            </h2>
            <div className="co-field-group">
              <div className="co-field">
                <label>Email address *</label>
                <input
                  ref={emailRef} type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || loadingCheckoutDetails}
                />
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="co-section">
            <h2 className="co-section-title">
              <span className="co-step">2</span> Shipping Address
            </h2>
            <div className="co-field-group co-field-group--2col">
              <div className="co-field">
                <label>First name *</label>
                <input ref={firstNameRef} type="text" placeholder="John"
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading || loadingCheckoutDetails} />
              </div>
              <div className="co-field">
                <label>Last name *</label>
                <input ref={lastNameRef} type="text" placeholder="Doe"
                  value={lastName} onChange={(e) => setLastName(e.target.value)}
                  disabled={loading || loadingCheckoutDetails} />
              </div>
            </div>
            <div className="co-field-group">
              <div className="co-field">
                <label>Address *</label>
                <input ref={addressRef} type="text" placeholder="Street address"
                  value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)}
                  disabled={loading || loadingCheckoutDetails} />
              </div>
              <div className="co-field">
                <label>Apartment, suite, etc. (optional)</label>
                <input type="text" placeholder="Apt, floor, building…"
                  value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)}
                  disabled={loading || loadingCheckoutDetails} />
              </div>
            </div>
            <div className="co-field-group co-field-group--3col">
              <div className="co-field">
                <label>City *</label>
                <input ref={cityRef} type="text" placeholder="Lagos"
                  value={city} onChange={(e) => setCity(e.target.value)}
                  disabled={loading || loadingCheckoutDetails} />
              </div>
              <div className="co-field">
                <label>State *</label>
                <input ref={stateRef} type="text" placeholder="Lagos State"
                  value={state} onChange={(e) => setState(e.target.value)}
                  disabled={loading || loadingCheckoutDetails} />
              </div>
              <div className="co-field">
                <label>Postal code *</label>
                <input ref={postalCodeRef} type="text" placeholder="100001"
                  value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
                  disabled={loading || loadingCheckoutDetails} />
              </div>
            </div>
            <div className="co-field-group co-field-group--2col">
              <div className="co-field">
                <label>Country *</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}
                  disabled={loading || loadingCheckoutDetails}>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="co-field">
                <label>Phone number *</label>
                <PhoneInputComponent value={phone} onChange={setPhone}
                  disabled={loading || loadingCheckoutDetails} />
              </div>
            </div>
          </div>

          {/* Shipping method */}
          <div className="co-section">
            <h2 className="co-section-title">
              <span className="co-step">3</span> Shipping Method
            </h2>

            {hasAbroadProduct && (
              <div className="co-abroad-notice">
                <span>✈️</span>
                <p>An additional <strong>{formatPrice(ABROAD_SHIPPING_SURCHARGE)}</strong> will be added for goods shipped from abroad.</p>
              </div>
            )}

            <div className="co-shipping-options">
              {shippingOptions.map(({ value, price }) => (
                <label
                  key={value}
                  className={`co-shipping-option ${shippingMethod === value ? 'co-shipping-option--active' : ''}`}
                >
                  <input
                    type="radio" name="shippingMethod" value={value}
                    checked={shippingMethod === value}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    disabled={loading || loadingCheckoutDetails}
                  />
                  <div className="co-shipping-option-body">
                    <span className="co-shipping-option-label">{getShippingLabel(value, price)}</span>
                    {value === 'pickup' && shippingMethod === 'pickup' && (
                      <span className="co-pickup-note">
                        ℹ️ You can also pay when you come to pick up your order at the store.
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order note */}
          <div className="co-section">
            <h2 className="co-section-title">
              <span className="co-step">4</span> Order Note
              <span className="co-optional">Optional</span>
            </h2>
            <div className="co-field">
              <textarea
                placeholder="Any special instructions for your order…"
                value={orderNote} onChange={(e) => setOrderNote(e.target.value)}
                disabled={loading || loadingCheckoutDetails}
                rows={3}
              />
            </div>
          </div>

          {/* Payment */}
          <div className="co-section">
            <h2 className="co-section-title">
              <span className="co-step">5</span> Payment Method
            </h2>
            <div className="co-payment-options">

              <label className={`co-payment-option ${paymentMethod === 'bank_transfer' ? 'co-payment-option--active' : ''}`}>
                <input type="radio" name="paymentMethod" value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={loading || loadingCheckoutDetails} />
                <div className="co-payment-option-body">
                  <div className="co-payment-header">
                    <span className="co-payment-name">Bank Transfer</span>
                    <span className="co-payment-icon-tag">🏦</span>
                  </div>
                  {paymentMethod === 'bank_transfer' && (
                    <p className="co-payment-note">
                      Make payment directly into our bank account using your Order ID as reference.
                      Your order will not be shipped until funds clear. Bank details are shown after placing your order.
                    </p>
                  )}
                </div>
              </label>

              <label className={`co-payment-option ${paymentMethod === 'debit_credit_cards' ? 'co-payment-option--active' : ''}`}>
                <input type="radio" name="paymentMethod" value="debit_credit_cards"
                  checked={paymentMethod === 'debit_credit_cards'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={loading || loadingCheckoutDetails} />
                <div className="co-payment-option-body">
                  <div className="co-payment-header">
                    <span className="co-payment-name">Debit / Credit Card</span>
                    <img src={debitcardImage} alt="Card" className="co-card-img" />
                  </div>
                </div>
              </label>
            </div>

            <p className="co-privacy-note">
              Your personal data will be used to process your order as described in our{' '}
              <Link to="/privacy-policy">privacy policy</Link>.
            </p>
          </div>

          {/* Terms */}
          <div className="co-terms-row">
            <label className="co-terms-label">
              <input type="checkbox" checked={termsAgreed}
                onChange={() => setTermsAgreed(!termsAgreed)}
                disabled={loading || loadingCheckoutDetails} />
              <span>
                I have read and agree to the website{' '}
                <a href="#terms" onClick={toggleTerms}>terms and conditions</a>
              </span>
            </label>
          </div>

          {showTerms && (
            <div className="co-terms-content">
              <h3>Terms & Conditions</h3>
              <div className="co-terms-text">
                <p>
                  When visitors leave comments on the site we collect the data shown in the comments form,
                  and also the visitor's IP address and browser user agent string to help spam detection.
                  An anonymized string created from your email address may be provided to the Gravatar service.
                  Articles on this site may include embedded content from other websites which behave in the
                  exact same way as if the visitor has visited the other website. These websites may collect
                  data about you, use cookies, embed additional third-party tracking, and monitor your interaction
                  with that embedded content. If you leave a comment, the comment and its metadata are retained
                  indefinitely. For users that register on our website, we also store the personal information
                  they provide in their user profile. All users can see, edit, or delete their personal information
                  at any time. Visitor comments may be checked through an automated spam detection service.
                </p>
              </div>
            </div>
          )}

          {/* Place order */}
          <button
            className="co-place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loading || loadingCheckoutDetails}
          >
            {loading ? (
              <><span className="co-btn-spinner" /> Placing Order…</>
            ) : (
              '🔒 Place Order'
            )}
          </button>
        </div>

        {/* ══════════ RIGHT — Order summary ══════════ */}
        <div className="co-summary-col">
          <div className="co-summary-card">
            <h2 className="co-summary-title">Order Summary</h2>

            <ul className="co-summary-items">
              {cart.map((item) => {
                const deliveryDisplay = item.abroad_delivery_days === 14 ? '7–14'
                  : (item.abroad_delivery_days ? `${item.abroad_delivery_days}` : '7–14');
                const isUnavailable = item.stock === 0 || item.errorFetching;
                return (
                  <li key={item.product_id} className={`co-summary-item ${isUnavailable ? 'co-summary-item--unavailable' : ''}`}>
                    <div className="co-summary-item-img-wrap">
                      <img src={item.image_url} alt={item.name}
                        onError={(e) => { e.target.src = '/media/default.jpg'; }} />
                      <span className="co-summary-item-qty">{item.quantity}</span>
                    </div>
                    <div className="co-summary-item-info">
                      <p className="co-summary-item-name">{item.name}</p>
                      {item.is_abroad_order && (
                        <span className="co-summary-abroad-tag">
                          ✈️ Abroad · Est. {deliveryDisplay} days
                        </span>
                      )}
                      {isUnavailable && <span className="co-summary-unavailable">Unavailable</span>}
                    </div>
                    <p className="co-summary-item-price">{formatPrice(item.price * item.quantity)}</p>
                  </li>
                );
              })}
            </ul>

            <div className="co-summary-totals">
              <div className="co-totals-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="co-totals-row">
                <span>Shipping</span>
                <span>{shippingMethod ? formatPrice(shippingCost) : 'Select method'}</span>
              </div>
              <div className="co-totals-divider" />
              <div className="co-totals-row co-totals-row--total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Trust info */}
            <div className="co-trust-items">
              {[
                { icon: guaranteeIcon, title: 'Guarantee', text: 'Not satisfied? Check our Return/Refund Policy.', link: '/return-refund-policy', linkText: 'Return/Refund Policy' },
                { icon: fastShipIcon,  title: 'Fast Shipping', text: 'Multiple delivery options available.', link: '/faq', linkText: 'Our FAQ' },
                { icon: qualityAssuredIcon, title: 'Quality Assured', text: '100% covered on every eligible purchase.' },
                { icon: customerServiceIcon, title: 'Customer Service', text: '22 Oba Akran Avenue, Ikeja, Lagos. Call: +2348034593459' },
              ].map(({ icon, title, text, link, linkText }) => (
                <div key={title} className="co-trust-item">
                  <img src={icon} alt={title} />
                  <div>
                    <h4>{title}</h4>
                    <p>{text} {link && <Link to={link}>{linkText}</Link>}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;