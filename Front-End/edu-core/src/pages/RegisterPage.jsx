import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button as BSButton } from 'react-bootstrap';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authService } from '../services/api';
import { userAtom } from '../store/atoms';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      const userData = response.data;
      
      // AUTO-LOGIN: Store token and user data
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Email is sent automatically by backend (Welcome email)
      toast.success('🎉 Account created successfully! Welcome to EduCore!');
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    toast.info(`${provider} registration will be implemented with OAuth`);
    // TODO: Implement OAuth flow
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
                  <h1 className="auth-title">Create Account</h1>
                  <p className="auth-subtitle">Join thousands of learners worldwide</p>

                  {/* Social Registration Buttons */}
                  <div className="social-login-buttons">
                    <BSButton 
                      variant="outline-danger"
                      className="social-btn"
                      onClick={() => handleSocialRegister('google')}
                    >
                      <FaGoogle /> Sign up with Google
                    </BSButton>
                    <BSButton 
                      variant="outline-primary"
                      className="social-btn"
                      onClick={() => handleSocialRegister('facebook')}
                    >
                      <FaFacebook /> Sign up with Facebook
                    </BSButton>
                    <BSButton 
                      variant="outline-dark"
                      className="social-btn"
                      onClick={() => handleSocialRegister('github')}
                    >
                      <FaGithub /> Sign up with GitHub
                    </BSButton>
                  </div>

                  <div className="auth-divider">
                    <span>or register with email</span>
                  </div>

                  <Form onSubmit={handleSubmit} className="auth-form">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <div className="input-with-icon">
                            <FiUser className="input-icon" />
                            <Form.Control
                              type="text"
                              name="firstName"
                              placeholder="First name"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <div className="input-with-icon">
                            <FiUser className="input-icon" />
                            <Form.Control
                              type="text"
                              name="lastName"
                              placeholder="Last name"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

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
                          placeholder="Create password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={6}
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

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <div className="input-with-icon">
                        <FiLock className="input-icon" />
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Check 
                      type="checkbox"
                      label={<span>I agree to the <Link to="/terms">Terms & Conditions</Link></span>}
                      className="mb-3"
                      required
                    />

                    <BSButton 
                      type="submit" 
                      variant="primary"
                      size="lg"
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
                    </BSButton>
                  </Form>

                  <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
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
                  <h2>Join Our Community</h2>
                  <p>Learn at your own pace with lifetime access to courses</p>
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=800&fit=crop" 
                    alt="Learning Community"
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

export default RegisterPage;