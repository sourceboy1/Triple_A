import React, { createContext, useState, useEffect } from 'react';
import api from '../Api'; // ✅ Centralized API config
import Loading from './Loading';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await api.post('/token/', {
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

  if (loading) return <Loading />; // ✅ Show loading until token is fetched
  if (error) return <div>Error: {error}</div>;

  return (
    <TokenContext.Provider value={accessToken}>
      {children}
    </TokenContext.Provider>
  );
};
