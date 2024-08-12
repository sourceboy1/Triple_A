import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file
import eyeIcon from '../pictures/eye.jpg'; // Update path as needed
import closedEyeIcon from '../pictures/eye-closed.jpg'; // Update path as needed

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null); // Store user data if needed
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store tokens (for example, in localStorage)
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // Store user data if needed
        setUserData({
          username: data.username,
          email: data.email,
        });

        navigate('/dashboard'); // Redirect to your dashboard or home route
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="password-container">
          <label>Password:</label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <img
            src={passwordVisible ? closedEyeIcon : eyeIcon}
            alt="Toggle Password Visibility"
            className="eye-icon"
            onClick={togglePasswordVisibility}
          />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
        {userData && (
          <div>
            <h3>Welcome, {userData.username}!</h3>
            <p>Email: {userData.email}</p>
          </div>
        )}
        <div className="forgot-password">
          <a href="/request-password-reset">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;




