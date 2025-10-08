import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom, tokenAtom, isAuthenticatedAtom } from '../../store/atoms';
import { authService } from '../../services/api';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useAtom(userAtom);
  const [token] = useAtom(tokenAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      // If no token or user, not authenticated
      if (!token || !user) {
        setLoading(false);
        setIsValid(false);
        return;
      }

      try {
        // Verify token is still valid by fetching current user
        const response = await authService.getCurrentUser();
        setUser(response.data);
        setIsValid(true);
      } catch (error) {
        console.error('Auth verification failed:', error);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [token, setUser]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isValid || !isAuthenticated) {
    // Redirect to login and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;