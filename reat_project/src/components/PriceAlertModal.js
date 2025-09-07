// components/PriceAlertModal.jsx
import React from 'react';
import './PriceAlertModal.css'; // We'll create this CSS file next

const PriceAlertModal = ({ show, onClose, product, type = 'general' }) => {
  if (!show) {
    return null;
  }

  const handleWhatsAppClick = () => {
    let message = "Hello, I'm interested in a price confirmation for products.";
    if (type === 'product' && product && product.name) {
      message = `Hello, I'm interested in confirming the price for ${product.name}.`;
    } else if (type === 'cart') {
      message = "Hello, I'd like to confirm the prices of items in my cart before placing an order.";
    }

    const whatsappUrl = `https://wa.me/2348034593459?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h3 className="modal-title">Price Alert!</h3>
        <p className="modal-message">
          Kindly make a price confirmation from our store before placing your orders due to fluctuation in market prices of products.
        </p>
        <p className="modal-contact">
          You can contact us on WhatsApp for confirmation:
        </p>
        <button className="whatsapp-button" onClick={handleWhatsAppClick}>
          Contact us on WhatsApp 
        </button>
      </div>
    </div>
  );
};

export default PriceAlertModal;