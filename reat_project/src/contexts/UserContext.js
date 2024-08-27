import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null); // Added userId state

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    const storedUserId = localStorage.getItem('userId') || null;

    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
    setUserId(storedUserId);
}, []);

  

const signIn = ({ username, userId }) => {
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('username', username);
  localStorage.setItem('userId', userId); // Store userId

  setIsLoggedIn(true);
  setUsername(username);
  setUserId(userId); // Set userId in state
};

  

  const signOut = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userId'); // Remove userId

    setIsLoggedIn(false);
    setUsername('');
    setUserId(null); // Reset userId
  };

  console.log('UserContext value:', { isLoggedIn, username, userId });

  return (
    <UserContext.Provider value={{ isLoggedIn, username, userId, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
