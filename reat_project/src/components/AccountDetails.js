import React, { useState, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
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
    
    // Ref to the update message
    const updateMessageRef = useRef(null);

    const handleAccountUpdate = async (event) => {
        event.preventDefault();
    
        if (newPassword && newPassword !== confirmNewPassword) {
            setUpdateMessage('New passwords do not match.');
            return;
        }
    
        try {
            const response = await axios.put('http://localhost:8000/api/update-profile/', {
                first_name: editFirstName,
                last_name: editLastName,
                email: editEmail,
                current_password: currentPassword,
                new_password: newPassword,
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('Response:', response.data); // Log response data
    
            if (response.status === 200) {
                setUpdateMessage('Account details changed successfully.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
    
                const newToken = response.data.token;
                if (newToken) {
                    // Update the context and localStorage with the new token
                    signIn({
                        username: response.data.username,
                        userId: response.data.user_id,
                        firstName: response.data.first_name,
                        lastName: response.data.last_name,
                        email: response.data.email,
                        token: newToken,
                    });
                    console.log('New token:', newToken); // Log new token
                }
    
                // Delay scrolling to ensure updateMessage is rendered
                setTimeout(() => {
                    if (updateMessageRef.current) {
                        updateMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100); // Adjust delay as needed
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message); // Log error
            if (error.response?.status === 401) {
                setUpdateMessage('Session expired. Please log in again.');
            } else {
                setUpdateMessage('Failed to update profile. Please check your current password.');
            }
    
            // Delay scrolling to ensure updateMessage is rendered
            setTimeout(() => {
                if (updateMessageRef.current) {
                    updateMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100); // Adjust delay as needed
        }
    };
    
    

    const togglePasswordVisibility = (setter) => {
        setter((prev) => !prev);
    };

    return (
        <div className="account-details-container">
            <form className="account-details-form" onSubmit={handleAccountUpdate}>
                <h2>Account Details</h2>
                <div ref={updateMessageRef} className="update-message">
                    {updateMessage}
                </div>
                <div>
                    <label htmlFor="firstName">First name *</label>
                    <input
                        id="firstName"
                        type="text"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lastName">Last name *</label>
                    <input
                        id="lastName"
                        type="text"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="displayName">Display name *</label>
                    <input
                        id="displayName"
                        type="text"
                        value={`${editFirstName} ${editLastName}`}
                        readOnly
                    />
                    <small>This will be how your name will be displayed in the account section and in reviews.</small>
                </div>
                <div>
                    <label htmlFor="email">Email address *</label>
                    <input
                        id="email"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="password-container">
                    <label htmlFor="currentPassword">Current password (leave blank to leave unchanged)</label>
                    <div className="password-input-container">
                        <input
                            id="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <img
                            src={showCurrentPassword ? closedEyeIcon : eyeIcon}
                            alt="Toggle visibility"
                            className="eye-icon"
                            onClick={() => togglePasswordVisibility(setShowCurrentPassword)}
                        />
                    </div>
                </div>
                <div className="password-container">
                    <label htmlFor="newPassword">New password (leave blank to leave unchanged)</label>
                    <div className="password-input-container">
                        <input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <img
                            src={showNewPassword ? closedEyeIcon : eyeIcon}
                            alt="Toggle visibility"
                            className="eye-icon"
                            onClick={() => togglePasswordVisibility(setShowNewPassword)}
                        />
                    </div>
                </div>
                <div className="password-container">
                    <label htmlFor="confirmNewPassword">Confirm new password</label>
                    <div className="password-input-container">
                        <input
                            id="confirmNewPassword"
                            type={showConfirmNewPassword ? 'text' : 'password'}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <img
                            src={showConfirmNewPassword ? closedEyeIcon : eyeIcon}
                            alt="Toggle visibility"
                            className="eye-icon"
                            onClick={() => togglePasswordVisibility(setShowConfirmNewPassword)}
                        />
                    </div>
                </div>
                <button type="submit">Save changes</button>
            </form>
        </div>
    );
};

export default AccountDetails;
