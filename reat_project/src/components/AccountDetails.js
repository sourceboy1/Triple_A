import React, { useState, useRef, useEffect } from 'react';  
import { useUser } from '../contexts/UserContext';
import api from '../Api.js'; // <- central api.js
import eyeIcon from '../pictures/eye.jpg';
import closedEyeIcon from '../pictures/eye-closed.jpg';
import './AccountDetails.css';

const AccountDetails = () => {
  const { firstName, lastName, email, token, userId, signIn } = useUser();

  const [editFirstName, setEditFirstName] = useState(firstName);
  const [editLastName, setEditLastName] = useState(lastName);
  const [editEmail, setEditEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateMessageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const togglePasswordVisibility = (setter) => setter(prev => !prev);

  const handleAccountUpdate = async (event) => {
    event.preventDefault();

    if (newPassword && newPassword !== confirmNewPassword) {
      setUpdateMessage('New passwords do not match.');
      return;
    }

    setIsLoading(true);

    const payload = {
      first_name: editFirstName,
      last_name: editLastName,
      email: editEmail,
      current_password: currentPassword, // ✅ always required
      new_password: newPassword || null, // ✅ optional
    };

    try {
      const response = await api.put(
        'update-profile/',
        payload,
        {
          headers: { Authorization: `Token ${token}` }
        }
      );

      if (response.status === 200) {
        setUpdateMessage('Account details changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        const newTokens = response.data.tokens;
        signIn({
          username: response.data.username,
          userId: response.data.user_id,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          email: response.data.email,
          token: newTokens ? newTokens.access : token,
          refreshToken: newTokens ? newTokens.refresh : null,
        });

        setTimeout(() => {
          updateMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUpdateMessage('Session expired. Please log in again.');
      } else {
        setUpdateMessage(error.response?.data?.detail || 'Failed to update profile. Please check your current password.');
      }
      setTimeout(() => {
        updateMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-details-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <form className="account-details-form" onSubmit={handleAccountUpdate}>
        <h2>Account Details</h2>
        {updateMessage && ( // Only render if there's a message
          <div ref={updateMessageRef} className={`update-message ${updateMessage.includes('successfully') ? 'success' : 'error'}`}>
            {updateMessage}
          </div>
        )}

        <div className="form-group"> {/* Added form-group for better spacing */}
          <label htmlFor="firstName">First name *</label>
          <input
            id="firstName"
            type="text"
            value={editFirstName}
            onChange={(e) => setEditFirstName(e.target.value)}
            required
          />
        </div>

        <div className="form-group"> {/* Added form-group */}
          <label htmlFor="lastName">Last name *</label>
          <input
            id="lastName"
            type="text"
            value={editLastName}
            onChange={(e) => setEditLastName(e.target.value)}
            required
          />
        </div>

        <div className="form-group"> {/* Added form-group */}
          <label htmlFor="displayName">Display name *</label>
          <input
            id="displayName"
            type="text"
            value={`${editFirstName} ${editLastName}`}
            readOnly
            className="read-only" 
          />
          <small>This will be how your name will be displayed in the account section and in reviews.</small>
        </div>

        <div className="form-group"> {/* Added form-group */}
          <label htmlFor="email">Email address *</label>
          <input
            id="email"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            required
          />
        </div>

        {/* Current Password - always required */}
        <div className="form-group password-group"> {/* Added form-group and password-group */}
          <label htmlFor="currentPassword">Current password *</label>
          <div className="password-input-container">
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <img
              src={showCurrentPassword ? closedEyeIcon : eyeIcon}
              alt="Toggle visibility"
              className="eye-icon"
              onClick={() => togglePasswordVisibility(setShowCurrentPassword)}
            />
          </div>
        </div>

        {/* Note for password change */}
        <div className="password-note info-box"> {/* Added info-box for styling */}
          <small>
            If you want to change your password, fill in the fields below.  
            Otherwise, leave them blank and your password will remain the same.
          </small>
        </div>

        {/* Optional password change */}
        {[
          { label: 'New password (optional)', value: newPassword, setter: setNewPassword, show: showNewPassword, toggle: setShowNewPassword, id: 'newPassword' },
          { label: 'Confirm new password', value: confirmNewPassword, setter: setConfirmNewPassword, show: showConfirmNewPassword, toggle: setShowConfirmNewPassword, id: 'confirmNewPassword' }
        ].map(field => (
          <div className="form-group password-group" key={field.id}> {/* Added form-group and password-group */}
            <label htmlFor={field.id}>{field.label}</label>
            <div className="password-input-container">
              <input
                id={field.id}
                type={field.show ? 'text' : 'password'}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
              />
              <img
                src={field.show ? closedEyeIcon : eyeIcon}
                alt="Toggle visibility"
                className="eye-icon"
                onClick={() => togglePasswordVisibility(field.toggle)}
              />
            </div>
          </div>
        ))}

        <button type="submit" disabled={isLoading}>Save changes</button> {/* Disabled button when loading */}
      </form>
    </div>
  );
};

export default AccountDetails;