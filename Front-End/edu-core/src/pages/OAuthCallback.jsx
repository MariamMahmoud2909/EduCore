import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import { userAtom, tokenAtom } from '../store/atoms';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, setUser] = useAtom(userAtom);
  const [, setToken] = useAtom(tokenAtom);

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (error) {
      toast.error(`Authentication failed: ${error}`);
      navigate('/login');
      return;
    }

    if (token) {
      // Save token and decode user info
      localStorage.setItem('token', token);
      setToken(token);

      // Decode JWT to get user info (simple base64 decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userData = {
          id: payload.nameid || payload.sub,
          email: payload.email,
          name: payload.name || payload.unique_name,
          role: payload.role || 'Student',
          isAdmin: payload.role === 'Admin'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        toast.success(`Welcome! Logged in with ${provider}`);
        navigate('/');
      } catch (err) {
        console.error('Error decoding token:', err);
        toast.error('Authentication failed');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setUser, setToken]);

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