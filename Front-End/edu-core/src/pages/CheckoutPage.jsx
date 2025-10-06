import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { cartAtom, cartTotalAtom } from '../store/atoms';
import { orderService, cartService } from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit-card'
  });
  const navigate = useNavigate();

  const TAX_RATE = 0.15;
  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        courses: cart.map(c => c.id),
        totalAmount: total,
        taxAmount: tax
      };

      await orderService.checkout(orderData);
      
      // Clear cart
      await cartService.clearCart();
      setCart([]);
      
      // Email sent automatically by backend (Purchase confirmation email)
      toast.success('🎉 Payment successful! Check your email.');
      navigate('/payment-success');
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title mb-4">Checkout</h1>

          <Row>
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Body className="p-4">
                  <h3 className="mb-4">Billing Information</h3>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>ZIP Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <h3 className="mt-4 mb-3">Payment Information</h3>

                    <Form.Group className="mb-3">
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                      >
                        <option value="credit-card">Credit Card</option>
                        <option value="debit-card">Debit Card</option>
                        <option value="paypal">PayPal</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            maxLength={3}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg"
                      className="w-100 mt-3"
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="sm" /> : (
                        <><FiLock /> Pay ${total.toFixed(2)}</>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="order-summary-card">
                <Card.Body className="p-4">
                  <h3 className="mb-4">Order Summary</h3>

                  {cart.map(course => (
                    <div key={course.id} className="order-item">
                      <div className="order-item-info">
                        <h6>{course.title}</h6>
                        <small className="text-muted">{course.instructorName}</small>
                      </div>
                      <div className="order-item-price">${course.price}</div>
                    </div>
                  ))}

                  <div className="order-divider"></div>

                  <div className="order-row">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="order-row">
                    <span>Tax (15%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="order-divider"></div>

                  <div className="order-row order-total">
                    <strong>Total:</strong>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default CheckoutPage;