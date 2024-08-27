import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext'; // Correctly import UserContext
import './Styling.css';
import companyLogo from '../pictures/company logo.jpg';
import searchIcon from '../pictures/search.jpg';
import arrowIcon from '../pictures/arrow.jpg';
import cartIcon from '../pictures/cart.jpg';
import userIcon from '../icons/usericon.jpg';
import axios from 'axios';

const Navbar = () => {
  const [products, setProducts] = useState([]);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false); // State for user dropdown
  const categoryDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

  // Use UserContext to access username and login status
  const { isLoggedIn, username, signOut } = useUser();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

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
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setCategoryDropdownVisible(false);
      }

      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCategoryDropdown = () => {
    setCategoryDropdownVisible(!categoryDropdownVisible);
  };

  const toggleUserDropdown = () => {
    setUserDropdownVisible(!userDropdownVisible);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategoryDropdownVisible(false);
  };

  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`);
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setCategoryDropdownVisible(false);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/search?query=${encodeURIComponent(product.name)}&category=${encodeURIComponent(selectedCategory)}`);
    setFilteredProducts([]);
  };

  const handleAccountClick = () => {
    navigate('/account');
  };

  const handleSignOut = () => {
    // Clear authentication data
    signOut();
    
    // Redirect to homepage or login page
    navigate('/');
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

        <div className="search-bar-container">
          <div className="search-with-dropdown">
            <div
              className="all-dropdown"
              onClick={toggleCategoryDropdown}
              ref={categoryDropdownRef}
            >
              <span>{selectedCategory}</span>
              <img
                src={arrowIcon}
                alt="Arrow"
                className={`arrow ${categoryDropdownVisible ? 'down' : 'left'}`}
              />
              {categoryDropdownVisible && (
                <div className="dropdown-content show">
                  <a href="#" onClick={() => handleCategoryClick('All')}>All</a>
                  <a href="#" onClick={() => handleCategoryClick('Phones & Tablets')}>Phones & Tablets</a>
                  <a href="#" onClick={() => handleCategoryClick('AirPods')}>AirPods</a>
                  <a href="#" onClick={() => handleCategoryClick('Laptops')}>Laptops</a>
                  <a href="#" onClick={() => handleCategoryClick('Pouches & Screen Guides')}>Pouches & Screen Guides</a>
                  <a href="#" onClick={() => handleCategoryClick('Powerbanks')}>Powerbanks</a>
                  <a href="#" onClick={() => handleCategoryClick('Watches')}>Watches</a>
                  <a href="#" onClick={() => handleCategoryClick('Games')}>Games</a>
                </div>
              )}
            </div>
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search..."
              ref={searchInputRef}
            />
            <button className="search-button" onClick={handleSearch}>
              <img src={searchIcon} alt="Search" />
            </button>
            {filteredProducts.length > 0 && (
              <div className="suggestions-dropdown">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    {product.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="navbar-right">
          <a href="#" onClick={() => navigate('/cart')} className="cart-link">
            <img src={cartIcon} alt="Cart" className="cart-icon" />
            <span className="cart-count">{cartCount}</span>
          </a>
          <div className="user-info" onClick={toggleUserDropdown} ref={userDropdownRef}>
            <img src={userIcon} alt="User Icon" className="user-icon" />
            <div className="greeting">
              <span className="hello">{isLoggedIn ? 'Hello' : 'Sign In' }</span>
              <span className="username">{isLoggedIn ? username : 'Account'}</span>
            </div>
            {userDropdownVisible && (
              <div className="account-dropdown">
                {isLoggedIn ? (
                  <>
                    <a href="#" onClick={handleAccountClick}>Account</a>
                    <a href="#" onClick={handleSignOut}>Sign Out</a>
                  </>
                ) : (
                  <>
                    <a href="#" onClick={() => navigate('/signin')}>Sign In</a>
                    <a href="#" onClick={() => navigate('/signup')}>Register</a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
