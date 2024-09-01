import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { useUser } from '../contexts/UserContext'; // Import useUser from your UserContext
import './Account.css';

const Account = () => {
  const { fullName = 'Guest', signOut } = useUser(); // Provide default value for fullName
  const [selectedOption, setSelectedOption] = useState('Dashboard');
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle sign out
  const handleSignOut = () => {
    signOut(); // Use signOut from context
    navigate('/'); // Redirect to homepage or login page
  };

  // Render different components based on the selected option
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
              <a href="#">
                recent orders
              </a>
              ,<br/> manage your{' '}
              <a href="#">
                shipping and billing addresses
              </a>
              , and{' '}
              <a href="#">
                edit your password and account details
              </a>
              .
            </p>
          </div>
        );
      case 'Orders':
        return <div>Here are your Orders.</div>;
      case 'Addresses':
        return <div>Manage your Addresses here.</div>;
      case 'Payment methods':
        return <div>Manage your Payment Methods.</div>;
      case 'Account details':
        return <div>View and update your Account Details.</div>;
      case 'Communication':
        return <div>Manage your Communication Preferences.</div>;
      case 'Wishlist':
        return <div>View your Wishlist.</div>;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="account-container">
      <div className="sidebar">
        <ul className="account-options">
          {[
            'Dashboard',
            'Orders',
            'Addresses',
            'Payment methods',
            'Account details',
            'Communication',
            'Wishlist',
          ].map((option) => (
            <li
              key={option}
              className={`option-item ${selectedOption === option ? 'active' : ''}`}
              onClick={() => {
                if (option === 'Log out') {
                  handleSignOut(); // Call handleSignOut when Log out is clicked
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
      <div className="content-section">{renderContent()}</div>
    </div>
  );
};

export default Account;
