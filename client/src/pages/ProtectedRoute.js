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

// Function to check if the user is authenticated and has a specific role
const isAuthenticated = (role) => {
  const decodedToken = getDecodedToken();
  return decodedToken && decodedToken.role === role;
};

const ProtectedRoute = ({ role }) => {
  return isAuthenticated(role) ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
