import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Checkout.css';
import guaranteeIcon from '../icons/guarantee-icon.jpg';
import fastShipIcon from '../icons/fast-ship-icon.jpg';
import qualityAssuredIcon from '../icons/quality-assured-icon.jpg';
import customerServiceIcon from '../icons/customer-service-icon.jpg';
import debitcardImage from '../pictures/debitcard.jpg';
import PhoneInputComponent from '../PhoneInput'; // Import PhoneInputComponent
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import countryList from 'react-select-country-list';
import api from '../Api';

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
    const { cart, clearCart } = useCart();
    const [showTerms, setShowTerms] = useState(false);
    const { isLoggedIn, firstName: userFirstName, lastName: userLastName, email: userEmail } = useUser();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const options = countryList().getData();

    // Refs for scrolling
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
         if (isLoggedIn) {
             setEmail(userEmail || '');
             setFirstName(userFirstName || '');
             setLastName(userLastName || '');
         }
     }, [isLoggedIn, userEmail, userFirstName, userLastName]);
    


    const paymentMethodIds = {
        bank_transfer: 1,
        debit_credit_cards: 2,
    };
    

    const handlePlaceOrder = async () => {
        setEmailError('');

        const scrollToError = (ref) => {
            if (ref && ref.current) {
                ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                ref.current.focus();
            }
        };
    
        if (!termsAgreed) {
            setEmailError('You must agree to the terms and conditions before placing the order.');
            return;
        }
    
        
    
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Please enter a valid email address.');
            scrollToError(emailRef);
            return;
        }
    
        if (!firstName) {
            setEmailError('Please fill in your first name.');
            scrollToError(firstNameRef);
            return;
        }

        if (!lastName) {
            setEmailError('Please fill in your last name.');
            scrollToError(lastNameRef);
            return;
        }

        if (!addressLine1) {
            setEmailError('Please fill in your address.');
            scrollToError(addressRef);
            return;
        }

        if (!city) {
            setEmailError('Please fill in your city.');
            scrollToError(cityRef);
            return;
        }

        if (!state) {
            setEmailError('Please fill in your state.');
            scrollToError(stateRef);
            return;
        }

        if (!postalCode) {
            setEmailError('Please fill in your postal code.');
            scrollToError(postalCodeRef);
            return;
        }

        if (!phone) {
            setEmailError('Please fill in your phone number.');
            scrollToError(phoneRef);
            return;
        }

        if (phone.length < 10) {
            setEmailError('Please enter a valid phone number.');
            scrollToError(phoneRef);
            return;
        }

        if (postalCode.length < 5) {
            setEmailError('Please enter a valid postal code.');
            scrollToError(postalCodeRef);
            return;
        }
    
        // Full address formatting
        const fullAddress = `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}`;
        const userId = parseInt(localStorage.getItem('userId'), 10);
    
        if (!token) {
            setEmailError('Authentication token is missing. Please log in again.');
            return;
        }
    
        if (isNaN(userId)) {
            setEmailError('There was an issue with your login session. Please log in again.');
            return;
        }
        if (!email || !firstName || !lastName || !addressLine1 || !city || !state || !postalCode || !country || !phone) {
            setEmailError('Please fill in all required fields.');
            return;
        }
    
        const paymentMethodId = paymentMethodIds[paymentMethod] || 1;  // Map payment methods
        const shippingCost = getShippingCost();  // Assume this function calculates shipping cost
        const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const total = subtotal + shippingCost;
    
        const orderData = {
            user_id: userId,
            email: email,
            first_name: firstName,
            last_name: lastName,
            address: fullAddress,
            city: city,
            state: state,
            postal_code: postalCode,
            country: country,
            phone: phone,
            shipping_method: shippingMethod,
            order_note: orderNote,
            payment_method_id: paymentMethodId,
            cart_items: cart.map(item => ({
                product: item.product_id,
                name: item.name,          // Include product name
                image_url: item.image_url, // Include product image URL
                quantity: item.quantity,
                price: item.price
            })),
            shipping_cost: shippingCost,
            total_amount: total,
        };
        
    
        try {
        console.log('Order data being sent:', orderData);

        // ✅ Use centralized API
        const response = await api.post('/orders/', orderData);

        clearCart();
    
            const redirectPath = paymentMethod === 'debit_credit_cards' ? '/payment/debit-credit-card' : '/payment/bank-transfer';
            navigate(redirectPath, { state: { 
                orderId: response.data.order_id, 
                email, 
                phone, 
                address: fullAddress, 
                subtotal, 
                shippingCost, 
                total, 
                products: cart 
            }});
        } catch (error) {
            console.error('Error placing the order:', error);
            setEmailError('There was an error placing your order. Please try again.');
        }
    };
    
    
    
    

    const formatPrice = (price) => {
        return new Intl.NumberFormat().format(price);
    };

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const getShippingCost = () => {
        switch (shippingMethod) {
            case 'pickup': return 0;
            case 'express': return 0.01;
            case 'area1': return 1500;
            case 'satellite': return 1500;
            case 'area2': return 2500;
            case 'abule_egba': return 3000;
            case 'ikeja': return 3000;
            case 'lagos_mainland': return 5000;
            default: return 0;
        }
    };

    const shippingCost = getShippingCost();
    const total = subtotal + shippingCost;

    const toggleTerms = (e) => {
        e.preventDefault();
        setShowTerms(!showTerms);
    };

    

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
                        ref={emailRef}  // Attach ref
                        type="email"
                        placeholder="Email *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                </div>

                <div>
                    <h2>Shipping Address</h2>
                    <input ref={firstNameRef} type="text" placeholder="First name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <input ref={lastNameRef} type="text" placeholder="Last name *" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input ref={addressRef} type="text" placeholder="Address *" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                    <input ref={cityRef} type="text" placeholder="City *" value={city} onChange={(e) => setCity(e.target.value)} />
                    <input ref={stateRef} type="text" placeholder="State *" value={state} onChange={(e) => setState(e.target.value)} />
                    <input ref={postalCodeRef} type="text" placeholder="Postal code *" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <PhoneInputComponent value={phone} onChange={setPhone} />
                </div>

                <div>
                    <h2>Shipping Method</h2>
                    <div className="shipping-method-container">
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="pickup"
                                checked={shippingMethod === 'pickup'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            Store Pickup: Free
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="express"
                                checked={shippingMethod === 'express'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            Express/Same Day Delivery: ₦0.01
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="area1"
                                checked={shippingMethod === 'area1'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            Amuwo Odofin GRA/Festac: ₦1,500.00
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="satellite"
                                checked={shippingMethod === 'satellite'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            Satellite town/Suru Alaba/Isolo/Maza maza: ₦1,500.00
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="area2"
                                checked={shippingMethod === 'area2'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            Ajao Estate/Oshodi/Lawanson/Orile/Itire/Gbagada/Apapa/Surulere/Tradefair: ₦2,500.00
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="abule_egba"
                                checked={shippingMethod === 'abule_egba'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            Abule Egba/ Iyana Ipaja/ Ayobo: ₦3,000.00
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="ikeja"
                                checked={shippingMethod === 'ikeja'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            IKEJA AXIS/ BARIGA/ALAGOMEJI/FADEYI/PALM GROOVE: ₦3,000.00
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="shippingMethod"
                                value="lagos_mainland"
                                checked={shippingMethod === 'lagos_mainland'}
                                onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            LAGOS MAINLAND: ₦5,000.00
                        </label>
                    </div>
                </div>

                <div>
                    <h2>Order Note (Optional)</h2>
                    <textarea placeholder="Note about your order" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
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
                                Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website. These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.<br /><br />
                                If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue. For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.<br /><br />
                                <strong>Why do we use it?</strong><br /><br />
                                If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.<br /><br />
                                Visitor comments may be checked through an automated spam detection service.
                            </p>
                        </div>
                    </div>
                )}


                <button onClick={handlePlaceOrder}>Place Order</button>
            </div>

            <div className="order-summary">
                <h2>Order Summary</h2>
                <ul className="order-summary-items">
                    {cart.map((item) => (
                        <li key={item.product_id} className="order-summary-item">
                            <img src={item.image_url} alt={item.name} className="order-summary-item-image" />
                            <div className="order-summary-item-details">
                                <h3>{item.name}</h3>
                                <p>Price: ₦{formatPrice(item.price)}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Total: ₦{formatPrice(item.price * item.quantity)}</p>
                            </div>
                        </li>
                    ))}
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
