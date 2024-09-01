import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    const storedUserId = localStorage.getItem('userId') || null;
    const storedFullName = localStorage.getItem('fullName') || '';

    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
    setUserId(storedUserId);
    setFullName(storedFullName);
  }, []);

  const signIn = ({ username, userId, fullName }) => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId);
    localStorage.setItem('fullName', fullName);

    setIsLoggedIn(true);
    setUsername(username);
    setUserId(userId);
    setFullName(fullName);
  };

  const signOut = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');

    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
    setFullName('');
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, username, userId, fullName, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
