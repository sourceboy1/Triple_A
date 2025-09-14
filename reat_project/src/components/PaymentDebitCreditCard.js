import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api'; // ✅ Unified API import
import './PaymentBankTransfer.css'; // Using the same CSS for consistency
import { PaystackButton } from 'react-paystack'; // Import PaystackButton

const PaymentDebitCreditCard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCanceling, setIsCanceling] = useState(false);
    const { state } = location;
    const token = localStorage.getItem('token');
    const paystackPublicKey = 'pk_live_465faeaf26bb124923dde0c51f9f2b6a1b9ee006'; // Your Paystack Public Key

    const {
        orderId = 'N/A',
        email = 'N/A',
        phone = 'N/A',
        address = 'N/A',
        subtotal = 0,
        shippingCost = 0,
        total = 0,
        products = []
    } = state || {};

    const formatPrice = (amount) => amount.toLocaleString();

    // Paystack configuration
    const config = {
        reference: new Date().getTime().toString(), // Unique reference for each transaction
        email: email,
        amount: total * 100, // Amount in kobo
        publicKey: paystackPublicKey,
        metadata: {
            order_id: orderId,
            custom_fields: [
                {
                    display_name: "Order ID",
                    variable_name: "order_id",
                    value: orderId,
                },
                {
                    display_name: "Customer Email",
                    variable_name: "customer_email",
                    value: email,
                },
            ],
        },
    };

    // Callback for successful payment
    const handleSuccess = async (response) => {
        // Send payment confirmation to your backend
        try {
            await api.post(`/orders/${orderId}/confirm_payment/`, {
                transaction_reference: response.reference,
                payment_method: 'card',
                // You might need to send other details like status, channel etc.
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            });
            alert('Payment successful! Your order has been confirmed.');
            navigate('/order-success', { state: { orderId } }); // Navigate to a success page or home
        } catch (error) {
            console.error('Error confirming payment with backend:', error);
            alert('Payment successful, but there was an issue confirming with our system. Please contact support.');
            navigate('/order-failure'); // Navigate to a failure page
        }
    };

    // Callback for payment close
    const handleClose = () => {
        alert('Payment window closed. You can try again or cancel your order.');
    };

    const componentProps = {
        ...config,
        text: 'Pay with Card',
        onSuccess: (response) => handleSuccess(response),
        onClose: handleClose,
    };

    const handleCancelOrder = () => {
        setIsCanceling(true);
    };

    const confirmCancelOrder = async () => {
        try {
            await api.post(`/orders/${orderId}/cancel/`, {}, {
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
        <div className="transfer-container"> {/* Reusing the transfer-container styling */}
            <div className="order-section">
                <h2>Order #{orderId}</h2>
                <h3>Thank You!</h3>
                <p>Your order is confirmed</p>
                <p>
                    We have accepted your order and are getting it ready. A confirmation email has been sent to
                    <strong> {email}</strong>.
                </p>

                <div className="customer-details">
                    <h4>Customer Details</h4>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Phone:</strong> {phone}</p>
                    <p><strong>Billing Address:</strong></p>
                    <p>{address}</p>

                    <p><strong>Shipping Address:</strong></p>
                    <p>{address}</p>
                </div>
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
                <p>
                    Click the button below to complete your payment securely via Debit/Credit Card using Paystack.
                </p>
                <div className="paystack-button-container">
                    <PaystackButton {...componentProps} className="paystack-button" />
                </div>
            </div>
            <div className="action-buttons">
                <button className="go-home-button" onClick={() => navigate('/')}>Go Home</button>
                <button className="cancel-order-button" onClick={handleCancelOrder}>Cancel Order</button>
            </div>
            {isCanceling && cancelOrderDialog}
        </div>
    );
};

export default PaymentDebitCreditCard;