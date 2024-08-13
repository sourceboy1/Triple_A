import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Styling.css';
import companyLogo from '../pictures/company logo.jpg';
import searchIcon from '../pictures/search.jpg';
import arrowIcon from '../pictures/arrow.jpg';
import cartIcon from '../pictures/cart.jpg';
import axios from 'axios';

const Navbar = () => {
  const [products, setProducts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null); // Reference for search input
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setDropdownVisible(false);
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
      setDropdownVisible(false); // Hide the category dropdown
    } else {
      setFilteredProducts([]);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/search?query=${encodeURIComponent(product.name)}&category=${encodeURIComponent(selectedCategory)}`);
    setFilteredProducts([]);
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
              onClick={toggleDropdown} 
              ref={dropdownRef}
            >
              <span>{selectedCategory}</span>
              <img
                src={arrowIcon}
                alt="Arrow"
                className={`arrow ${dropdownVisible ? 'down' : 'left'}`}
              />
              {dropdownVisible && (
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
              placeholder={`Search...`} // Placeholder text only
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
          <a href="#" onClick={() => navigate('/cart')}>
            <img src={cartIcon} alt="Cart" className="cart-icon" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </a>
          <button onClick={() => navigate('/signup')} className="button">Sign Up</button>
          <button onClick={() => navigate('/login')} className="button">Log In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;












