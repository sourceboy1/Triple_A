// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import eyeIcon from '../pictures/eye.jpg';
import closedEyeIcon from '../pictures/eye-closed.jpg';
import { useUser } from '../contexts/UserContext';
import api from '../Api';

const Login = () => {
  const [identifier, setIdentifier]         = useState('');
  const [password, setPassword]             = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const navigate                            = useNavigate();
  const { signIn }                          = useUser();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const handleRegisterClick      = () => navigate('/signup');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('login/', { username: identifier, password });
      const data     = response.data;

      if (data.access && data.refresh && data.user) {
        localStorage.setItem('access_token',   data.access);
        localStorage.setItem('refresh_token',  data.refresh);

        const userObj = {
          id: data.user.id, username: data.user.username,
          first_name: data.user.first_name, last_name: data.user.last_name,
          email: data.user.email, is_superuser: !!data.user.is_superuser,
          is_staff: !!data.user.is_staff,
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('loggedIn',       'true');
        localStorage.setItem('username',       data.user.username || '');
        localStorage.setItem('userId',         String(data.user.id));
        localStorage.setItem('firstName',      data.user.first_name || '');
        localStorage.setItem('lastName',       data.user.last_name || '');
        localStorage.setItem('email',          data.user.email || '');

        signIn({
          username: data.user.username, userId: data.user.id,
          firstName: data.user.first_name, lastName: data.user.last_name,
          email: data.user.email, token: data.access, refresh: data.refresh,
          is_superuser: !!data.user.is_superuser,
        });

        navigate('/');
      } else {
        setError('Unexpected response format. Please try again.');
      }
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data.detail || err.response.data.error || 'Invalid credentials.');
      } else {
        setError('Error logging in: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-page">
      <div className="lg-card">

        {/* Left decorative panel */}
        <div className="lg-panel">
          <div className="lg-panel-content">
            <div className="lg-panel-logo">TAT</div>
            <h2 className="lg-panel-title">Welcome back!</h2>
            <p className="lg-panel-sub">Sign in to access your orders, wishlist and account details.</p>
          </div>
          <div className="lg-panel-circles">
            <div className="lg-circle lg-circle--1" />
            <div className="lg-circle lg-circle--2" />
            <div className="lg-circle lg-circle--3" />
          </div>
        </div>

        {/* Right form */}
        <div className="lg-form-col">
          <div className="lg-form-header">
            <h1 className="lg-title">Sign In</h1>
            <p className="lg-subtitle">
              New customer?{' '}
              <button className="lg-switch-btn" onClick={handleRegisterClick}>
                Create an account →
              </button>
            </p>
          </div>

          {error && (
            <div className="lg-error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form className="lg-form" onSubmit={handleSubmit}>
            <div className="lg-field">
              <label htmlFor="identifier">Username or Email</label>
              <input
                id="identifier" type="text"
                value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your username or email"
                required disabled={loading}
              />
            </div>

            <div className="lg-field">
              <label htmlFor="password">Password</label>
              <div className="lg-pw-wrap">
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required disabled={loading}
                />
                <button type="button" className="lg-eye-btn" onClick={togglePasswordVisibility} aria-label="Toggle password">
                  <img src={passwordVisible ? closedEyeIcon : eyeIcon} alt="" />
                </button>
              </div>
            </div>

            <div className="lg-forgot">
              <a href="/request-password-reset">Forgot password?</a>
            </div>

            <button type="submit" className="lg-submit-btn" disabled={loading}>
              {loading ? (
                <><span className="lg-btn-spinner" /> Signing in…</>
              ) : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;