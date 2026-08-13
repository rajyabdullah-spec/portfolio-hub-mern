import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on initial reload or application mount
  useEffect(() => {
    let isMounted = true;

    const checkLoggedIn = async () => {
      try {
        const response = await API.get('/auth/me');
        if (isMounted && response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkLoggedIn();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', {
      email,
      password,
    });
    setUser(response.data.data);
    return response.data;
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);