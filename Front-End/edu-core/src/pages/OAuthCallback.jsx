import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../store/atoms';
import { authService } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the URL parameters
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        console.log('OAuth callback received:', { code, state, error });

        if (error) {
          toast.error(`OAuth error: ${error}`);
          navigate('/login');
          return;
        }

        if (!code) {
          toast.error('Authentication failed. No authorization code received.');
          navigate('/login');
          return;
        }

        // Exchange the code for a token
        console.log('Exchanging OAuth code for token...');
        const response = await authService.exchangeOAuthCode({ code, state });
        const userData = response.data;

        console.log('OAuth login successful:', userData);
        
        // Store token and user data
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Login successful!');

        // Get redirect path from localStorage or use default
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');

        // Redirect based on user role
        if (userData.roles && userData.roles.includes('Admin')) {
          console.log('OAuth user is admin, redirecting to admin dashboard');
          navigate('/admin/dashboard', { replace: true });
        } else if (userData.roles && userData.roles.includes('Instructor')) {
          console.log('OAuth user is instructor, redirecting to instructor dashboard');
          navigate('/instructor/dashboard', { replace: true });
        } else {
          console.log('OAuth user is regular user, redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        const errorMessage = error.response?.data?.message || error.response?.data || 'Authentication failed. Please try again.';
        toast.error(errorMessage);
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [navigate, searchParams, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner fullScreen />
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Completing authentication...</h2>
        <p className="text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;