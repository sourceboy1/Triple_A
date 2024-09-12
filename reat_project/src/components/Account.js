import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Wishlist from './Wishlist';
import AccountDetails from './AccountDetails';
import UserOrders from './UserOrders';
import './Account.css';

const Account = () => {
  const { fullName, signOut } = useUser();
  const [selectedOption, setSelectedOption] = useState('Dashboard');
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  

  const renderContent = () => {
    switch (selectedOption) {
      case 'Dashboard':
        return (
          <div>
            <h2 className='dashboard'>
              Hello {fullName} <span className="not-you">(not {fullName}? <a href="/" onClick={handleSignOut} className="logout-link">Log out</a>)</span>
            </h2>
            <p>
              From your account dashboard you can view your{' '}
              <a href="#">recent orders</a>,<br />
              manage your{' '}
              <a href="#">shipping and billing addresses</a>, and{' '}
              <a href="#">edit your password and account details</a>.
            </p>
          </div>
        );
      case 'Orders':
        return <UserOrders />; // Render UserOrders component here
      case 'Addresses':
        return <div>Manage your Addresses here.</div>;
      case 'Payment methods':
        return <div>Manage your Payment Methods.</div>;
      case 'Account details':
        return <AccountDetails />;
      case 'Wishlist':
        return <Wishlist />;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };
  

  return (
    <div className="account-container">
      <div className="sidebar">
        <ul className="account-options">
          {['Dashboard', 'Orders', 'Addresses', 'Payment methods', 'Account details', 'Wishlist'].map((option) => (
            <li
              key={option}
              className={`option-item ${selectedOption === option ? 'active' : ''}`}
              onClick={() => {
                if (option === 'Log out') {
                  handleSignOut();
                } else {
                  setSelectedOption(option);
                }
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
      <div className="content-section">
        {renderContent()}
      </div>
    </div>
  );
};

export default Account;
