// src/components/Navbar.jsx
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
  const [searchQuery, setSearchQuery]               = useState('');
  const [suggestions, setSuggestions]               = useState([]);
  const [showSuggestions, setShowSuggestions]       = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen]     = useState(false);

  const searchInputRef    = useRef(null);
  const searchWrapperRef  = useRef(null);
  const debounceTimerRef  = useRef(null);
  const controllerRef     = useRef(null);
  const suppressShowRef   = useRef(false);
  const navigate          = useNavigate();

  const { getCartItemCount } = useCart();
  const cartCount            = getCartItemCount();
  const { isLoggedIn, username } = useUser();
  const { wishlist }         = useWishlist();

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
        image: item.image_url || 'https://via.placeholder.com/72?text=No+Image',
      }));
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.message === 'canceled') return [];
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
      suppressShowRef.current = false;
      return;
    }

    if (suppressShowRef.current) {
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
    setMobileSearchOpen(false);
  };

  // ── KEY CHANGE: clicking a suggestion now searches by that product's name
  // so SearchResults lists all related/matching products — just like Amazon.
  const handleSuggestionPick = (product) => {
    if (!product) return;
    suppressShowRef.current = true;
    setSearchQuery(product.name);
    setShowSuggestions(false);
    searchInputRef.current?.blur();
    // Navigate to search results page with the product name as query
    navigate(`/search?query=${encodeURIComponent(product.name)}`);
    scrollToTop();
    setMobileSearchOpen(false);
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

  const handleWishlistClick = () => { navigate('/wishlist'); scrollToTop(); };
  const handleCartClick     = () => { navigate('/cart');     scrollToTop(); };

  return (
    <nav className="nb-nav" role="navigation" aria-label="Main navigation">
      <div className="nb-inner">

        {/* ── Logo ── */}
        <a href="/" onClick={handleLogoClick} className="nb-logo-link" aria-label="Homepage">
          <img src={companyLogo} alt="Triple A's Technology" className="nb-logo-img" />
          <span className="nb-brand">Triple A's Technology</span>
        </a>

        {/* ── Search bar (desktop) ── */}
        <div className="nb-search-wrap" ref={searchWrapperRef} role="search">
          <div className="nb-search-pill">
            <input
              ref={searchInputRef}
              type="text"
              className="nb-search-input"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => {
                suppressShowRef.current = false;
                if (searchQuery.length > 0 && suggestions.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search products…"
              aria-label="Search products"
              aria-controls="nb-suggestions"
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              role="combobox"
            />
            <button className="nb-search-btn" onClick={(e) => { e.preventDefault(); handleSearch(); }} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <ul className="nb-suggestions" id="nb-suggestions" role="listbox">
              {loadingSuggestions ? (
                <li className="nb-suggestion-item nb-suggestion-item--loading">
                  <span className="nb-loading-dot" /><span className="nb-loading-dot" /><span className="nb-loading-dot" />
                  <span>Searching…</span>
                </li>
              ) : suggestions.length > 0 ? (
                suggestions.map((product, index) => (
                  <li
                    key={product.id}
                    className={`nb-suggestion-item ${index === focusedSuggestionIndex ? 'nb-suggestion-item--focused' : ''}`}
                    onClick={() => handleSuggestionPick(product)}
                    onMouseEnter={() => setFocusedSuggestionIndex(index)}
                    onMouseLeave={() => setFocusedSuggestionIndex(-1)}
                    role="option"
                    aria-selected={index === focusedSuggestionIndex}
                    tabIndex={-1}
                  >
                    <div className="nb-suggestion-img-wrap">
                      <img src={product.image} alt={product.name} className="nb-suggestion-img"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/72?text=No+Image'; }} />
                    </div>
                    <div className="nb-suggestion-text">
                      <span className="nb-suggestion-name">{product.name}</span>
                      <span className="nb-suggestion-cat">{product.category}</span>
                    </div>
                    <svg className="nb-suggestion-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </li>
                ))
              ) : (
                <li className="nb-suggestion-item nb-suggestion-item--empty">
                  <span>No products found for "<strong>{searchQuery}</strong>"</span>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* ── Right icons ── */}
        <div className="nb-actions">

          {/* Mobile search toggle */}
          <button className="nb-icon-btn nb-mobile-search-btn" onClick={() => setMobileSearchOpen(o => !o)} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Account */}
          <button className="nb-icon-btn nb-account-btn" onClick={handleAccountClick} aria-label="Account">
            <img src={userIcon} alt="account" className="nb-icon-img" />
            <div className="nb-greeting">
              <span className="nb-greeting-small">{isLoggedIn ? 'Hello,' : 'Sign in'}</span>
              <span className="nb-greeting-name">{isLoggedIn ? username : 'Account'}</span>
            </div>
          </button>

          {/* Wishlist */}
          <button className="nb-icon-btn nb-wishlist-btn" onClick={handleWishlistClick} aria-label="Wishlist">
            <div className="nb-icon-wrap">
              <img src={wishlistIcon} alt="wishlist" className="nb-icon-img" />
              {Array.isArray(wishlist) && wishlist.length > 0 && (
                <span className="nb-badge">{wishlist.length}</span>
              )}
            </div>
          </button>

          {/* Cart */}
          <button className="nb-icon-btn nb-cart-btn" onClick={handleCartClick} ref={ref} aria-label="Cart">
            <div className="nb-icon-wrap">
              <img src={cartIcon} alt="cart" className="nb-icon-img" />
              {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile search bar (slides down) ── */}
      {mobileSearchOpen && (
        <div className="nb-mobile-search" ref={searchWrapperRef}>
          <div className="nb-search-pill nb-search-pill--mobile">
            <input
              type="text"
              className="nb-search-input"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search products…"
              autoFocus
              aria-label="Search products"
            />
            <button className="nb-search-btn" onClick={(e) => { e.preventDefault(); handleSearch(); }} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {showSuggestions && (
            <ul className="nb-suggestions nb-suggestions--mobile" role="listbox">
              {loadingSuggestions ? (
                <li className="nb-suggestion-item nb-suggestion-item--loading">
                  <span className="nb-loading-dot" /><span className="nb-loading-dot" /><span className="nb-loading-dot" />
                  <span>Searching…</span>
                </li>
              ) : suggestions.length > 0 ? (
                suggestions.map((product, index) => (
                  <li key={product.id}
                    className={`nb-suggestion-item ${index === focusedSuggestionIndex ? 'nb-suggestion-item--focused' : ''}`}
                    onClick={() => handleSuggestionPick(product)}
                    onMouseEnter={() => setFocusedSuggestionIndex(index)}
                    onMouseLeave={() => setFocusedSuggestionIndex(-1)}
                    role="option" tabIndex={-1}>
                    <div className="nb-suggestion-img-wrap">
                      <img src={product.image} alt={product.name} className="nb-suggestion-img"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/72?text=No+Image'; }} />
                    </div>
                    <div className="nb-suggestion-text">
                      <span className="nb-suggestion-name">{product.name}</span>
                      <span className="nb-suggestion-cat">{product.category}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="nb-suggestion-item nb-suggestion-item--empty">No products found.</li>
              )}
            </ul>
          )}
        </div>
      )}
    </nav>
  );
});

export default Navbar;