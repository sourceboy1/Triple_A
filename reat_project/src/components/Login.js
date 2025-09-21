import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './Login.css';
import eyeIcon from '../pictures/eye.jpg';
import closedEyeIcon from '../pictures/eye-closed.jpg';
import { useUser } from '../contexts/UserContext';
import api from '../Api'; // <- centralized api import

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useUser();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleRegisterClick = () => {
    navigate('/signup'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use api.post instead of fetch
      const response = await api.post('login/', {
        username: identifier,
        password
      });

      const data = response.data;

      if (data.access && data.refresh && data.user) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        signIn({
          username: data.user.username,
          userId: data.user.id,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          email: data.user.email,
          token: data.access,
          refresh: data.refresh,
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
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>
          Login 
          <span 
            style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue' }}
            onClick={handleRegisterClick}
          >
            Register
          </span>
        </h2>

        <div>
          <label htmlFor="identifier">Username or Email:</label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="password-container">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <img
            src={passwordVisible ? closedEyeIcon : eyeIcon}
            alt="Toggle Password Visibility"
            className="eye-icona"
            onClick={togglePasswordVisibility}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <span>Logging in<span className="dots">...</span></span> : 'Login'}
        </button>

        {error && <p className="error-message">{error}</p>}

        <div className="forgot-password">
          <a href="/request-password-reset">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
