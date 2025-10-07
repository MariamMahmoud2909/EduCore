import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { cartService } from '../services/api';
import { cartAtom, cartTotalAtom, userAtom } from '../store/atoms';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const [user] = useAtom(userAtom);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart();
      
      // Handle different response structures
      if (response.data.items) {
        setCart(response.data.items);
      } else if (Array.isArray(response.data)) {
        setCart(response.data);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (courseId) => {
    setRemoving(courseId);
    try {
      await cartService.removeFromCart(courseId);
      setCart(cart.filter(item => item.id !== courseId && item.courseId !== courseId));
      toast.success('Course removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove course from cart');
    } finally {
      setRemoving(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartService.clearCart();
        setCart([]);
        toast.success('Cart cleared');
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price || item.course?.price || 0;
      return total + price;
    }, 0);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="cart-page">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="page-header">
            <h1 className="page-title">
              <FiShoppingCart /> Shopping Cart
            </h1>
            <p className="page-subtitle">
              {cart.length} {cart.length === 1 ? 'course' : 'courses'} in your cart
            </p>
          </div>

          {cart.length === 0 ? (
            <motion.div
              className="empty-cart"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FiShoppingCart size={80} />
              <h2>Your cart is empty</h2>
              <p>Explore our courses and start learning today!</p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/courses')}
              >
                Browse Courses
              </Button>
            </motion.div>
          ) : (
            <Row className="g-4">
              {/* Cart Items */}
              <Col lg={8}>
                <AnimatePresence>
                  {cart.map((item, index) => {
                    const course = item.course || item;
                    const courseId = item.courseId || item.id;
                    const price = item.price || course.price || 0;
                    const title = course.title || item.title;
                    const instructor = course.instructor || course.instructorName || item.instructor;
                    const imageUrl = course.imageUrl || course.thumbnailUrl || item.imageUrl;

                    return (
                      <motion.div
                        key={courseId}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card className="cart-item-card mb-3">
                          <Card.Body>
                            <Row className="align-items-center">
                              <Col md={2}>
                                <img
                                  src={imageUrl || 'https://via.placeholder.com/150'}
                                  alt={title}
                                  className="cart-item-image"
                                />
                              </Col>
                              <Col md={6}>
                                <h5 className="cart-item-title">{title}</h5>
                                <p className="cart-item-instructor">
                                  By {instructor || 'Unknown Instructor'}
                                </p>
                                {course.duration && (
                                  <span className="cart-item-duration">
                                    {course.duration} hours
                                  </span>
                                )}
                              </Col>
                              <Col md={2} className="text-center">
                                <h4 className="cart-item-price">${price.toFixed(2)}</h4>
                              </Col>
                              <Col md={2} className="text-end">
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleRemoveFromCart(courseId)}
                                  disabled={removing === courseId}
                                >
                                  {removing === courseId ? (
                                    <LoadingSpinner size="sm" />
                                  ) : (
                                    <>
                                      <FiTrash2 /> Remove
                                    </>
                                  )}
                                </Button>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                <Button
                  variant="outline-secondary"
                  onClick={handleClearCart}
                  className="mt-3"
                >
                  Clear Cart
                </Button>
              </Col>

              {/* Order Summary */}
              <Col lg={4}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="order-summary-card sticky-top">
                    <Card.Body>
                      <h4 className="summary-title">Order Summary</h4>
                      
                      <div className="summary-details">
                        <div className="summary-row">
                          <span>Subtotal ({cart.length} items)</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Discount</span>
                          <span className="text-success">-$0.00</span>
                        </div>
                        <hr />
                        <div className="summary-row total-row">
                          <strong>Total</strong>
                          <strong className="total-price">
                            ${calculateTotal().toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="lg"
                        className="w-100 checkout-btn"
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout <FiArrowRight />
                      </Button>

                      <div className="payment-methods mt-3">
                        <p className="text-muted small mb-2">We accept:</p>
                        <div className="payment-icons">
                          <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
                          <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" />
                          <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" />
                        </div>
                      </div>

                      <div className="guarantee-badge mt-3">
                        <p className="text-center text-muted small">
                          🔒 30-day money-back guarantee
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default CartPage;