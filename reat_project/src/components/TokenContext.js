import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Loading from './Loading';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/token/', {
          username: 'admin',
          password: 'oluwaseun123'
        });
        setAccessToken(response.data.access);
      } catch (err) {
        console.error('Error fetching token:', err);
        setError('Failed to fetch token');
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <TokenContext.Provider value={accessToken}>
      {children}
    </TokenContext.Provider>
  );
};

