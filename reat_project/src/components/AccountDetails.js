import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import './AccountDetails.css';

const AccountDetails = ({ onUpdateMessage }) => {
  const { firstName, lastName, email, token, signIn, lastNameUpdatedAt, lastEmailUpdatedAt } = useUser();
  const [editFirstName, setEditFirstName] = useState(firstName);
  const [editLastName, setEditLastName] = useState(lastName);
  const [editEmail, setEditEmail] = useState(email);
  const [updateMessage, setUpdateMessage] = useState('');
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [canUpdateLastNameField, setCanUpdateLastNameField] = useState(true);
  const [canUpdateEmailField, setCanUpdateEmailField] = useState(true);

  useEffect(() => {
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setEditEmail(email);
    checkCanUpdateLastName();
    checkCanUpdateEmail();
  }, [firstName, lastName, email]);

  const checkCanUpdateLastName = () => {
    if (!lastNameUpdatedAt) {
      setCanUpdateLastNameField(true);
      return;
    }
    const lastUpdateDate = new Date(lastNameUpdatedAt);
    const currentDate = new Date();
    const diffDays = Math.floor((currentDate - lastUpdateDate) / (1000 * 60 * 60 * 24));
    setCanUpdateLastNameField(diffDays >= 30);
  };

  const checkCanUpdateEmail = () => {
    if (!lastEmailUpdatedAt) {
      setCanUpdateEmailField(true);
      return;
    }
    const lastUpdateDate = new Date(lastEmailUpdatedAt);
    const currentDate = new Date();
    const diffDays = Math.floor((currentDate - lastUpdateDate) / (1000 * 60 * 60 * 24));
    setCanUpdateEmailField(diffDays >= 30);
  };

  const handleAccountUpdate = async (event) => {
    event.preventDefault();

    if (!token) {
      setUpdateMessage('No token found. Please log in again.');
      onUpdateMessage('No token found. Please log in again.');
      return;
    }

    if (!canUpdateLastNameField && editLastName !== lastName) {
      setUpdateMessage('You can only update your last name once every 30 days.');
      onUpdateMessage('You can only update your last name once every 30 days.');
      return;
    }

    if (!canUpdateEmailField && editEmail !== email) {
      setUpdateMessage('You can only update your email address once every 30 days.');
      onUpdateMessage('You can only update your email address once every 30 days.');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:8000/api/update-profile/',
        {
          first_name: editFirstName,
          last_name: editLastName,
          email: editEmail,
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setUpdateMessage('Profile updated successfully');
        onUpdateMessage('Profile updated successfully');
        signIn({
          username: response.data.username,
          userId: response.data.user_id,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          email: response.data.email,
          token: response.data.token || token,
          lastNameUpdatedAt: response.data.name_email_updated_at?.last_name || lastNameUpdatedAt,
          lastEmailUpdatedAt: response.data.name_email_updated_at?.email || lastEmailUpdatedAt,
        });
        setFieldsDisabled(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUpdateMessage('Session expired. Please log in again.');
        onUpdateMessage('Session expired. Please log in again.');
      } else {
        console.error('There was an error updating the profile!', error.response?.data || error.message);
        setUpdateMessage('Failed to update profile');
        onUpdateMessage('Failed to update profile');
      }
    }
  };

  return (
    <div>
      <h2>Account Details</h2>
      <form onSubmit={handleAccountUpdate} className="account-details-form">
        <label>
          First name *
          <input
            type="text"
            value={editFirstName}
            onChange={(e) => setEditFirstName(e.target.value)}
            required
            disabled={fieldsDisabled}
          />
        </label>
        <label>
          Last name *
          <input
            type="text"
            value={editLastName}
            onChange={(e) => setEditLastName(e.target.value)}
            required
            disabled={!canUpdateLastNameField || fieldsDisabled}
          />
          {!canUpdateLastNameField && (
            <small style={{ color: 'red' }}>You can only update your last name once every 30 days.</small>
          )}
        </label>
        <label>
          Display name *
          <input
            type="text"
            value={`${editFirstName} ${editLastName}`}
            readOnly
          />
          <small>This will be how your name will be displayed in the account section and in reviews.</small>
        </label>
        <label>
          Email address *
          <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            required
            disabled={!canUpdateEmailField || fieldsDisabled}
          />
          {!canUpdateEmailField && (
            <small style={{ color: 'red' }}>You can only update your email address once every 30 days.</small>
          )}
        </label>
        <button type="submit" className="save-account-details" disabled={fieldsDisabled}>
          Save changes
        </button>
        {updateMessage && <p className="update-message">{updateMessage}</p>}
      </form>
    </div>
  );
};

export default AccountDetails;
