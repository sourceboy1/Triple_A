import React from 'react';
import './FeatureDisplay.css';
import chatLogo from '../icons/speedydeliverylogo.jpg';
import flexibleReturn from '../icons/flexiblereturnlogo.jpg';
import securePayment from '../icons/securepaymentlogo.jpg';
import supportLogo from '../icons/chatlogo.jpg';
import greatPromos from '../icons/greatpromos.jpg';

const FeatureDisplay = () => {
  return (
    <div className="feature-container">
      <div className="feature-item">
        <div className="feature-icon-wrap">
          <img src={chatLogo} alt="Speedy Delivery" className="feature-icon" />
        </div>
        <div className="feature-text">
          <h4>Speedy Delivery</h4>
          <p>Get your orders as soon as you want them!</p>
        </div>
      </div>

      <div className="feature-item">
        <div className="feature-icon-wrap">
          <img src={flexibleReturn} alt="Flexible Return" className="feature-icon" />
        </div>
        <div className="feature-text">
          <h4>Flexible Returns</h4>
          <p>Problems with your purchase? No sweat, we got you!</p>
        </div>
      </div>

      <div className="feature-item">
        <div className="feature-icon-wrap">
          <img src={securePayment} alt="Secure Payment" className="feature-icon" />
        </div>
        <div className="feature-text">
          <h4>Secure Payment</h4>
          <p>Guaranteed Privacy when transacting on Triple A's Technology!</p>
        </div>
      </div>

      <div className="feature-item">
        <div className="feature-icon-wrap">
          <img src={supportLogo} alt="Support" className="feature-icon" />
        </div>
        <div className="feature-text">
          <h4>24/7 Support</h4>
          <p>Dedicated support with fast response rate!</p>
        </div>
      </div>

      <div className="feature-item">
        <div className="feature-icon-wrap">
          <img src={greatPromos} alt="Great Promos" className="feature-icon" />
        </div>
        <div className="feature-text">
          <h4>Great Promos</h4>
          <p>Never miss out on our amazing promo sales!</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureDisplay;