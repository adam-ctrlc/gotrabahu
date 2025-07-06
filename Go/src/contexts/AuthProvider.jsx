import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const location = useLocation();
  const pathname = location.pathname;
  const [token, setToken] = useState(sessionStorage.getItem('access_token'));

  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/landing',
  ];

  useEffect(() => {
    const storedToken = sessionStorage.getItem('access_token');
    if (storedToken !== token) {
      setToken(storedToken);
    }
  }, [location.pathname]);

  function isUserAuthenticated() {
    if (!token && !publicRoutes.includes(pathname)) {
      window.location.href = publicRoutes[0];
    } else if (token && publicRoutes.includes(pathname)) {
      window.location.href = '/dashboard';
    }
  }

  useEffect(() => {
    isUserAuthenticated();
  }, [pathname, token]);

  return (
    <>
      <AuthContext.Provider
        value={{ token, isUserAuthenticated, isAuthenticated: !!token }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
