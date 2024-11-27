import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import homeIcon from '../pictures/home_icon.jpg';
import cartIcon from '../pictures/carticon.jpg';
import userIcon from '../pictures/usericon.jpg';
import searchIcon from '../pictures/searchicon.jpg';
import './FloatingNav.css';

const FloatingNav = ({ onSearchClick }) => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Check screen size to determine if we should display this component
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this width as needed
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top of the page
  };

  if (!isMobile) return null; // Don't render if it's not a mobile screen

  return (
    <div className="floating-nav">
      <img 
        src={homeIcon} 
        alt="Home" 
        className="nav-icon" 
        onClick={() => { navigate('/'); handleScrollToTop(); }} // Scroll to top when navigating to home
      />
      <img 
        src={cartIcon} 
        alt="Cart" 
        className="nav-icon" 
        onClick={() => { navigate('/cart'); handleScrollToTop(); }} // Scroll to top when navigating to cart
      />
      <img 
        src={searchIcon} 
        alt="Search" 
        className="nav-icon" 
        onClick={() => { 
          navigate('/search');  // Navigate to /search route
          handleScrollToTop();   // Scroll to top
        }} 
      />

      <img 
        src={userIcon} 
        alt="User" 
        className="nav-icon" 
        onClick={() => { navigate('/account'); handleScrollToTop(); }} // Scroll to top when navigating to account
      />
    </div>
  );
};

export default FloatingNav;
