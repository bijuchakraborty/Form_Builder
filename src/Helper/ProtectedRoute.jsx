import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.form.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;