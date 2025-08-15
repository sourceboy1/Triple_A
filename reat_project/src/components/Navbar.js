import React, { useState, useRef, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useWishlist } from '../contexts/WishlistContext';
import './Styling.css';
import companyLogo from '../pictures/company logo.jpg';
import searchIcon from '../pictures/search.jpg';
import arrowIcon from '../pictures/arrow.jpg';
import cartIcon from '../pictures/cart.jpg';
import userIcon from '../icons/usericon.jpg';
import phoneIcon from '../icons/phone-icon.jpg';
import wishlistIcon from '../pictures/wishlist.jpg';
import api from '../Api'; // ✅ Unified API import

const Navbar = () => {
  const [products, setProducts] = useState([]);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchWidth, setSearchWidth] = useState('50%');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 425); 
  const categoryDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  const { isLoggedIn, username } = useUser();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/');
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
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 425);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdownVisible(!categoryDropdownVisible);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategoryDropdownVisible(false);
    setSearchWidth(category === 'All' ? '100%' : '50%');
    scrollToTop();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setFilteredProducts([]);
    navigate(`/search?query=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`);
    scrollToTop();
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

  const handlePhoneClick = () => {
    window.location.href = 'tel:+23434593459'; 
    scrollToTop();
  };

  const handleSuggestionClick = (product) => {
    navigate(`/search?query=${encodeURIComponent(product.name)}&category=${encodeURIComponent(selectedCategory)}`);
    setFilteredProducts([]);
    scrollToTop();
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/account');
    } else {
      navigate('/signin');
    }
    scrollToTop();
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
    scrollToTop();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <a href="/" onClick={scrollToTop}>
            <img src={companyLogo} alt="Company Logo" className="company-logo" />
          </a>
          <div className="company-name">Triple A's Technology</div>
        </div>

        <div className="navbar-right">
          <div className="wishlist-container" onClick={handleWishlistClick}>
            <img src={wishlistIcon} alt="Wishlist" className="wishlist-icon" />
            <span className="wishlist-count">{wishlist.length}</span>
          </div>
          <div onClick={() => { navigate('/cart'); scrollToTop(); }} className="cart-link">
            <img src={cartIcon} alt="Cart" className="cart-icon" />
            <span className="cart-count">{cartCount}</span>
          </div>
          <div className="user-info" onClick={handleAccountClick}>
            <img src={userIcon} alt="User Icon" className="user-icon" />
            <div className="greeting">
              <span className="hello">{isLoggedIn ? 'Hello' : 'Sign In' }</span>
              <span className="username">{isLoggedIn ? username : 'Account'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="search-bar-container">
        <div className="search-with-dropdown" style={{ width: searchWidth }}>
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
                {["All", 'Phones & Tablets', 'Headsets & AirPods', 'Laptops', 'Pouches & Guide', 'Powerbanks', 'Watches', 'Games', 'Accessories'].map((cat) => (
                  <a href="#" key={cat} onClick={() => handleCategoryClick(cat)}>
                    {cat}
                  </a>
                ))}
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

      <div className="phone-icon-container" onClick={handlePhoneClick}>
        <span className="phone-label">Phone</span>
        <img 
          src={phoneIcon} 
          alt="Call Us" 
          className="phone-icon" 
        />
      </div>
    </nav>
  );
};

export default Navbar;
