// src/components/Maintenance.js
import React from 'react';
import './Maintenance.css';
import maintenanceGif from '../pictures/maintainance.jpg';

const Maintenance = () => {
  return (
    <div className="maintenance-container">
      <h1>We’ll be back soon!</h1>
      <img src={maintenanceGif} alt="Maintenance in progress" className="maintenance-gif" />
      <p>
        Sorry for the inconvenience, but we're performing some maintenance right now. 
        Please check back later.
      </p>

      {/* 👇 Hidden Admin Login link */}
      <div className="admin-login-link">
        <a href="/admin">Admin Login</a>
      </div>
    </div>
  );
};

export default Maintenance;
