import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api'; // ✅ Unified API import
import './PaymentBankTransfer.css';

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

    const formatPrice = (amount) => amount.toLocaleString();

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
        <div className="transfer-container">
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
                <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                <p><strong>Our Bank Details:</strong></p>
                <p><strong>Bank:</strong> Guaranty Trust Bank</p>
                <p><strong>Account Number:</strong> 0273759604</p>
                <p><strong>Account Name:</strong> Triple A's Technology</p>
            </div>
            <div className="action-buttons">
                <button className="go-home-button" onClick={() => navigate('/')}>Go Home</button>
                <button className="cancel-order-button" onClick={handleCancelOrder}>Cancel Order</button>
            </div>
            {isCanceling && cancelOrderDialog}
        </div>
    );
};

export default Transfer;
