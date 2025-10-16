import React, { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useWishlist } from '../contexts/WishlistContext';
import './Navbar.css';
import companyLogo from '../pictures/company logo.jpg';
import searchIcon from '../pictures/search12.jpg';
import cartIcon from '../pictures/cart.jpg';
import userIcon from '../icons/usericon.jpg';
import wishlistIcon from '../pictures/wishlisticon17.jpg';
import api from '../Api';

const Navbar = forwardRef((props, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const controllerRef = useRef(null);
  const suppressShowRef = useRef(false); // prevent immediate reopen after pick
  const navigate = useNavigate();

  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  const { isLoggedIn, username } = useUser();
  const { wishlist } = useWishlist();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const fetchSuggestionsFromBackend = useCallback(async (query, signal) => {
    if (!query || !query.trim()) return [];

    try {
      const response = await api.get('products-suggestions/', {
        params: { query: query.trim() },
        signal,
      });

      const data = Array.isArray(response.data) ? response.data : [];
      return data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category_name || 'Others',
        categoryId: item.category_id ?? null,
        image: item.image_url || 'https://via.placeholder.com/72?text=No+Image'
      }));
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.message === 'canceled') return [];
      console.error('Error fetching product suggestions:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimerRef.current);
    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch {}
      controllerRef.current = null;
    }

    if (!searchQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoadingSuggestions(false);
      setFocusedSuggestionIndex(-1);
      // clear suppression when query emptied
      suppressShowRef.current = false;
      return;
    }

    // If we've just selected a suggestion, suppress reopening once
    if (suppressShowRef.current) {
      // don't fetch or show — just clear suppression
      setLoadingSuggestions(false);
      setShowSuggestions(false);
      suppressShowRef.current = false;
      return;
    }

    setLoadingSuggestions(true);
    setShowSuggestions(true);

    debounceTimerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      controllerRef.current = controller;

      const results = await fetchSuggestionsFromBackend(searchQuery, controller.signal);
      setSuggestions(results);
      setLoadingSuggestions(false);
      setFocusedSuggestionIndex(-1);
      controllerRef.current = null;
    }, 300);

    return () => clearTimeout(debounceTimerRef.current);
  }, [searchQuery, fetchSuggestionsFromBackend]);

  // close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event) => {
    const maxIndex = suggestions.length - 1;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedSuggestionIndex(prev => (prev < maxIndex ? prev + 1 : maxIndex));
      setShowSuggestions(true);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (event.key === 'Enter') {
      if (focusedSuggestionIndex > -1 && suggestions[focusedSuggestionIndex]) {
        handleSuggestionPick(suggestions[focusedSuggestionIndex]);
      } else {
        handleSearch();
      }
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedSuggestionIndex(-1);
      searchInputRef.current?.blur();
    }
  };

  const handleSearchInputChange = (e) => {
    // user typed — cancel any suppression so dropdown can re-open normally
    suppressShowRef.current = false;
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    scrollToTop();
    setShowSuggestions(false);
  };

  const handleSuggestionPick = (product) => {
    if (!product) return;
    // prevent the effect from re-opening the dropdown when searchQuery updates
    suppressShowRef.current = true;
    // set the input text to the product name (optional)
    setSearchQuery(product.name);
    // hide immediately and blur input to avoid focus reopening
    setShowSuggestions(false);
    searchInputRef.current?.blur();
    // navigate to product details
    navigate(`/product-details/${product.id}/`);
    scrollToTop();
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    scrollToTop();
    navigate('/');
  };

  const handleAccountClick = () => {
    if (isLoggedIn) navigate('/account');
    else navigate('/signin');
    scrollToTop();
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
    scrollToTop();
  };

  const handleCartClick = () => {
    navigate('/cart');
    scrollToTop();
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <div className="navbar-left">
          {/* Only the logo area is clickable now.
              The company name is plain text (no underline). */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="company-logo-link"
            aria-label="Homepage"
            title="Go to homepage"
          >
            <img src={companyLogo} alt="Triple A's Technology logo" className="company-logo" />
          </a>

          <span className="company-name_name">Triple A's Technology</span>
        </div>

        <div className="navbar-right">
          <button className="icon-btn user-btn" onClick={handleAccountClick}>
            <img src={userIcon} alt="user" className="user-icon" />
            <div className="greeting">
              <span className="greet-small">{isLoggedIn ? 'Hello,' : 'Sign in'}</span>
              <span className="greet-name">{isLoggedIn ? username : 'Account'}</span>
            </div>
          </button>

          <button className="icon-btn wishlist-btn" onClick={handleWishlistClick}>
            <img src={wishlistIcon} alt="wishlist" className="wishlist-icon" />
            {Array.isArray(wishlist) && wishlist.length > 0 && (
              <span className="badge wishlist-badge">{wishlist.length}</span>
            )}
          </button>

          <button className="icon-btn cart-btn" onClick={handleCartClick} ref={ref}>
            <img src={cartIcon} alt="cart" className="cart-icon" />
            {cartCount > 0 && (
              <span className="badge cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="search-row" role="search">
        <div className="search-input-wrapper" ref={searchWrapperRef}>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => {
              // clicking the input clears suppression and opens suggestions if there is text
              suppressShowRef.current = false;
              if (searchQuery.length > 0 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search for products..."
            aria-label="Search products"
            aria-controls="product-suggestions"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            role="combobox"
          />
          <button
            className="search-button"
            onClick={(e) => { e.preventDefault(); handleSearch(); }}
            aria-label="Search"
          >
            <img src={searchIcon} alt="search" />
          </button>

          {showSuggestions && (
            <ul className="suggestions-dropdown" id="product-suggestions" role="listbox">
              {loadingSuggestions ? (
                <li className="suggestion-item loading-item">
                  <span className="loading-spinner" aria-hidden="true"></span>
                  <span>Searching...</span>
                </li>
              ) : suggestions.length > 0 ? (
                suggestions.map((product, index) => (
                  <li
                    key={product.id}
                    className={`suggestion-item ${index === focusedSuggestionIndex ? 'focused' : ''}`}
                    onClick={() => handleSuggestionPick(product)}
                    onMouseEnter={() => setFocusedSuggestionIndex(index)}
                    onMouseLeave={() => setFocusedSuggestionIndex(-1)}
                    role="option"
                    aria-selected={index === focusedSuggestionIndex}
                    tabIndex={-1}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="suggestion-image"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/72?text=No+Image'; }}
                    />
                    <div className="suggestion-text">
                      <span className="suggestion-name">{product.name}</span>
                      <span className="suggestion-category">{product.category}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="suggestion-item no-results">No products found.</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
