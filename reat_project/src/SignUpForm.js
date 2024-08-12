import React, { useState } from 'react';
import axios from 'axios';
import './SignUpForm.css'; // Ensure this file exists for styling
import eyeIcon from './pictures/eye.jpg';
import closedEyeIcon from './pictures/eye-closed.jpg';
import PhoneInputComponent from './PhoneInput';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/signup/', formData);
      if (response.status === 201) {
        setSuccessMessage('User registered successfully!');
        setFormData({
          username: '',
          password: '',
          email: '',
          firstName: '',
          lastName: '',
          address: '',
          phone: '',
        });
        setError('');
      } else {
        setError('Error creating user. Please try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Error creating user. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setSuccessMessage('');
    }
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
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
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
        <a href="/login" className="login-link">Log in here</a>
      </div>
    </div>
  );
};

export default SignUpForm;





