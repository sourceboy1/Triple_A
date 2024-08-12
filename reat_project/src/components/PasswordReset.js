import React, { useState } from 'react';
import './PasswordReset.css'; // Import the CSS file

const PasswordReset = ({ match }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const { uid, token } = match.params;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/reset-password/${uid}/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (response.ok) {
        setMessage('Password has been reset successfully.');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to reset password.');
      }
    } catch (error) {
      setMessage('Error occurred. Please try again.');
    }
  };

  return (
    <div className="password-reset-container">
      <h2>Reset Password</h2>
      <form className="password-reset-form" onSubmit={handleSubmit}>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p className="password-reset-message">{message}</p>}
    </div>
  );
};

export default PasswordReset;


