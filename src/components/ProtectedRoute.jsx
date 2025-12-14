import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/roleFilter';

/**
 * ProtectedRoute component to restrict access based on user role
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles that can access this route
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = getUserRole();

    // Check if user is authenticated
    if (!authToken || !userRole) {
      navigate('/user-login');
      return;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'advisor') {
        navigate('/advisor-dashboard');
      } else {
        navigate('/financial-dashboard');
      }
    }
  }, [navigate, allowedRoles]);

  const authToken = localStorage.getItem('authToken');
  const userRole = getUserRole();

  // Show nothing while checking authentication
  if (!authToken || !userRole) {
    return null;
  }

  // Show nothing if user doesn't have required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
