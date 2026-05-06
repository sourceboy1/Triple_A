// src/SignUpForm.jsx
import React, { useState } from 'react';
import api from './Api';
import './SignUpForm.css';
import eyeIcon from './pictures/eye.jpg';
import closedEyeIcon from './pictures/eye-closed.jpg';
import PhoneInputComponent from './PhoneInput';
import { useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '', password: '', email: '',
    first_name: '', last_name: '', address: '', phone: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError]                     = useState('');
  const [successMessage, setSuccessMessage]   = useState('');
  const [loading, setLoading]                 = useState(false);
  const navigate                              = useNavigate();
  const { signIn }                            = useUser();

  const handlePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePhoneChange = (value) => setFormData({ ...formData, phone: value });

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await api.post('/signup/', formData);
      const data     = response.data;

      if (response.status === 201) {
        if (data.access && data.refresh && data.user_id) {
          signIn({
            username: formData.username, userId: data.user_id,
            firstName: formData.first_name, lastName: formData.last_name,
            email: formData.email, token: data.access, refresh: data.refresh,
          });
          setSuccessMessage('Account created successfully! Redirecting…');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setError('Unexpected response format. Please try again.');
        }
      } else {
        setError('Error creating account. Please try again.');
      }
    } catch (error) {
      setError(
        'Error creating account: ' +
        (error.response ? error.response.data.error || JSON.stringify(error.response.data) : error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); handleSignup(); };

  return (
    <div className="su-page">
      <div className="su-card">

        {/* Left panel */}
        <div className="su-panel">
          <div className="su-panel-content">
            <div className="su-panel-logo">TAT</div>
            <h2 className="su-panel-title">Join Triple A's Technology</h2>
            <p className="su-panel-sub">Create your account and start shopping the best tech products in Nigeria.</p>
            <ul className="su-panel-perks">
              <li>✓ Track your orders easily</li>
              <li>✓ Save items to wishlist</li>
              <li>✓ Faster checkout every time</li>
            </ul>
          </div>
          <div className="su-panel-circles">
            <div className="su-circle su-circle--1" />
            <div className="su-circle su-circle--2" />
            <div className="su-circle su-circle--3" />
          </div>
        </div>

        {/* Right form */}
        <div className="su-form-col">
          <div className="su-form-header">
            <h1 className="su-title">Create Account</h1>
            <p className="su-subtitle">
              Already have an account?{' '}
              <a href="/signin" className="su-switch-link">Sign in →</a>
            </p>
          </div>

          {error && (
            <div className="su-error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="su-success-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {successMessage}
            </div>
          )}

          <form className="su-form" onSubmit={handleSubmit}>

            {/* Row: username */}
            <div className="su-field">
              <label htmlFor="username">Username *</label>
              <input id="username" type="text" name="username"
                value={formData.username} onChange={handleChange}
                placeholder="Choose a username" required disabled={loading} />
            </div>

            {/* Row: password */}
            <div className="su-field">
              <label htmlFor="su-password">Password *</label>
              <div className="su-pw-wrap">
                <input id="su-password"
                  type={passwordVisible ? 'text' : 'password'}
                  name="password" value={formData.password} onChange={handleChange}
                  placeholder="Create a strong password" required disabled={loading} />
                <button type="button" className="su-eye-btn" onClick={handlePasswordVisibility} aria-label="Toggle password">
                  <img src={passwordVisible ? closedEyeIcon : eyeIcon} alt="" />
                </button>
              </div>
            </div>

            {/* Row: email */}
            <div className="su-field">
              <label htmlFor="email">Email address *</label>
              <input id="email" type="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com" required disabled={loading} />
            </div>

            {/* Row: first + last name */}
            <div className="su-field-row">
              <div className="su-field">
                <label htmlFor="first_name">First name</label>
                <input id="first_name" type="text" name="first_name"
                  value={formData.first_name} onChange={handleChange}
                  placeholder="John" disabled={loading} />
              </div>
              <div className="su-field">
                <label htmlFor="last_name">Last name</label>
                <input id="last_name" type="text" name="last_name"
                  value={formData.last_name} onChange={handleChange}
                  placeholder="Doe" disabled={loading} />
              </div>
            </div>

            {/* Address */}
            <div className="su-field">
              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" rows={2}
                value={formData.address} onChange={handleChange}
                placeholder="Your delivery address" disabled={loading} />
            </div>

            {/* Phone */}
            <div className="su-field">
              <label>Phone number</label>
              <PhoneInputComponent value={formData.phone} onChange={handlePhoneChange} disabled={loading} />
            </div>

            <button type="submit" className="su-submit-btn" disabled={loading}>
              {loading ? (
                <><span className="su-btn-spinner" /> Creating account…</>
              ) : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;