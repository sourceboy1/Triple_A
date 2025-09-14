import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api';
import './PaymentBankTransfer.css'; // Updated CSS file name
import { FaShoppingCart, FaUniversity, FaCheckCircle, FaHome, FaTimesCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'; // Added new icons

const Transfer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCanceling, setIsCanceling] = useState(false);
    const { state } = location;
    const token = localStorage.getItem('token');

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

    const formatPrice = (amount) => amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

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
            alert('Failed to cancel order. Please try again.');
        }
    };

    const cancelOrderDialog = (
        <div className="cancel-dialog-overlay">
            <div className="cancel-dialog">
                <FaExclamationTriangle className="dialog-icon warning" />
                <p>Are you sure you want to cancel this order?</p>
                <div className="dialog-buttons">
                    <button onClick={confirmCancelOrder} className="dialog-confirm-button">Yes, Cancel Order</button>
                    <button onClick={() => setIsCanceling(false)} className="dialog-cancel-button">No, Keep Order</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="payment-transfer-container">
            <div className="header-section">
                <h1>Bank Transfer Details <FaUniversity className="header-icon" /></h1>
                <p className="subtitle">Order ID: <strong>#{orderId}</strong></p>
                <p className="tagline">Complete your payment via bank transfer.</p>
            </div>

            <div className="content-wrapper">
                <div className="order-details-card glassmorphism">
                    <h2><FaCheckCircle /> Order Confirmation</h2>
                    <p className="confirmation-message">
                        Your order is confirmed! We're getting it ready. A confirmation email has been sent to
                        <strong> {email}</strong>.
                    </p>

                    <div className="customer-details-block">
                        <h3>Customer Details</h3>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Phone:</strong> {phone}</p>
                        <p><strong>Billing/Shipping Address:</strong> {address}</p>
                    </div>
                </div>

                <div className="bank-transfer-info-card glassmorphism">
                    <h2><FaUniversity /> Bank Transfer Instructions</h2>
                    <p className="instruction-text">
                        Please make your payment directly into our bank account. Ensure you use your **Order ID ({orderId})** as the payment reference. Your order will be shipped once the funds have cleared in our account.
                    </p>

                    <div className="bank-details-block">
                        <h3>Our Bank Details:</h3>
                        <p><strong>Bank:</strong> Guaranty Trust Bank (GTBank)</p>
                        <p><strong>Account Number:</strong> 3001110047</p>
                        <p><strong>Account Name:</strong> Triple A's Technology</p>
                        <p className="amount-due">Amount Due: <strong>{formatPrice(total)}</strong></p>
                    </div>
                    <div className="important-note">
                        <FaInfoCircle className="info-icon" />
                        <p><strong>Important:</strong> Please ensure the Order ID is included in your transfer reference for quick processing.</p>
                    </div>
                </div>

                <div className="order-summary-card glassmorphism">
                    <h2><FaShoppingCart /> Order Summary</h2>
                    <div className="order-items-list">
                        {products.length > 0 ? (
                            products.map((item) => (
                                <div key={item.product_id} className="order-item">
                                    <img src={item.image_url} alt={item.name} />
                                    <div className="item-info">
                                        <h3>{item.name}</h3>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: {formatPrice(item.price)}</p>
                                    </div>
                                    <span className="item-total">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))
                        ) : (
                            <p className="no-products-message">No products found in this order.</p>
                        )}
                    </div>
                    <div className="summary-section">
                        <div className="summary-line">
                            <span>Subtotal:</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="summary-line">
                            <span>Shipping Cost:</span>
                            <span>{formatPrice(shippingCost)}</span>
                        </div>
                        <div className="summary-line total-amount-final">
                            <span>Total Due:</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="action-buttons-footer">
                <button className="go-home-button" onClick={() => navigate('/')}>
                    <FaHome /> Back to Home
                </button>
                <button className="cancel-order-button" onClick={handleCancelOrder}>
                    <FaTimesCircle /> Cancel Order
                </button>
            </div>

            {isCanceling && cancelOrderDialog}
        </div>
    );
};

export default Transfer;