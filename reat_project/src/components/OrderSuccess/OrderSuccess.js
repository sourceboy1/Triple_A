import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, successMessage } = location.state || {};

  useEffect(() => {
    if (!orderId || !successMessage) {
      navigate('/');
    }
  }, [orderId, successMessage, navigate]);

  if (!orderId || !successMessage) return null;

  return (
    <div className="order-success-container">
      <FaCheckCircle className="success-icon" />
      <h1>Order Placed Successfully!</h1>
      <p className="order-id-display">Your Order ID: <strong>#{orderId}</strong></p>
      <p className="success-message-text">{successMessage}</p>
      <div className="success-actions">
        <button
          className="view-order-button"
          onClick={() => navigate(`/order/${orderId}`)} // ✅ corrected path
        >
          <FaShoppingBag /> View My Order
        </button>
        <button className="continue-shopping-button" onClick={() => navigate('/')}>
          <FaHome /> Continue Shopping
        </button>
      </div>
      <p className="thank-you-note">
        Thank you for your purchase with Triple A's Technology!
      </p>
    </div>
  );
};

export default OrderSuccess;
