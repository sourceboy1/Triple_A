import React, { useState } from 'react';
import api from '../Api'; // ✅ Unified API import
import './Password.css'; // Import the CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/request-password-reset/', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response ? err.response.data.error : 'An error occurred');
      setMessage('');
    }
  };

  return (
    <div className="form-container">
      <div className="form-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit">Send Password Reset Link</button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
        <div className="forgot-password">
          <a href="/signin">Back to Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
