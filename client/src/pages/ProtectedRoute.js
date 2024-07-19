import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Function to get the decoded token
const getDecodedToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  return null;
};

const isAuthenticated = (role) => {
  const decodedToken = getDecodedToken();
  return decodedToken && decodedToken.role === role;
};

const ProtectedRoute = ({ role }) => {
  const decodedToken = getDecodedToken();

  if (!decodedToken) {
    return <Navigate to="/" replace />;
  }

  if (role === 'admin' && decodedToken.role !== 'admin') {
    return <Navigate to="/error" replace />;
  }

  if (role === 'superadmin' && decodedToken.role !== 'superadmin') {
    return <Navigate to="/error" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
