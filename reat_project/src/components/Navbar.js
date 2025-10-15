import React, { useState, useRef, forwardRef } from 'react';
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

const Navbar = forwardRef((props, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  const { isLoggedIn, username } = useUser();
  const { wishlist } = useWishlist();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    scrollToTop();
  };

  const handleSearchInputChange = (event) => setSearchQuery(event.target.value);

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
          <a href="/" onClick={(e) => { e.preventDefault(); scrollToTop(); navigate('/'); }} className="company-logo-link" aria-label="Homepage">
            <img src={companyLogo} alt="Triple A's Technology logo" className="company-logo" />
            <a className="company-name">Triple A's Technology</a>
          </a>
        </div>

        <div className="navbar-right">
          <button
            className="icon-btn user-btn"
            onClick={handleAccountClick}
            aria-label={isLoggedIn ? `Open account for ${username}` : 'Sign in'}
            title={isLoggedIn ? `Hello, ${username}` : 'Sign in'}
          >
            <img src={userIcon} alt="" className="user-icon" />
            <div className="greeting">
              <span className="greet-small">{isLoggedIn ? 'Hello,' : 'Sign in'}</span>
              <span className="greet-name">{isLoggedIn ? username : 'Account'}</span>
            </div>
          </button>

          <button
            className="icon-btn wishlist-btn"
            onClick={handleWishlistClick}
            aria-label="Open wishlist"
            title="Wishlist"
          >
            <img src={wishlistIcon} alt="" className="wishlist-icon" />
            {Array.isArray(wishlist) && wishlist.length > 0 && (
              <span className="badge wishlist-badge" aria-hidden="true">{wishlist.length}</span>
            )}
          </button>

          <button
            className="icon-btn cart-btn"
            onClick={handleCartClick}
            aria-label="Open cart"
            title="Cart"
            ref={ref}
          >
            <img src={cartIcon} alt="" className="cart-icon" />
            {cartCount > 0 && (
              <span className="badge cart-badge" aria-hidden="true">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="search-row" role="search">
        <div className="search-input-wrapper">
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            placeholder="Search for products..."
            aria-label="Search products"
          />
          <button className="search-button" onClick={handleSearch} aria-label="Search">
            <img src={searchIcon} alt="" />
          </button>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
