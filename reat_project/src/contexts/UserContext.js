import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null); // Added userId state
  const [fullName, setFullName] = useState(''); // Added fullName state

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    const storedUserId = localStorage.getItem('userId') || null;
    const storedFullName = localStorage.getItem('fullName') || ''; // Get full name from localStorage

    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
    setUserId(storedUserId);
    setFullName(storedFullName); // Set full name in state
  }, []);

  const signIn = ({ username, userId, fullName }) => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId); // Store userId
    localStorage.setItem('fullName', fullName); // Store full name

    setIsLoggedIn(true);
    setUsername(username);
    setUserId(userId); // Set userId in state
    setFullName(fullName); // Set full name in state
  };

  const signOut = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userId'); // Remove userId
    localStorage.removeItem('fullName'); // Remove full name

    setIsLoggedIn(false);
    setUsername('');
    setUserId(null); // Reset userId
    setFullName(''); // Reset full name
  };

  console.log('UserContext value:', { isLoggedIn, username, userId, fullName });

  return (
    <UserContext.Provider value={{ isLoggedIn, username, userId, fullName, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
