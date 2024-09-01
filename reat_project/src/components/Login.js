import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import eyeIcon from '../pictures/eye.jpg';
import closedEyeIcon from '../pictures/eye-closed.jpg';
import { useUser } from '../contexts/UserContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: identifier, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.token && data.user_id && data.username) {
          const fullName = data.fullName || ''; // Get full name from response

          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.user_id);
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('username', data.username);
          localStorage.setItem('fullName', fullName); // Store full name

          signIn({
            username: data.username,
            userId: data.user_id,
            fullName: fullName, // Pass full name
          });

          navigate('/');
        } else {
          setError('Unexpected response format. Please try again.');
        }
      } else {
        setError(data.error || 'Username, email, or password incorrect');
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
          <label htmlFor="identifier">Username or Email:</label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            aria-label="Username or Email"
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
            aria-label="Password"
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
        <div className="forgot-password">
          <a href="/request-password-reset">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
