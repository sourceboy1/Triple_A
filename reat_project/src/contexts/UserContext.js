import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    const storedUserId = localStorage.getItem('userId');
    const storedFirstName = localStorage.getItem('firstName') || '';
    const storedLastName = localStorage.getItem('lastName') || '';
    const storedEmail = localStorage.getItem('email') || '';
    const storedToken = localStorage.getItem('token') || '';

    const userId = storedUserId && storedUserId !== 'null' ? Number(storedUserId) : null;

    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
    setUserId(userId);
    setFirstName(storedFirstName);
    setLastName(storedLastName);
    setEmail(storedEmail);
    setToken(storedToken);
}, []);


const signIn = ({ username, userId, firstName, lastName, email, token }) => {
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('username', username);
  localStorage.setItem('userId', userId !== null ? String(userId) : 'null');
  localStorage.setItem('firstName', firstName);
  localStorage.setItem('lastName', lastName);
  localStorage.setItem('email', email);
  localStorage.setItem('token', token);

  setIsLoggedIn(true);
  setUsername(username);
  setUserId(userId);
  setFirstName(firstName);
  setLastName(lastName);
  setEmail(email);
  setToken(token);
};





  const signOut = () => {
    localStorage.clear();

    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setToken('');
  };

  return (
    <UserContext.Provider value={{ 
      isLoggedIn, 
      username, 
      userId, 
      fullName: `${firstName} ${lastName}`, 
      firstName, 
      lastName, 
      email, 
      token, 
      signIn, 
      signOut 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
