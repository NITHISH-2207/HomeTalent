import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService.js';
import api from '../services/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeMode, setActiveMode] = useState(localStorage.getItem('activeMode') || 'customer');
  const [loading, setLoading] = useState(true);

  // Initialize and check current token on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          setToken(storedToken);
          // Fetch latest user details from backend /me
          const userData = await authService.getCurrentUser();
          setUser(userData);
          
          // Ensure hasProviderProfile is synced (Removed redirect logic to allow unconditional entry)
        } catch (error) {
          console.error('Failed to authenticate stored token:', error);
          // Token expired or invalid
          logoutUser();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Complete login with selected mode (sets localStorage and context state)
  const completeLogin = (userData, userToken, selectedMode) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('activeMode', selectedMode);
    
    setToken(userToken);
    setActiveMode(selectedMode);
    setUser(userData);
  };

  // Perform mode switching without logging out
  const switchMode = (mode) => {
    localStorage.setItem('activeMode', mode);
    setActiveMode(mode);
    return true;
  };

  const switchToProvider = (navigate) => {
    localStorage.setItem('activeMode', 'provider');
    setActiveMode('provider');
    if (navigate) navigate('/provider/dashboard');
  };

  const switchToCustomer = (navigate) => {
    localStorage.setItem('activeMode', 'customer');
    setActiveMode('customer');
    if (navigate) navigate('/');
  };

  // Refetches user details from backend (useful after creating ProviderProfile)
  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error refreshing user details:', error);
    }
  };

  // Logout clears credentials and redirects
  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('activeMode');
    setToken(null);
    setUser(null);
    setActiveMode('customer');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeMode,
        loading,
        completeLogin,
        switchMode,
        switchToProvider,
        switchToCustomer,
        logoutUser,
        refreshUser,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
