// TokenContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../Api'; // ✅ Axios instance (with baseURL)
import Loading from './Loading';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Simulate login (use username OR email)
  const login = async (loginInput, password) => {
    try {
      const body = loginInput.includes("@")
        ? { email: loginInput, password }
        : { username: loginInput, password };

      const response = await api.post('token/', body);

      const { access, refresh, user } = response.data;

      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(user);

      // persist in localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid login credentials");
    }
  };

  // 🔹 Auto-refresh token if expired
  const refreshAccessToken = async () => {
    try {
      const response = await api.post('token/refresh/', { refresh: refreshToken });
      const newAccess = response.data.access;
      setAccessToken(newAccess);
      localStorage.setItem("access", newAccess);
      return newAccess;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
    }
  };

  // 🔹 Logout
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    // mark loading false once mounted
    setLoading(false);
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <TokenContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
