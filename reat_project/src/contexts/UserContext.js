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
  const [refreshToken, setRefreshToken] = useState('');
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    const storedUserId = localStorage.getItem('userId');
    const storedFirstName = localStorage.getItem('firstName') || '';
    const storedLastName = localStorage.getItem('lastName') || '';
    const storedEmail = localStorage.getItem('email') || '';
    const storedToken = localStorage.getItem('access_token') || '';
    const storedRefresh = localStorage.getItem('refresh_token') || '';

    // read user object if available
    let storedUserIsSuper = false;
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (storedUser && typeof storedUser.is_superuser !== 'undefined') {
        storedUserIsSuper = !!storedUser.is_superuser;
      }
    } catch (e) {
      storedUserIsSuper = false;
    }

    const parsedUserId = storedUserId && storedUserId !== 'null' ? Number(storedUserId) : null;

    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
    setUserId(parsedUserId);
    setFirstName(storedFirstName);
    setLastName(storedLastName);
    setEmail(storedEmail);
    setToken(storedToken);
    setRefreshToken(storedRefresh);
    setIsSuperuser(storedUserIsSuper);
  }, []);

  // signIn now accepts is_superuser (boolean) and stores user object too
  const signIn = ({ username, userId, firstName, lastName, email, token, refresh, is_superuser = false }) => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username || '');
    localStorage.setItem('userId', userId !== null ? String(userId) : 'null');
    localStorage.setItem('firstName', firstName || '');
    localStorage.setItem('lastName', lastName || '');
    localStorage.setItem('email', email || '');
    localStorage.setItem('access_token', token || '');
    localStorage.setItem('refresh_token', refresh || '');

    // Save consolidated user object (used by RequireSuperuser)
    const userObj = {
      id: userId,
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      is_superuser: !!is_superuser
    };
    localStorage.setItem('user', JSON.stringify(userObj));

    setIsLoggedIn(true);
    setUsername(username || '');
    setUserId(userId);
    setFirstName(firstName || '');
    setLastName(lastName || '');
    setEmail(email || '');
    setToken(token || '');
    setRefreshToken(refresh || '');
    setIsSuperuser(!!is_superuser);
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
    setRefreshToken('');
    setIsSuperuser(false);
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        username,
        userId,
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        token,
        refreshToken,
        isSuperuser,
        signIn,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
