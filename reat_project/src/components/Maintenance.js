// src/components/Maintenance.js
import React from 'react';
import './Maintenance.css';  // Add custom styles if needed
import maintenanceGif from '../pictures/maintainance.jpg';  // Import the GIF

const Maintenance = () => {
  return (
    <div className="maintenance-container">
      <h1>We’ll be back soon!</h1>
      <p>Sorry for the inconvenience, but we're performing some maintenance right now. Please check back later.</p>
      <img src={maintenanceGif} alt="Maintenance in progress" className="maintenance-gif" />
    </div>
  );
};

export default Maintenance;
