// src/components/Maintenance.js
import React from 'react';
import './Maintenance.css';
import maintenanceGif from '../pictures/maintainance.jpg';

const Maintenance = () => {
  return (
    <div className="maintenance-container">
      <h1>We’ll be back soon!</h1>
      <img 
        src={maintenanceGif} 
        alt="Maintenance in progress" 
        className="maintenance-gif" 
      />
      <p>
        We apologize for the inconvenience. Our site is currently undergoing maintenance and will be back online shortly. Thank you for your patience.
      </p>
    </div>
  );
};

export default Maintenance;
