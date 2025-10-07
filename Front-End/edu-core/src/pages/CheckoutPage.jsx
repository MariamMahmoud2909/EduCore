import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { FiCreditCard, FiLock, FiUser, FiMail, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { orderService, cartService } from '../services/api';
import { cartAtom, userAtom } from '../store/atoms';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useAtom(cartAtom);
  const [user] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [billingInfo, setBillingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit_card' // credit_card, paypal, stripe
  });

  useEffect(() => {
    if (cart.length === 0) {
      toast.info('Your cart is empty');
      navigate('/courses');
    }
  }, [cart, navigate]);

  const handleBillingChange = (e) => {
    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\//g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5);
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    setPaymentInfo({
      ...paymentInfo,
      [name]: value
    });
  };

  const validateForm = () => {
    // Validate billing info
    if (!billingInfo.fullName || !billingInfo.email || !billingInfo.phone) {
      toast.error('Please fill in all required billing information');
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Validate payment info
    if (paymentInfo.paymentMethod === 'credit_card') {
      if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        toast.error('Please fill in all payment information');
        return false;
      }

      // Basic card number validation (remove spaces and check length)
      const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        toast.error('Please enter a valid card number');
        return false;
      }

      // Expiry date validation
      const [month, year] = paymentInfo.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
        toast.error('Please enter a valid expiry date');
        return false;
      }

      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        toast.error('Card has expired');
        return false;
      }

      // CVV validation
      if (paymentInfo.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    }

    return true;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price || item.course?.price || 0;
      return total + price;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessingPayment(true);

    try {
      // Prepare order data
      const orderData = {
        billingInfo,
        paymentInfo: {
          ...paymentInfo,
          // Remove sensitive data before sending (in production, use payment gateway tokens)
          cardNumber: paymentInfo.cardNumber.slice(-4), // Only last 4 digits
          cvv: undefined // Never send CVV to backend
        },
        courseIds: cart.map(item => item.courseId || item.id),
        totalAmount: calculateTotal(),
        currency: 'USD'
      };

      // Process checkout
      const response = await orderService.checkout(orderData);

      // Clear cart on success
      await cartService.clearCart();
      setCart([]);

      toast.success('Payment successful! Redirecting...');
      
      // Redirect to success page
      setTimeout(() => {
        navigate('/payment-success', { 
          state: { 
            orderId: response.data.orderId || response.data.id,
            orderDetails: response.data 
          } 
        });
      }, 1500);

    } catch (error) {
      console.error('Checkout error:', error);
      
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid payment information');
      } else if (error.response?.status === 402) {
        toast.error('Payment declined. Please check your payment details.');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
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
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Phone Number *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={billingInfo.phone}
                            onChange={handleBillingChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={billingInfo.address}
                            onChange={handleBillingChange}
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
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>State/Province</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            value={billingInfo.state}
                            onChange={handleBillingChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>ZIP/Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="zipCode"
                            value={billingInfo.zipCode}
                            onChange={handleBillingChange}
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

                {/* Payment Method */}
                <Card className="checkout-card">
                  <Card.Body>
                    <h3 className="section-title">
                      <FiCreditCard /> Payment Method
                    </h3>

                    {/* Payment Method Selection */}
                    <div className="payment-methods mb-4">
                      <Form.Check
                        type="radio"
                        id="credit_card"
                        name="paymentMethod"
                        label={
                          <div className="payment-option">
                            <FiCreditCard /> Credit/Debit Card
                          </div>
                        }
                        value="credit_card"
                        checked={paymentInfo.paymentMethod === 'credit_card'}
                        onChange={handlePaymentChange}
                      />
                      <Form.Check
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        label={
                          <div className="payment-option">
                            💳 PayPal
                          </div>
                        }
                        value="paypal"
                        checked={paymentInfo.paymentMethod === 'paypal'}
                        onChange={handlePaymentChange}
                      />
                    </div>

                    {/* Credit Card Form */}
                    {paymentInfo.paymentMethod === 'credit_card' && (
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
                            <div className="card-logos mt-2">
                              <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" width="40" />
                              <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" width="40" />
                              <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" width="40" />
                            </div>
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
                    )}

                    {/* PayPal Notice */}
                    {paymentInfo.paymentMethod === 'paypal' && (
                      <div className="paypal-notice">
                        <p>You will be redirected to PayPal to complete your purchase.</p>
                      </div>
                    )}

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
                      {cart.map((item) => {
                        const course = item.course || item;
                        const price = item.price || course.price || 0;
                        const title = course.title || item.title;

                        return (
                          <div key={item.id || item.courseId} className="summary-item">
                            <div className="item-details">
                              <h6>{title}</h6>
                            </div>
                            <span className="item-price">${price.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>

                    <hr />

                    {/* Price Breakdown */}
                    <div className="price-breakdown">
                      <div className="price-row">
                        <span>Subtotal</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="price-row">
                        <span>Tax</span>
                        <span>$0.00</span>
                      </div>
                      <div className="price-row">
                        <span>Discount</span>
                        <span className="text-success">-$0.00</span>
                      </div>
                      <hr />
                      <div className="price-row total-row">
                        <strong>Total</strong>
                        <strong className="total-price">
                          ${calculateTotal().toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 mt-4"
                      disabled={processingPayment || cart.length === 0}
                    >
                      {processingPayment ? (
                        <>
                          <LoadingSpinner size="sm" /> Processing...
                        </>
                      ) : (
                        <>
                          <FiLock /> Complete Purchase
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