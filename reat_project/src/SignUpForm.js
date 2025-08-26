import React, { useState } from 'react';
import axios from 'axios';
import './SignUpForm.css';
import eyeIcon from './pictures/eye.jpg';
import closedEyeIcon from './pictures/eye-closed.jpg';
import PhoneInputComponent from './PhoneInput';
import { useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    address: '',
    phone: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { signIn } = useUser();

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/signup/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (response.status === 201) {
        // JWT token from signup response
        if (data.access && data.user_id) {
          signIn({
            username: formData.username,
            userId: data.user_id,
            firstName: formData.first_name,
            lastName: formData.last_name,
            email: formData.email,
            token: data.access,      // access token for auth
            refreshToken: data.refresh // optional, store refresh token if needed
          });

          setSuccessMessage('User created successfully!');
          setTimeout(() => navigate('/'), 2000);
        } else {
          setError('Unexpected response format. Please try again.');
        }
      } else {
        setError('Error creating user. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      setError(
        'Error creating user: ' + (error.response ? error.response.data.error || JSON.stringify(error.response.data) : error.message)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignup();
  };

  return (
    <div className="signup-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <div className="password-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <img
              src={passwordVisible ? closedEyeIcon : eyeIcon}
              alt="Toggle Password Visibility"
              className="eye-icon"
              onClick={handlePasswordVisibility}
            />
          </div>
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Address:
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone:
          <PhoneInputComponent
            value={formData.phone}
            onChange={handlePhoneChange}
          />
        </label>
        <button type="submit">Sign Up</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
      <div className="login-prompt">
        <span>Already have an account?</span>
        <a href="/signin" className="login-link">Log in here</a>
      </div>
    </div>
  );
};

export default SignUpForm;
