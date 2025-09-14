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
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('NG');
    const [phone, setPhone] = useState('');
    const [shippingMethod, setShippingMethod] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [termsAgreed, setTermsAgreed] = useState(false);
    const { cart, clearCart, refreshCartItems } = useCart(); // Added refreshCartItems
    const [showTerms, setShowTerms] = useState(false);
    const { isLoggedIn, firstName: userFirstName, lastName: userLastName, email: userEmail } = useUser();
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const options = countryList().getData();
    const { loading, setLoading } = useLoading();
    const [loadingCheckoutDetails, setLoadingCheckoutDetails] = useState(true); // New loading state for checkout data

    const emailRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const addressRef = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);
    const postalCodeRef = useRef(null);
    const phoneRef = useRef(null);

     useEffect(() => {
        window.scrollTo(0, 0);

        const initializeCheckout = async () => {
            setLoadingCheckoutDetails(true);
            await refreshCartItems(); // Refresh cart items on checkout load
            if (isLoggedIn) {
                setEmail(userEmail || '');
                setFirstName(userFirstName || '');
                setLastName(userLastName || '');
            }
            setLoadingCheckoutDetails(false);
        };

        initializeCheckout();

     }, [isLoggedIn, userEmail, userFirstName, userLastName]); // Re-run if user login state changes

    const paymentMethodIds = {
        bank_transfer: 1,
        debit_credit_cards: 2,
    };

    const hasAbroadProduct = cart.some(item => item.is_abroad_order);
    const ABROAD_SHIPPING_SURCHARGE = 30000;


   const handlePlaceOrder = async () => {
    setEmailError('');

    if (loading || loadingCheckoutDetails) return; // Prevent multiple submissions or submission while loading

    // Check if user is logged in
    if (!isLoggedIn) {
        window.scrollTo(0, 0);
        setEmailError('Please log in or register to place your order. You can do so by clicking the "Click here to login" link above.');
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

    // Check for unavailable items in cart
    const unavailableItems = cart.filter(item => item.stock === 0 || item.errorFetching);
    if (unavailableItems.length > 0) {
        window.scrollTo(0, 0);
        setEmailError(`The following items are unavailable and cannot be ordered: ${unavailableItems.map(item => item.name).join(', ')}. Please remove them from your cart.`);
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

    const paymentMethodId = paymentMethodIds[paymentMethod] || 1;
    const shippingCost = getShippingCost();
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal + shippingCost;

    const orderData = {
        user_id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        address: fullAddress,
        city,
        state,
        postal_code: postalCode,
        country,
        phone,
        // Only include shipping_method if shippingCost is not 0
        ...(currentShippingCost > 0 && { shipping_method: shippingMethod }),
        order_note: orderNote,
        payment_method_id: paymentMethodId,
        shipping_cost: currentShippingCost,
        total_amount: total,
        cart_items: cart.map(item => ({
            product: item.product_id,
            name: item.name,
            image_url: item.image_url,
            quantity: item.quantity,
            price: item.price,
            is_abroad_order: item.is_abroad_order,
            abroad_delivery_days: item.abroad_delivery_days
        }))
    };

    try {
        console.log('Order data being sent:', orderData);
        const response = await api.post('/orders/', orderData);

        clearCart();

        const redirectPath = paymentMethod === 'debit_credit_cards' ? '/payment/debit-credit-card' : '/payment/bank-transfer';
        navigate(redirectPath, {
            state: {
                orderId: response.data.order_id,
                email,
                phone,
                address: fullAddress,
                subtotal,
                shippingCost: currentShippingCost, // Pass currentShippingCost
                total,
                products: cart,
                shippingMethod: shippingMethod // Make sure to pass shippingMethod
            }
        });
    } catch (error) {
        console.error('Error placing the order:', error.response || error);
        window.scrollTo(0, 0);
        setEmailError('There was an error placing your order. Please try again.');
    } finally {
        setLoading(false);
    }
};

    const formatPrice = (price) => {
        return new Intl.NumberFormat().format(price);
    };

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const getShippingCost = () => {
        let baseCost = 0;
        switch (shippingMethod) {
            case 'pickup': baseCost = 0; break;
            case 'express': baseCost = 15000; break;
            case 'area1': baseCost = 10000; break;
            case 'satellite': baseCost = 12000; break;
            case 'area2': baseCost = 10000; break;
            case 'abule_egba': baseCost = 8000; break;
            case 'ikeja': baseCost = 5000; break;
            case 'lagos_mainland': baseCost = 12000; break;
            default: baseCost = 0;
        }

        if (hasAbroadProduct) {
            baseCost += ABROAD_SHIPPING_SURCHARGE;
        }
        return baseCost;
    };

    const shippingCost = getShippingCost();
    const total = subtotal + shippingCost;

    const toggleTerms = (e) => {
        e.preventDefault();
        setShowTerms(!showTerms);
    };

    const getShippingLabel = (method, basePrice) => {
        let label = '';
        const formattedSurcharge = `₦${formatPrice(ABROAD_SHIPPING_SURCHARGE)}`;

        switch (method) {
            case 'pickup': label = 'Store Pickup: Free'; break;
            case 'express': label = `Express/Same Day Delivery: ₦${formatPrice(basePrice)}`; break;
            case 'area1': label = `Amuwo Odofin GRA/Festac: ₦${formatPrice(basePrice)}`; break;
            case 'satellite': label = `Satellite town/Suru Alaba/Isolo/Maza maza: ₦${formatPrice(basePrice)}`; break;
            case 'area2': label = `Ajao Estate/Oshodi/Lawanson/Orile/Itire/Gbagada/Apapa/Surulere/Tradefair: ₦${formatPrice(basePrice)}`; break;
            case 'abule_egba': label = `Abule Egba/ Iyana Ipaja/ Ayobo: ₦${formatPrice(basePrice)}`; break;
            case 'ikeja': label = `IKEJA AXIS/ BARIGA/ALAGOMEJI/FADEYI/PALM GROOVE: ₦${formatPrice(basePrice)}`; break;
            case 'lagos_mainland': label = `LAGOS MAINLAND: ₦${formatPrice(basePrice)}`; break;
            default: label = '';
        }

        if (hasAbroadProduct && method !== 'pickup') {
             return `${formattedSurcharge} for goods coming from abroad + ${label}`;
        }
        return label;
    };

    if (loadingCheckoutDetails) {
        return <div className="checkout-container">Loading checkout details...</div>;
    }

    if (cart.length === 0 && !loadingCheckoutDetails) {
        return (
            <div className="checkout-container">
                <div className="empty-cart-checkout">
                    <h2>Your cart is empty.</h2>
                    <p>Please add items to your cart before proceeding to checkout.</p>
                    <button onClick={() => navigate('/')} className="return-button">Return to Shop</button>
                </div>
            </div>
        );
    }


    return (
        <div className="checkout-container">
            <div className="checkout-form">
                <h1>Checkout</h1>
                {!isLoggedIn && (
                    <p>Returning customer? <a href="/signin">Click here to login</a></p>
                )}
                 <div>
                    <h2>Contact Information</h2>
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading || loadingCheckoutDetails}
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                </div>

                <div>
                    <h2>Shipping Address</h2>
                    <input ref={firstNameRef} type="text" placeholder="First name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading || loadingCheckoutDetails} />
                    <input ref={lastNameRef} type="text" placeholder="Last name *" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading || loadingCheckoutDetails} />
                    <input ref={addressRef} type="text" placeholder="Address *" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} disabled={loading || loadingCheckoutDetails} />
                    <input ref={cityRef} type="text" placeholder="City *" value={city} onChange={(e) => setCity(e.target.value)} disabled={loading || loadingCheckoutDetails} />
                    <input ref={stateRef} type="text" placeholder="State *" value={state} onChange={(e) => setState(e.target.value)} disabled={loading || loadingCheckoutDetails} />
                    <input ref={postalCodeRef} type="text" placeholder="Postal code *" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} disabled={loading || loadingCheckoutDetails} />
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={loading || loadingCheckoutDetails}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <PhoneInputComponent value={phone} onChange={setPhone} disabled={loading || loadingCheckoutDetails} />
                </div>

                <div>
                    <h2>Shipping Method</h2>
                    {hasAbroadProduct && (
                        <p className="abroad-shipping-info">
                            <span role="img" aria-label="info">ℹ️</span> An additional ₦{formatPrice(ABROAD_SHIPPING_SURCHARGE)} will be added to your chosen shipping method for goods coming from abroad.
                        </p>
                    )}
                    <div className="shipping-method-container">
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="pickup"
                                checked={shippingMethod === 'pickup'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                disabled={loading || loadingCheckoutDetails}
                            />
                            {getShippingLabel('pickup', 0)}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="express"
                                checked={shippingMethod === 'express'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                disabled={loading || loadingCheckoutDetails}
                            />
                            {getShippingLabel('express', 15000)}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="area1"
                                checked={shippingMethod === 'area1'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                disabled={loading || loadingCheckoutDetails}
                            />
                            {getShippingLabel('area1', 10000)}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="satellite"
                                checked={shippingMethod === 'satellite'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                disabled={loading || loadingCheckoutDetails}
                            />
                            {getShippingLabel('satellite', 12000)}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="area2"
                                checked={shippingMethod === 'area2'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                disabled={loading || loadingCheckoutDetails}
                            />
                            {getShippingLabel('area2', 10000)}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="abule_egba"
                                checked={shippingMethod === 'abule_egba'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                disabled={loading || loadingCheckoutDetails}
                            />
                            {getShippingLabel('abule_egba', 8000)}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="ikeja"
                                checked={shippingMethod === 'ikeja'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                disabled={loading || loadingCheckoutDetails}
                            />
                            {getShippingLabel('ikeja', 5000)}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="lagos_mainland"
                                checked={shippingMethod === 'lagos_mainland'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                disabled={loading || loadingCheckoutDetails}
                            />
                            {getShippingLabel('lagos_mainland', 12000)}
                        </label>
                    </div>
                </div>

                <div>
                    <h2>Order Note (Optional)</h2>
                    <textarea placeholder="Note about your order" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} disabled={loading || loadingCheckoutDetails} />
                </div>


                <div>
                    <h2>Payment Method</h2>
                    <div className="payment-method-container">
                        <div className="payment-method">
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="bank_transfer"
                                    checked={paymentMethod === 'bank_transfer'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    disabled={loading || loadingCheckoutDetails}
                                />
                                Bank Transfer
                            </label>
                            {paymentMethod === 'bank_transfer' && (
                                <p className="payment-instructions">
                                    Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                                    Your order will not be shipped until the funds have cleared in our account.
                                    <br />
                                    Our account details for payment will be displayed after placing an order.
                                </p>
                            )}
                        </div>
                        <div className="payment-method">
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="debit_credit_cards"
                                    checked={paymentMethod === 'debit_credit_cards'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    disabled={loading || loadingCheckoutDetails}
                                />
                                Debit/Credit Cards
                                <img src={debitcardImage} alt="Debit/Credit Card" className="payment-icon" />
                            </label>
                        </div>
                    </div>

                    <p className="privacy-policy-text">
                        Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link to="/privacy-policy">privacy policy</Link>.
                    </p>
                </div>



                <div className="terms-and-conditions">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={termsAgreed}
                                        onChange={() => setTermsAgreed(!termsAgreed)}
                                        disabled={loading || loadingCheckoutDetails}
                                    />
                                    <label htmlFor="terms">
                                      I have read and agree to the website  <a href="#" onClick={toggleTerms}>terms and conditions</a>
                                    </label>
                                </div>

                                {showTerms && (
                                    <div className="terms-content">
                                        <h3>Terms and Conditions</h3>
                                        <div className="terms-text">
                                            <p>
                                                <strong>Our Terms & Conditions</strong><br /><br />
                                                When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.<br /><br />
                                                An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <a href="https://automattic.com/privacy/" target="_blank" rel="noopener noreferrer">https://automattic.com/privacy/</a>. After approval of your comment, your profile picture is visible to the public in the context of your comment.<br /><br />
                                                <strong>Where does it come from?</strong><br /><br />
                                                Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website. These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and be logged in to that website.<br /><br />
                                                If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue. For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.<br /><br />
                                                <strong>Why do we use it?</strong><br /><br />
                                                If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.<br /><br />
                                                Visitor comments may be checked through an automated spam detection service.
                                            </p>
                                        </div>
                                    </div>
                                )}


                <button onClick={handlePlaceOrder} disabled={loading || loadingCheckoutDetails}>
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>

            <div className="order-summary">
                <h2>Order Summary</h2>
                <ul className="order-summary-items">
                    {cart.map((item) => {
                        // Consistent delivery display logic
                        const deliveryDisplay = item.abroad_delivery_days === 14 ? '7-14' : (item.abroad_delivery_days ? `${item.abroad_delivery_days}` : '7-14');
                        const isItemUnavailable = item.stock === 0 || item.errorFetching;
                        return (
                            <li key={item.product_id} className={`order-summary-item ${isItemUnavailable ? 'unavailable-item' : ''}`}>
                                <img src={item.image_url} alt={item.name} className="order-summary-item-image" />
                                <div className="order-summary-item-details">
                                    <h3>{item.name} {isItemUnavailable && <span style={{color: 'red', fontSize: '0.8em'}}>(Unavailable)</span>}</h3>
                                    {item.is_abroad_order && (
                                        <p className="abroad-order-summary-message">
                                            <span role="img" aria-label="airplane">✈️</span> Shipped from Abroad (Est. {deliveryDisplay} days)
                                        </p>
                                    )}
                                    <p>Price: ₦{formatPrice(item.price)}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Total: ₦{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <div className="total">
                    <span>Subtotal:</span>
                    <span>₦{formatPrice(subtotal)}</span>
                </div>
                <div className="shipping-cost">
                    <span>Shipping Cost:</span>
                    <span>₦{formatPrice(shippingCost)}</span>
                </div>
                <div className="total-amount">
                    <span>Total:</span>
                    <span>₦{formatPrice(total)}</span>
                </div>
                <div className="additional-info">
                    <div className="info-item">
                        <img src={guaranteeIcon} alt="Guarantee" />
                        <div>
                            <h3>Guarantee</h3>
                            <p>Triple A's Technology values your patronage. If you're not satisfied with your purchase, please review our <Link to="/return-refund-policy">Return/Refund or Exchange Policy</Link>.</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <img src={fastShipIcon} alt="Fast Shipping" />
                        <div>
                            <h3>Fast Shipping</h3>
                            <p>Choose how you want your order delivered. Get as much access as scheduling your delivery. Check <Link to="/faq">Our FAQ</Link></p>
                        </div>
                    </div>
                    <div className="info-item">
                        <img src={qualityAssuredIcon} alt="Quality Assured" />
                        <div>
                            <h3>Quality Assured</h3>
                            <p>We offer all our customers ultimate peace of mind. We have you covered 100% on every eligible purchase.</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <img src={customerServiceIcon} alt="Customer Service" />
                        <div>
                            <h3>Customer Service</h3>
                            <p>Walk in: Ikeja - Lagos Office 22 Oba Akran Avenue, Ikeja, Lagos. Or Call : +2348034593459</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;