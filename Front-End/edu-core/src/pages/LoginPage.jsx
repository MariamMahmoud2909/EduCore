import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button as BSButton } from 'react-bootstrap';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authService } from '../services/api';
import { userAtom } from '../store/atoms';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Redirect based on role
        if (userData.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }

      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate, setUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', formData);
      const response = await authService.login(formData);
      const userData = response.data;
      
      console.log('Login response:', userData);
      
      // Store token and user data
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Login successful!');
      
      // Check for redirect path from location state (if coming from protected route)
      const from = location.state?.from?.pathname || '/';
      
      // Redirect based on user role
      if (userData.isAdmin) {
        console.log('User is admin, redirecting to admin dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else if (userData.roles && userData.roles.includes('Instructor')) {
        console.log('User is instructor, redirecting to instructor dashboard');
        navigate('/instructor/dashboard', { replace: true });
      } else {
        console.log('User is regular user, redirecting to:', from);
        navigate(from, { replace: true });
      }
      
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Initiating ${provider} login`);
    const backendUrl = 'https://mariam2909-001-site1.anytempurl.com';
    
    // Store the current location to redirect back after login
    const currentPath = location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);
    
    window.location.href = `${backendUrl}/api/Auth/external-login/${provider}`;
  };

  // If already logged in, show loading while redirecting
  if (user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <LoadingSpinner size="lg" text="Redirecting..." />
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="auth-container">
              <motion.div 
                className="auth-form-section"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="auth-form-wrapper">
                  <h1 className="auth-title">Welcome Back</h1>
                  <p className="auth-subtitle">Login to continue your learning journey</p>

                  {/* Social Login Buttons */}
                  <div className="social-login-buttons">
                    <BSButton 
                      variant="outline-danger"
                      className="social-btn"
                      onClick={() => handleSocialLogin('Google')}
                      disabled={loading}
                    >
                      <FaGoogle /> Continue with Google
                    </BSButton>
                    <BSButton 
                      variant="outline-primary"
                      className="social-btn"
                      onClick={() => handleSocialLogin('Facebook')}
                      disabled={loading}
                    >
                      <FaFacebook /> Continue with Facebook
                    </BSButton>
                    <BSButton 
                      variant="outline-dark"
                      className="social-btn"
                      onClick={() => handleSocialLogin('GitHub')}
                      disabled={loading}
                    >
                      <FaGithub /> Continue with GitHub
                    </BSButton>
                  </div>

                  <div className="auth-divider">
                    <span>or login with email</span>
                  </div>

                  <Form onSubmit={handleSubmit} className="auth-form">
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <div className="input-with-icon">
                        <FiMail className="input-icon" />
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <div className="input-with-icon">
                        <FiLock className="input-icon" />
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </Form.Group>

                    <div className="form-footer">
                      <Form.Check 
                        type="checkbox"
                        label="Remember me"
                        className="checkbox-label"
                        disabled={loading}
                      />
                      <Link to="/forgot-password" className="forgot-link">
                        Forgot Password?
                      </Link>
                    </div>

                    <BSButton 
                      type="submit" 
                      variant="primary"
                      size="lg"
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="sm" /> : 'Login'}
                    </BSButton>
                  </Form>

                  <p className="auth-switch">
                    Don't have an account? <Link to="/register">Sign up</Link>
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="auth-image-section"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="auth-image-content">
                  <h2>Start Your Learning Journey</h2>
                  <p>Access thousands of courses and learn from expert instructors</p>
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=800&fit=crop" 
                    alt="Learning"
                  />
                </div>
              </motion.div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;