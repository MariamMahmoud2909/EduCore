import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isAdminAtom } from '../../store/atoms';

const AdminRoute = ({ children }) => {
  const [isAdmin] = useAtom(isAdminAtom);
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute;