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
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const navigate = useNavigate();
  const { signIn } = useUser();

  const handlePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/signup/', formData); 
      const data = response.data;

      if (response.status === 201) {
        if (data.access && data.refresh && data.user_id) {
          signIn({
            username: formData.username,
            userId: data.user_id,
            firstName: formData.first_name,
            lastName: formData.last_name,
            email: formData.email,
            token: data.access,
            refresh: data.refresh
          });

          setSuccessMessage('User created successfully!');
          setTimeout(() => navigate('/'), 1500);
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
    } finally {
      setLoading(false);
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
            disabled={loading}
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
              disabled={loading}
            />
            <img
              src={passwordVisible ? closedEyeIcon : eyeIcon}
              alt="Toggle Password Visibility"
              className="eye-icons"
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
            disabled={loading}
          />
        </label>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={loading}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={loading}
          />
        </label>
        <label>
          Address:
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={loading}
          />
        </label>
        <label>
          Phone:
          <PhoneInputComponent
            value={formData.phone}
            onChange={handlePhoneChange}
            disabled={loading}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? <span>Signing up<span className="dots">...</span></span> : 'Sign Up'}
        </button>
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
