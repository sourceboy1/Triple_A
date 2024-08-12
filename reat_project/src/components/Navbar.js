import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // Import the custom hook
import './Styling.css';
import companyLogo from '../pictures/company logo.jpg';
import searchIcon from '../pictures/search.jpg';
import arrowIcon from '../pictures/arow.jpg';
import cartIcon from '../pictures/cart.jpg';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart(); // Get cartCount from the context

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLogInClick = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <a href="/">
            <img src={companyLogo} alt="Company Logo" className="company-logo" />
          </a>
          <div className="company-name">Triple A's Technology</div>
        </div>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li className="dropdown" ref={dropdownRef}>
            <a href="#" className="dropbtn" onClick={toggleDropdown}>
              Shop <img src={arrowIcon} alt="Arrow" className={`arrow ${dropdownVisible ? 'down' : 'left'}`} />
            </a>
            <div className={`dropdown-content ${dropdownVisible ? 'show' : ''}`}>
              <a href="/shop/phones-tablets">Phones & Tablets</a>
              <a href="/shop/airpods">AirPods</a>
              <a href="/shop/laptops">Laptops</a>
              <a href="/shop/pouches-screenguides">Pouches & Screen Guides</a>
              <a href="/shop/powerbanks">Powerbanks</a>
              <a href="/shop/watches">Watches</a>
              <a href="/shop/games">Games</a>
            </div>
          </li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/blog">Blog</a></li>
        </ul>
        <div className="navbar-right">
          <a href="/search">
            <img src={searchIcon} alt="Search" className="icon search-icon" />
          </a>
          <a href="/cart" className="cart-link">
            <img src={cartIcon} alt="Cart" className="icon cart-icon" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>} {/* Display cart count */}
          </a>
          <button onClick={handleSignUpClick} className="button">Sign Up</button>
          <button onClick={handleLogInClick} className="button">Log In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;







