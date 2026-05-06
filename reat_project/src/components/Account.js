// src/components/Account.jsx
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Wishlist from './Wishlist';
import AccountDetails from './AccountDetails';
import UserOrders from './UserOrders';
import './Account.css';

const NAV_ITEMS = [
  { key: 'Dashboard',       label: 'Dashboard',       icon: '🏠' },
  { key: 'Orders',          label: 'My Orders',        icon: '📦' },
  { key: 'Account details', label: 'Account Details',  icon: '👤' },
  { key: 'Wishlist',        label: 'Wishlist',         icon: '❤️' },
];

const Account = () => {
  const { fullName, signOut }                     = useUser();
  const [selectedOption, setSelectedOption]       = useState('Dashboard');
  const [selectedOrderId, setSelectedOrderId]     = useState(null);
  const navigate                                  = useNavigate();

  const handleSignOut = () => { signOut(); navigate('/'); };

  const handleViewOrderDetails = (orderId) => navigate(`/order/${orderId}`);

  if (selectedOption === 'OrderDetails' && selectedOrderId) {
    return <Navigate to={`/order/${selectedOrderId}`} />;
  }

  const renderContent = () => {
    switch (selectedOption) {
      case 'Dashboard':
        return (
          <div className="ac-dashboard">
            <div className="ac-welcome-card">
              <div className="ac-welcome-avatar">
                {fullName ? fullName.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <h2 className="ac-welcome-name">Hello, {fullName} 👋</h2>
                <p className="ac-welcome-sub">
                  Not you?{' '}
                  <a href="/" onClick={(e) => { e.preventDefault(); handleSignOut(); }} className="ac-logout-link">
                    Sign out
                  </a>
                </p>
              </div>
            </div>

            <div className="ac-dashboard-grid">
              {[
                { icon: '📦', label: 'My Orders',       desc: 'View and track your orders',    key: 'Orders' },
                { icon: '👤', label: 'Account Details', desc: 'Update your personal info',      key: 'Account details' },
                { icon: '❤️', label: 'Wishlist',        desc: 'Your saved favourite products',  key: 'Wishlist' },
              ].map(({ icon, label, desc, key }) => (
                <button
                  key={key}
                  className="ac-dashboard-card"
                  onClick={() => setSelectedOption(key)}
                >
                  <span className="ac-dashboard-card-icon">{icon}</span>
                  <div>
                    <h3 className="ac-dashboard-card-title">{label}</h3>
                    <p className="ac-dashboard-card-desc">{desc}</p>
                  </div>
                  <svg className="ac-dashboard-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        );

      case 'Orders':
        return (
          <div className="ac-section">
            <div className="ac-section-header">
              <h2 className="ac-section-title">My Orders</h2>
            </div>
            <UserOrders onViewOrder={handleViewOrderDetails} />
          </div>
        );

      case 'Account details':
        return (
          <div className="ac-section">
            <div className="ac-section-header">
              <h2 className="ac-section-title">Account Details</h2>
              <p className="ac-section-sub">Update your name, email and password</p>
            </div>
            <AccountDetails />
          </div>
        );

      case 'Wishlist':
        return (
          <div className="ac-section">
            <div className="ac-section-header">
              <h2 className="ac-section-title">My Wishlist</h2>
              <p className="ac-section-sub">Products you've saved for later</p>
            </div>
            <Wishlist />
          </div>
        );

      default:
        return <div className="ac-section">Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="ac-page">
      <div className="ac-container">

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className="ac-sidebar">

          {/* User info at top of sidebar */}
          <div className="ac-sidebar-profile">
            <div className="ac-sidebar-avatar">
              {fullName ? fullName.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="ac-sidebar-profile-info">
              <p className="ac-sidebar-name">{fullName || 'My Account'}</p>
              <p className="ac-sidebar-role">Customer</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="ac-sidebar-nav">
            <ul className="ac-nav-list">
              {NAV_ITEMS.map(({ key, label, icon }) => (
                <li key={key}>
                  <button
                    className={`ac-nav-item ${selectedOption === key ? 'ac-nav-item--active' : ''}`}
                    onClick={() => { setSelectedOption(key); setSelectedOrderId(null); }}
                  >
                    <span className="ac-nav-icon">{icon}</span>
                    <span className="ac-nav-label">{label}</span>
                    {selectedOption === key && (
                      <svg className="ac-nav-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sign out */}
          <button className="ac-sidebar-signout" onClick={handleSignOut}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </aside>

        {/* ══════════ CONTENT ══════════ */}
        <main className="ac-content">
          {renderContent()}
        </main>

      </div>
    </div>
  );
};

export default Account;