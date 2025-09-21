// src/components/OrderFailure/OrderFailure.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaHome, FaRedoAlt } from 'react-icons/fa';
import './OrderFailure.css';

const OrderFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { errorMessage, orderId, retryData } = location.state || {};

  useEffect(() => {
    if (!errorMessage) {
      navigate('/');
    }
  }, [errorMessage, navigate]);

  if (!errorMessage) return null;

  const handleTryAgain = () => {
    // If we have packaged retryData (full order data), send it back and request autoOpen
    if (retryData) {
      navigate('/payment/debit-credit-card', { state: { ...retryData, autoOpen: true } });
      return;
    }

    // If only orderId is available, send orderId + autoOpen (Payment page will fetch details)
    if (orderId) {
      navigate('/payment/debit-credit-card', { state: { orderId, autoOpen: true } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="order-failure-container">
      <FaTimesCircle className="failure-icon" />
      <h1>Payment Failed or Confirmation Issue</h1>
      {orderId && <p className="order-id-display">For Order ID: <strong>#{orderId}</strong></p>}
      <p className="failure-message-text">{errorMessage}</p>

      <p className="guidance-text">
        We encountered an issue processing or confirming your payment. You can try again or contact support.
      </p>

      <div className="failure-actions">
        <button className="try-again-button" onClick={handleTryAgain}>
          <FaRedoAlt /> Try Payment Again
        </button>
        <button className="go-home-button" onClick={() => navigate('/')}>
          <FaHome /> Go to Home Page
        </button>
      </div>

      <p className="contact-support-note">
        For assistance, please contact customer support with your Order ID and the error message.
      </p>
    </div>
  );
};

export default OrderFailure;
