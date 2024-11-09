// FloatingNav.js
import React, { useEffect, useState } from 'react';
import homeIcon from '../pictures/home_icon.jpg';
import cartIcon from '../pictures/carticon.jpg';
import userIcon from '../pictures/usericon.jpg';
import searchIcon from '../pictures/searchicon.jpg';
import './FloatingNav.css';

const FloatingNav = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size to determine if we should display this component
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this width as needed
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) return null; // Don't render if it's not a mobile screen

  return (
    <div className="floating-nav">
      <img src={homeIcon} alt="Home" className="nav-icon" />
      <img src={cartIcon} alt="Cart" className="nav-icon" />
      <img src={userIcon} alt="User" className="nav-icon" />
      <img src={searchIcon} alt="Search" className="nav-icon" />
    </div>
  );
};

export default FloatingNav;
