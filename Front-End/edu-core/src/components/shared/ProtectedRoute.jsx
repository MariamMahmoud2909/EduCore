import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isAuthenticatedAtom } from '../../store/atoms';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;