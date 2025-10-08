import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      const userData = response.data;
      
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
  const backendUrl = 'https://localhost:7128';
  window.location.href = `${backendUrl}/api/auth/login/${provider}`;
};

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
                    >
                      <FaGoogle /> Continue with Google
                    </BSButton>
                    <BSButton 
                      variant="outline-primary"
                      className="social-btn"
                      onClick={() => handleSocialLogin('Facebook')}
                    >
                      <FaFacebook /> Continue with Facebook
                    </BSButton>
                    <BSButton 
                      variant="outline-dark"
                      className="social-btn"
                      onClick={() => handleSocialLogin('GitHub')}
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
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
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