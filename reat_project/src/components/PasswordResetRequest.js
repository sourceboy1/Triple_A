import React, { useState } from 'react';
import api from '../Api';
import './PasswordResetLink.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/request-password-reset/', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'An error occurred');
    } finally {
      setLoading(false);
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
              disabled={loading} // ✅ disable input while sending
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? <span>Sending link<span className="dots">...</span></span> : 'Send Password Reset Link'}
          </button>
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
