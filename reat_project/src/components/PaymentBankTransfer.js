import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api';
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
    products = [],
  } = state || {};

  const formatPrice = (amount) =>
    Number(amount).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  const handleCancelOrder = () => setIsCanceling(true);

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

  return (
    <div className="transfer-page-wrapper">
      <div className="transfer-container">
        <div className="order-details-card">
          <h2>Order #{orderId}</h2>
          <h3>Thank You!</h3>
          <p className="confirmation-message">
            Your order is confirmed. A confirmation email has been sent to <strong>{email}</strong>.
          </p>

          <div className="customer-details">
            <h4>Customer Details</h4>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Billing/Shipping Address:</strong></p>
            <p>{address}</p>
          </div>
        </div>

        <div className="order-summary-card">
          <h2>Order Summary</h2>
          <ul className="order-summary-items">
            {products.length > 0 ? (
              products.map((item) => (
                <li key={item.product_id} className="order-summary-item">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="order-summary-item-image" />
                  )}
                  <div className="order-summary-item-details">
                    <h3>{item.name}</h3>
                    <p>Price: {formatPrice(item.price)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total: {formatPrice(item.price * item.quantity)}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="no-products">No products found in this order.</li>
            )}
          </ul>
          <div className="summary-line"><span>Subtotal:</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-line"><span>Shipping Cost:</span><span>{formatPrice(shippingCost)}</span></div>
          <div className="summary-line total-amount"><span>Total:</span><span>{formatPrice(total)}</span></div>

          <p className="payment-instruction">
            Make your payment directly into our bank account. Use your Order ID as the payment reference.
          </p>
          <div className="bank-details">
            <p><strong>Bank:</strong> Guaranty Trust Bank</p>
            <p><strong>Account Number:</strong> 3001110047</p>
            <p><strong>Account Name:</strong> Triple A's Technology</p>
          </div>
        </div>

        <div className="action-buttons">
          <button className="go-home-button" onClick={() => navigate('/')}>Go Home</button>
          <button className="cancel-order-button" onClick={handleCancelOrder}>Cancel Order</button>
        </div>

        {isCanceling && (
          <div className="overlay">
            <div className="cancel-dialog">
              <p>Are you sure you want to cancel this order?</p>
              <div className="dialog-buttons">
                <button onClick={confirmCancelOrder} className="dialog-confirm-button">Yes, Cancel</button>
                <button onClick={() => setIsCanceling(false)} className="dialog-cancel-button">No, Keep</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfer;
