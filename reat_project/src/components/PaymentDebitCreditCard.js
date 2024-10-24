import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';
import axios from 'axios';
import guaranteeIcon from '../icons/guarantee-icon.jpg';
import fastShipIcon from '../icons/fast-ship-icon.jpg';
import qualityAssuredIcon from '../icons/quality-assured-icon.jpg';
import customerServiceIcon from '../icons/customer-service-icon.jpg';
import './PaymentDebitCreditCard.css';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const [isCanceling, setIsCanceling] = useState(false); // New state for canceling order

    const {
        orderId = 'N/A',
        products = []
    } = state || {};
    const token = localStorage.getItem('token');

    // Paystack Public Key and other configurations
    const publicKey = "pk_live_465faeaf26bb124923dde0c51f9f2b6a1b9ee006"; // Your Paystack public key
    const email = "useremail@example.com"; // You may need to get this dynamically from the user's info
    const totalAmount = products.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 100; // Paystack uses kobo, so multiply amount by 100
    const currency = 'NGN';

    // Paystack props configuration
    const componentProps = {
        email,
        amount: totalAmount,
        publicKey,
        text: "Pay with Paystack",
        onSuccess: (response) => {
            console.log("Payment Successful!", response);
            // You can handle post-payment logic here, such as updating the order status or redirecting to a success page
            navigate('/payment-success', { state: { reference: response.reference } });
        },
        onClose: () => {
            console.log("Payment popup closed");
        }
    };

    const formatPrice = (amount) => {
        const numAmount = Number(amount) || 0;
        return numAmount.toLocaleString();
    };

    const getCurrentDate = () => {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const handleCancelOrder = () => {
        setIsCanceling(true); // Show confirmation dialog
    };

    const confirmCancelOrder = async () => {
        try {
            if (orderId === 'N/A') {
                alert('Order ID is not available');
                return;
            }

            const response = await axios.post(`http://localhost:8000/api/orders/${orderId}/cancel/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            });

            navigate('/'); // Redirect after successful cancellation
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    const cancelOrderDialog = (
        <div className="cancel-dialog">
            <p>Are you sure you want to cancel this order?</p>
            <button onClick={confirmCancelOrder} className="dialog-confirm-button">Yes, Cancel Order</button>
            <button onClick={() => setIsCanceling(false)} className="dialog-cancel-button">No, Keep Order</button>
        </div>
    );

    return (
        <div className="payment-page-container">
            <div className="payment-info-section">
                <div className="payment-info">
                    <h2>Complete your order</h2>
                    <p><strong>Order number:</strong> #{orderId || 'N/A'}</p>
                    <p><strong>Date:</strong> {getCurrentDate()}</p>
                    <p><strong>Total:</strong> ₦{formatPrice(totalAmount / 100)}</p>
                    <p><strong>Payment method:</strong> Debit/Credit Cards</p>
                    <p>Thank you for your order, please click the button below to pay with Paystack.</p>
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <ul className="order-summary-items">
                        {products.length > 0 ? (
                            products.map((item) => (
                                <li key={item.product_id} className="order-summary-item">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="order-summary-item-image"
                                    />
                                    <div className="order-summary-item-details">
                                        <h3>{item.name}</h3>
                                        <p>Price: ₦{formatPrice(item.price)}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Total: ₦{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li>No products found</li>
                        )}
                    </ul>
                </div>

                <div className="info-section">
                    <h1>Your Reliable IT Gadgets & Accessories Store</h1>

                    <div className="info-block">
                        <img src={guaranteeIcon} alt="Guaranteed Product Satisfaction" />
                        <div>
                            <h4>Guaranteed Product Satisfaction</h4>
                            <p>Triple A's Technology values your patronage. If you're not satisfied with your purchase, please review our <Link to="/return-refund-policy">Return/Refund or Exchange Policy</Link>.</p>
                        </div>
                    </div>

                    <div className="info-block">
                        <img src={fastShipIcon} alt="Your Preferred Delivery Option" />
                        <div>
                            <h4>Your Preferred Delivery Option</h4>
                            <p>Choose how you want your order delivered. Get as much access as scheduling your delivery. Check <Link to="/faq">Our FAQ</Link></p>
                        </div>
                    </div>

                    <div className="info-block">
                        <img src={qualityAssuredIcon} alt="Guaranteed Buyers Protection" />
                        <div>
                            <h4>Guaranteed Buyers Protection</h4>
                            <p>We offer all our customers ultimate peace of mind. We cover you 100% on every eligible purchase.</p>
                        </div>
                    </div>

                    <div className="info-block">
                        <img src={customerServiceIcon} alt="Passionate Customer Service" />
                        <div>
                            <h4>Passionate Customer Service</h4>
                            <p>Visit us at: Ikeja - Lagos Office, 2 Obaakran Avenue, Ikeja, Lagos.</p>
                            <p>Or Call: +2348034593459</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="payment-buttons">
                <PaystackButton {...componentProps} /> 
                <button onClick={handleCancelOrder}>Cancel order & return home</button>
            </div>

            {/* Show cancellation dialog if canceling */}
            {isCanceling && cancelOrderDialog}
        </div>
    );
};

export default PaymentPage;
