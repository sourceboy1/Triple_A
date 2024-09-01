import React, { useState } from 'react';
import axios from 'axios';
import './Password.css'; // Import the CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Updated URL to include /api/ prefix
      const response = await axios.post('http://localhost:8000/api/request-password-reset/', { email });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
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
