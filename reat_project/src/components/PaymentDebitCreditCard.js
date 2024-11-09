import React, { useEffect, useState } from 'react';
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
    const [isCanceling, setIsCanceling] = useState(false);
    const [paystackOpen, setPaystackOpen] = useState(false);

    const {
        orderId = 'N/A',
        products = [],
        shippingCost = 0
    } = state || {};
    const token = localStorage.getItem('token');

    // Paystack Public Key and other configurations
    const publicKey = "pk_live_465faeaf26bb124923dde0c51f9f2b6a1b9ee006";
    const email = "useremail@example.com";

    // Calculate total amount
    const totalAmount = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalWithShipping = totalAmount + shippingCost;

    // Calculate Paystack fee
    let feeAmount = totalWithShipping <= 126600 ? totalWithShipping * 0.015 + 100 : 2000;
    const totalWithFee = totalWithShipping + feeAmount;
    const totalAmountInKobo = totalWithFee * 100;

    const componentProps = {
        email,
        amount: totalAmountInKobo,
        publicKey,
        text: "Pay with Paystack",
        onSuccess: (response) => {
            console.log("Payment Successful!", response);
            navigate('/payment-success', { state: { reference: response.reference } });
        },
        onClose: () => {
            console.log("Payment popup closed");
        },
        embed: true, // Enable embed mode for automatic popup
        reference: new Date().getTime().toString(),
    };

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top when component mounts
        setPaystackOpen(true); // Trigger Paystack pop-up on page load
    }, []);

    const formatPrice = (amount) => (Number(amount) || 0).toLocaleString();

    const getCurrentDate = () => {
        const date = new Date();
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleCancelOrder = () => {
        setIsCanceling(true);
    };

    const confirmCancelOrder = async () => {
        try {
            if (orderId === 'N/A') {
                alert('Order ID is not available');
                return;
            }

            await axios.post(`http://localhost:8000/api/orders/${orderId}/cancel/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            });

            navigate('/');
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
                    <p><strong>Subtotal:</strong> ₦{formatPrice(totalAmount)}</p>
                    <p><strong>Shipping Cost:</strong> ₦{formatPrice(shippingCost)}</p>
                    <p><strong>Total:</strong> ₦{formatPrice(totalWithShipping)}</p>
                    <p><strong>Payment method:</strong> Debit/Credit Cards</p>
                    <p>Thank you for your order, please click the button below to pay with Paystack.</p>

                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <ul className="order-summary-items">
                            {products.length > 0 ? (
                                products.map((item) => (
                                    <li key={item.product_id} className="order-summary-item">
                                        <img src={item.image_url} alt={item.name} className="order-summary-item-image" />
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
                            <p>Choose how you want your order delivered. Check <Link to="/faq">Our FAQ</Link></p>
                        </div>
                    </div>
                    <div className="info-block">
                        <img src={qualityAssuredIcon} alt="Guaranteed Buyers Protection" />
                        <div>
                            <h4>Guaranteed Buyers Protection</h4>
                            <p>We offer all our customers ultimate peace of mind on every eligible purchase.</p>
                        </div>
                    </div>
                    <div className="info-block">
                        <img src={customerServiceIcon} alt="Passionate Customer Service" />
                        <div>
                            <h4>Passionate Customer Service</h4>
                            <p>Visit us at: Ikeja - Lagos Office, 2 Obaakran Avenue, Ikeja, Lagos. Or Call: +2348034593459</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="payment-buttons">
                {paystackOpen && <PaystackButton {...componentProps} />}
                <button onClick={handleCancelOrder}>Cancel order & return home</button>
            </div>

            {isCanceling && cancelOrderDialog}
        </div>
    );
};

export default PaymentPage;
