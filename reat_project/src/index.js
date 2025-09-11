// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4'; // Import react-ga4

// Initialize Google Analytics with your Measurement ID
// Replace 'G-XXXXXXXXXX' with your actual Measurement ID
ReactGA.initialize('G-LM8BDKLGWE');

// To track initial page view (optional, react-router-dom handles subsequent views)
// This will track the initial load of your application
ReactGA.send({ hitType: "pageview", page: window.location.pathname });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();