import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Api';
import './Password.css';
import eyeIcon from '../pictures/eye.jpg';
import closedEyeIcon from '../pictures/eye-closed.jpg';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  const handlePasswordToggle = () => setShowPassword(!showPassword);
  const handleConfirmPasswordToggle = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setMessage('');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/reset-password/', { uid, token, password });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/signin'), 1500); // slight delay before redirect
    } catch (err) {
      setError(err.response ? err.response.data.error : 'An error occurred');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-form">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label>New Password:
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <img
                src={showPassword ? eyeIcon : closedEyeIcon}
                alt="Toggle Visibility"
                onClick={handlePasswordToggle}
                className="password-eye-icon"
              />
            </div>
          </label>
          <label>Confirm Password:
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <img
                src={showConfirmPassword ? eyeIcon : closedEyeIcon}
                alt="Toggle Visibility"
                onClick={handleConfirmPasswordToggle}
                className="password-eye-icon"
              />
            </div>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? <span>Resetting password<span className="dots">...</span></span> : 'Reset Password'}
          </button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
