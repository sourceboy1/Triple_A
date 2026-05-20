// src/components/Navbar.jsx

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useCallback,
} from 'react';

import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useWishlist } from '../contexts/WishlistContext';

import './Navbar.css';

import companyLogo from '../pictures/company logo.jpg';
import cartIcon from '../pictures/cart.jpg';
import userIcon from '../icons/usericon.jpg';
import wishlistIcon from '../pictures/wishlisticon17.jpg';

/* ─────────────────────────────────────────────
   API BASE — e.g. http://localhost:8000
   We build it from REACT_APP_API_URL by
   stripping the trailing /api/ part.
───────────────────────────────────────────── */
const API_BASE = (
  process.env.REACT_APP_API_URL || 'http://localhost:8000/api/'
).replace(/\/api\/?$/, '');

/* ─────────────────────────────────────────────
   EXTRACT IMAGE
   Backend returns image_urls.large as an
   absolute URL — e.g. http://localhost:8000/media/products/xxx.jpg
   Use it directly, no modification needed.
───────────────────────────────────────────── */
const extractImage = (item) => {
  if (item?.image_urls?.large)  return item.image_urls.large;
  if (item?.image_urls?.medium) return item.image_urls.medium;
  if (item?.image_urls?.small)  return item.image_urls.small;
  if (item?.image_url)          return item.image_url;
  if (item?.image)              return item.image;
  return '';
};

/* ─────────────────────────────────────────────
   SUGGESTION IMAGE with fallback placeholder
───────────────────────────────────────────── */
const SuggestionImage = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className="nb-suggestion-placeholder">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="m21 15-5-5L5 21"/>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="nb-suggestion-img"
      loading="lazy"
      draggable="false"
      onError={() => setFailed(true)}
    />
  );
};

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const Navbar = forwardRef((props, ref) => {
  const [searchQuery, setSearchQuery]                       = useState('');
  const [suggestions, setSuggestions]                       = useState([]);
  const [showSuggestions, setShowSuggestions]               = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions]         = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen]             = useState(false);

  const searchInputRef   = useRef(null);
  const searchWrapperRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const controllerRef    = useRef(null);
  const suppressShowRef  = useRef(false);

  const navigate = useNavigate();

  const { getCartItemCount }     = useCart();
  const cartCount                = getCartItemCount();
  const { isLoggedIn, username } = useUser();
  const { wishlist }             = useWishlist();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* ─────────────────────────────────────────────
     FETCH SUGGESTIONS
     Uses plain fetch() — NOT the axios api
     instance — so no Authorization header is
     sent. This matches the AllowAny permission
     on your backend and avoids the 401.
  ───────────────────────────────────────────── */
  const fetchSuggestionsFromBackend = useCallback(async (query, signal) => {
    if (!query || !query.trim()) return [];

    try {
      const url = `${API_BASE}/api/products-suggestions/?query=${encodeURIComponent(query.trim())}`;

      const response = await fetch(url, { signal });

      if (!response.ok) {
        console.error('[Navbar] suggestions fetch failed:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();

      if (!Array.isArray(data)) return [];

      return data.map((item) => ({
        id:         item.id           ?? item.product_id,
        name:       item.name         ?? item.product_name ?? '',
        category:   item.category_name ?? item.category   ?? 'Others',
        categoryId: item.category_id  ?? null,
        // image_urls.large is already a full absolute URL from request.build_absolute_uri()
        image:      extractImage(item),
      }));

    } catch (err) {
      if (err?.name === 'AbortError') return [];
      console.error('[Navbar] suggestion fetch error:', err);
      return [];
    }
  }, []);

  /* ── Debounced search effect ── */
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

  /* ── Click outside ── */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Keyboard navigation ── */
  const handleKeyDown = (event) => {
    const maxIndex = suggestions.length - 1;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedSuggestionIndex(prev => prev < maxIndex ? prev + 1 : maxIndex);
      setShowSuggestions(true);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
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

  const handleSuggestionPick = (product) => {
    if (!product) return;
    suppressShowRef.current = true;
    setSearchQuery(product.name);
    setShowSuggestions(false);
    searchInputRef.current?.blur();
    navigate(`/search?query=${encodeURIComponent(product.name)}`);
    scrollToTop();
    setMobileSearchOpen(false);
  };

  const handleLogoClick    = (e) => { e.preventDefault(); scrollToTop(); navigate('/'); };
  const handleAccountClick = () => { if (isLoggedIn) navigate('/account'); else navigate('/signin'); scrollToTop(); };
  const handleWishlistClick = () => { navigate('/wishlist'); scrollToTop(); };
  const handleCartClick     = () => { navigate('/cart');     scrollToTop(); };

  /* ── Shared suggestions list renderer ── */
  const renderSuggestions = (mobileClass = '') => (
    <ul className={`nb-suggestions ${mobileClass}`} id="nb-suggestions" role="listbox">
      {loadingSuggestions ? (
        <li className="nb-suggestion-item nb-suggestion-item--loading">
          <span className="nb-loading-dot" />
          <span className="nb-loading-dot" />
          <span className="nb-loading-dot" />
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
              <SuggestionImage src={product.image} alt={product.name} />
            </div>
            <div className="nb-suggestion-text">
              <span className="nb-suggestion-name">{product.name}</span>
              <span className="nb-suggestion-cat">{product.category}</span>
            </div>
            {!mobileClass && (
              <svg className="nb-suggestion-arrow" width="14" height="14"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </li>
        ))
      ) : (
        <li className="nb-suggestion-item nb-suggestion-item--empty">
          No products found.
        </li>
      )}
    </ul>
  );

  return (
    <nav className="nb-nav" role="navigation" aria-label="Main navigation">
      <div className="nb-inner">

        {/* ── Logo ── */}
        <a href="/" onClick={handleLogoClick} className="nb-logo-link" aria-label="Homepage">
          <img src={companyLogo} alt="Triple A's Technology" className="nb-logo-img" />
          <span className="nb-brand">Triple A's Technology</span>
        </a>

        {/* ── Search (desktop) ── */}
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
            <button className="nb-search-btn"
              onClick={(e) => { e.preventDefault(); handleSearch(); }}
              aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
          {showSuggestions && renderSuggestions()}
        </div>

        {/* ── Right actions ── */}
        <div className="nb-actions">

          <button className="nb-icon-btn nb-mobile-search-btn"
            onClick={() => setMobileSearchOpen(o => !o)} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <button className="nb-icon-btn nb-account-btn" onClick={handleAccountClick} aria-label="Account">
            <img src={userIcon} alt="account" className="nb-icon-img" />
            <div className="nb-greeting">
              <span className="nb-greeting-small">{isLoggedIn ? 'Hello,' : 'Sign in'}</span>
              <span className="nb-greeting-name">{isLoggedIn ? username : 'Account'}</span>
            </div>
          </button>

          <button className="nb-icon-btn nb-wishlist-btn" onClick={handleWishlistClick} aria-label="Wishlist">
            <div className="nb-icon-wrap">
              <img src={wishlistIcon} alt="wishlist" className="nb-icon-img" />
              {Array.isArray(wishlist) && wishlist.length > 0 && (
                <span className="nb-badge">{wishlist.length}</span>
              )}
            </div>
          </button>

          <button className="nb-icon-btn nb-cart-btn" onClick={handleCartClick} ref={ref} aria-label="Cart">
            <div className="nb-icon-wrap">
              <img src={cartIcon} alt="cart" className="nb-icon-img" />
              {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile search ── */}
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
            <button className="nb-search-btn"
              onClick={(e) => { e.preventDefault(); handleSearch(); }} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
          {showSuggestions && renderSuggestions('nb-suggestions--mobile')}
        </div>
      )}
    </nav>
  );
});

export default Navbar;