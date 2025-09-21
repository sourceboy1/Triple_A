import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // ✅ import useUser
import homeIcon from '../pictures/home_icon.jpg';
import cartIcon from '../pictures/carticon1.webp';
import userIcon from '../pictures/usericon.jpg';
import searchIcon from '../pictures/searchicon.jpg';
import './FloatingNav.css';

const FloatingNav = ({ onSearchClick }) => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useUser(); // ✅ access login status

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isMobile) return null;

  return (
    <div className="floating-nav">
      <img 
        src={homeIcon} 
        alt="Home" 
        className="nav-icon" 
        onClick={() => { navigate('/'); handleScrollToTop(); }} 
      />
      <img 
        src={cartIcon} 
        alt="Cart" 
        className="nav-icon" 
        onClick={() => { navigate('/cart'); handleScrollToTop(); }} 
      />
      <img 
        src={searchIcon} 
        alt="Search" 
        className="nav-icon" 
        onClick={() => { navigate('/search'); handleScrollToTop(); }} 
      />
      <img 
        src={userIcon} 
        alt="User" 
        className="nav-icon" 
        onClick={() => { 
          if (isLoggedIn) {
            navigate('/account');
          } else {
            navigate('/signin');
          }
          handleScrollToTop(); 
        }} 
      />
    </div>
  );
};

export default FloatingNav;
