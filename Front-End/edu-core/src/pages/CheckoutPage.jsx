import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { FiCreditCard, FiLock, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { orderService, cartService } from '../services/api';
import { cartAtom, userAtom } from '../store/atoms';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useAtom(cartAtom);
  const [user] = useAtom(userAtom);
  const [processingPayment, setProcessingPayment] = useState(false);

  const TAX_RATE = 0.15;

  const [billingInfo, setBillingInfo] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName}`.trim() : '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: 'cairo',
    zipCode: '12111',
    country: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'CreditCard'
  });

  // Get cart items safely
  const getCartItems = () => {
    if (!cart) return [];
    if (Array.isArray(cart)) return cart;
    if (cart.items && Array.isArray(cart.items)) return cart.items;
    return [];
  };

  const cartItems = getCartItems();

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info('Your cart is empty');
      navigate('/courses');
    }
  }, [cartItems, navigate]);

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.price || item.course?.price || 0;
      return sum + price;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handleBillingChange = (e) => {
    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    if (name === 'expiryDate') {
      value = value.replace(/\//g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5);
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    setPaymentInfo({
      ...paymentInfo,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!billingInfo.fullName || !billingInfo.email) {
      toast.error('Please fill in full name and email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (paymentInfo.paymentMethod === 'CreditCard') {
      if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        toast.error('Please fill in all payment information');
        return false;
      }

      const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
      if (cardNumber.length < 13) {
        toast.error('Please enter a valid card number');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessingPayment(true);

    try {
      const courseIds = cartItems.map(item => item.courseId || item.id);

      // Create checkout DTO matching backend expectations
      const checkoutDto = {
        courseIds: courseIds,
        totalAmount: parseFloat(total.toFixed(2)),
        currency: 'L.E',
        billingInfo: {
          fullName: user?.firstName ? `${user.firstName} ${user.lastName}`.trim() : '',
          email: user?.email || '',
          phone: billingInfo.phone,
          address: billingInfo.address,
          city: billingInfo.city,
          state: 'cairo',
          zipCode: '12111',
          country: billingInfo.country
        },
        paymentInfo: {
          paymentMethod: paymentInfo.paymentMethod,
          cardNumber: paymentInfo.cardNumber.replace(/\s/g, ''),
          cardName: paymentInfo.cardName,
          expiryDate: paymentInfo.expiryDate,
          //paymentMethod: 'CreditCard',
          Cvv: paymentInfo.cvv
        }
      };

      console.log('Submitting checkout:', checkoutDto);

      // Call checkout endpoint
      const response = await orderService.checkout(checkoutDto);

      console.log('Checkout successful:', response.data);

      // Clear cart after successful payment
      try {
        await cartService.clearCart();
      } catch (err) {
        console.warn('Could not clear cart from backend:', err);
      }
      
      // Clear local cart state
      setCart([]);
      localStorage.removeItem('cart');

      toast.success('Payment successful! Redirecting...');

      // Redirect to success page with order details
      setTimeout(() => {
        navigate('/payment-success', {
          state: {
            orderId: response.data.orderId,
            transactionId: response.data.transactionId,
            amount: total,
            subtotal: subtotal,
            tax: tax,
            courses: cartItems.length,
            email: billingInfo.email,
            fullName: billingInfo.fullName,
            courseIds: courseIds
          }
        });
      }, 1500);

    } catch (error) {
      console.error('Checkout error:', error);
      console.error('Error response:', error.response?.data);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join(', ');
        toast.error('Validation error: ' + errorMessage);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Payment processing failed. Please try again.');
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <Container>
          <div className="text-center py-5">
            <p className="text-muted">Your cart is empty</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title text-center mb-4">
            <FiLock /> Secure Checkout
          </h1>

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Left Column - Forms */}
              <Col lg={8}>
                {/* Billing Information */}
                <Card className="checkout-card mb-4">
                  <Card.Body>
                    <h3 className="section-title">
                      <FiUser /> Billing Information
                    </h3>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Full Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={billingInfo.fullName}
                            onChange={handleBillingChange}
                            required
                            placeholder="Your full name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Email Address *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={billingInfo.email}
                            onChange={handleBillingChange}
                            required
                            placeholder="your@email.com"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={billingInfo.phone}
                            onChange={handleBillingChange}
                            placeholder="(555) 123-4567"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={billingInfo.address}
                            onChange={handleBillingChange}
                            placeholder="123 Main Street"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={billingInfo.city}
                            onChange={handleBillingChange}
                            placeholder="New York"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Country</Form.Label>
                          <Form.Select
                            name="country"
                            value={billingInfo.country}
                            onChange={handleBillingChange}
                          >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="EG">Egypt</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Payment Information */}
                <Card className="checkout-card">
                  <Card.Body>
                    <h3 className="section-title">
                      <FiCreditCard /> Payment Information
                    </h3>
                    <p className="text-muted small mb-3">
                      No card validation required. Enter any details to proceed.
                    </p>

                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Card Number *</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentInfo.cardNumber}
                            onChange={handlePaymentChange}
                            maxLength="19"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Cardholder Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardName"
                            placeholder="John Doe"
                            value={paymentInfo.cardName}
                            onChange={handlePaymentChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Expiry Date *</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            maxLength="5"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>CVV *</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvv"
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            maxLength="4"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="security-notice mt-4">
                      <FiLock /> Your payment information is encrypted and secure
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Right Column - Order Summary */}
              <Col lg={4}>
                <Card className="order-summary-card sticky-top">
                  <Card.Body>
                    <h3 className="summary-title">Order Summary</h3>

                    {/* Cart Items */}
                    <div className="summary-items">
                      {cartItems.map((item) => {
                        const course = item.course || item;
                        const price = item.price || course.price || 0;
                        const title = course.title || course.name || item.title || 'Course';
                        const key = item.courseId || item.id;

                        return (
                          <div key={key} className="summary-item">
                            <div className="item-details">
                              <h6>{title}</h6>
                            </div>
                            <span className="item-price">${parseFloat(price).toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>

                    <hr />

                    {/* Price Breakdown */}
                    <div className="price-breakdown">
                      <div className="price-row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="price-row tax-row">
                        <span>Tax (15%)</span>
                        <span className="tax-amount">${tax.toFixed(2)}</span>
                      </div>
                      <hr />
                      <div className="price-row total-row">
                        <strong>Total</strong>
                        <strong className="total-price">
                          ${total.toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 mt-4"
                      disabled={processingPayment || cartItems.length === 0}
                    >
                      {processingPayment ? (
                        <>
                          <LoadingSpinner size="sm" /> Processing Payment...
                        </>
                      ) : (
                        <>
                          <FiLock /> Complete Purchase - ${total.toFixed(2)}
                        </>
                      )}
                    </Button>

                    {/* Guarantees */}
                    <div className="guarantees mt-4">
                      <div className="guarantee-item">
                        <FiLock />
                        <span>Secure 256-bit SSL encryption</span>
                      </div>
                      <div className="guarantee-item">
                        ✓ <span>30-day money-back guarantee</span>
                      </div>
                      <div className="guarantee-item">
                        ✓ <span>Lifetime access to courses</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </motion.div>
      </Container>
    </div>
  );
};

export default CheckoutPage;