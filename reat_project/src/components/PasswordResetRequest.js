import React, { useState } from 'react';
import './PasswordResetRequest.css'; // Import the CSS file

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/request-password-reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Password reset link sent to your email.');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to send reset link.');
      }
    } catch (error) {
      setMessage('Error occurred. Please try again.');
    }
  };

  return (
    <div className="password-reset-container">
      <h2>Forgot Password</h2>
      <form className="password-reset-form" onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p className="password-reset-message">{message}</p>}
    </div>
  );
};

export default PasswordResetRequest;
