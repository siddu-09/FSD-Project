import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_AUTH_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API_URL}/me`)
        .then(res => {
          setUser(res.data.data.user);
        })
        .catch(() => {
          logout(); // Invalid token
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    const jwt = res.data.token;
    setToken(jwt);
    setUser(res.data.data.user);
    localStorage.setItem('token', jwt);
  };

  const register = async (email, password) => {
    const res = await axios.post(`${API_URL}/register`, { email, password });
    const jwt = res.data.token;
    setToken(jwt);
    setUser(res.data.data.user);
    localStorage.setItem('token', jwt);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
