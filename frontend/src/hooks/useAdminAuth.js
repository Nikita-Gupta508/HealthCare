import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.role === 'admin') {
            setIsAuthenticated(true);
            setUser(parsedUser);
          } else {
            // Not an admin, redirect to appropriate page
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/sign-in');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/sign-in');
        }
      } else {
        navigate('/sign-in');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/sign-in');
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout
  };
};
