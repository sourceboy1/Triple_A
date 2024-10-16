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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: identifier, password }),
      });
  
      const data = await response.json();
      console.log('Login response:', data); // Log the response for debugging
  
      if (response.ok) {
        if (data.token && data.user_id) {
          signIn({
            username: data.username,
            userId: data.user_id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            token: data.token,
          });
  
          navigate('/');
        } else {
          setError('Unexpected response format.');
        }
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (error) {
      setError('Error logging in: ' + error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleRegisterClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login 
          <span style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue' }} onClick={handleRegisterClick}>
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
