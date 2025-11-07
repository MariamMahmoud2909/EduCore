import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FiCheckCircle, FiHome, FiDownload, FiMail } from 'react-icons/fi';
import './PaymentSuccessPage.css';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const {
    orderId = 'N/A',
    transactionId = 'N/A',
    amount = 0,
    subtotal = 0,
    tax = 0,
    courses = 0,
    email = '',
    fullName = '',
    courseIds = []
  } = state;

  useEffect(() => {
    // Optional: Log the successful order
    console.log('Order successful:', {
      orderId,
      transactionId,
      amount,
      email,
      courseIds
    });
  }, [orderId, transactionId, amount, email, courseIds]);

  const handleDownloadReceipt = () => {
    // Create a simple receipt and download it
    const receipt = `
EduCore - ORDER RECEIPT
================================

Order Number: ${orderId}
Transaction ID: ${transactionId}
Date: ${new Date().toLocaleDateString()}

CUSTOMER INFORMATION
Name: ${fullName}
Email: ${email}

ORDER DETAILS
Number of Courses: ${courses}

PAYMENT SUMMARY
Subtotal: $${subtotal.toFixed(2)}
Tax (15%): $${tax.toFixed(2)}
Total: $${amount.toFixed(2)}

Status: COMPLETED ✓

This receipt has been sent to your email: ${email}
You can now access all purchased courses in your dashboard.

Thank you for your purchase!
================================
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receipt));
    element.setAttribute('download', `EduCore_Receipt_${orderId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  return (
    <div className="payment-success-page">
      <Container>
        <motion.div 
          className="success-content"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="success-icon">
              <FiCheckCircle size={80} />
            </div>
          </motion.div>

          <h1 className="success-title">Payment Successful! 🎉</h1>
          <p className="success-message">
            Thank you for your purchase! Your courses are now available in your dashboard. 
            Best of luck on your learning journey!
          </p>

          <div className="success-info">
            <p>📧 A confirmation email has been sent to your inbox</p>
            <p>🎓 You can now access all your purchased courses</p>
          </div>

          <Row className="g-4">
            {/* Order Details Card */}
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Card className="order-details-card">
                  <Card.Header className="bg-success text-white">
                    <h5 className="mb-0">Order Confirmation</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-4">
                      <Col md={6}>
                        <div className="detail-item">
                          <p className="detail-label">Order Number</p>
                          <p className="detail-value">#{orderId}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="detail-item">
                          <p className="detail-label">Transaction ID</p>
                          <p className="detail-value font-monospace small">{transactionId}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="detail-item">
                          <p className="detail-label">Date & Time</p>
                          <p className="detail-value">{new Date().toLocaleString()}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="detail-item">
                          <p className="detail-label">Status</p>
                          <p className="detail-value">
                            <span className="badge bg-success">Completed</span>
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <Card className="customer-info-card mt-4">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Customer Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="detail-item">
                          <p className="detail-label">Full Name</p>
                          <p className="detail-value">{fullName || 'N/A'}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="detail-item">
                          <p className="detail-label">Email Address</p>
                          <p className="detail-value">{email || 'N/A'}</p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* What's Next */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <Card className="whats-next-card mt-4">
                  <Card.Header className="bg-info text-white">
                    <h5 className="mb-0">What's Next?</h5>
                  </Card.Header>
                  <Card.Body>
                    <ul className="next-steps-list">
                      <li>
                        <FiMail className="step-icon" />
                        <span>Check your email for a confirmation message and receipt</span>
                      </li>
                      <li>
                        <span className="step-number">📚</span>
                        <span>Go to your dashboard to access your purchased courses</span>
                      </li>
                      <li>
                        <span className="step-number">🎓</span>
                        <span>Start learning and track your progress</span>
                      </li>
                      <li>
                        <span className="step-number">💡</span>
                        <span>Need help? Contact our support team anytime</span>
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Payment Summary Sidebar */}
            <Col lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Card className="payment-summary-card sticky-top">
                  <Card.Header className="bg-dark text-white">
                    <h5 className="mb-0">Payment Summary</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="summary-section">
                      <p className="summary-label">Courses Purchased</p>
                      <p className="summary-value">{courses} Course{courses !== 1 ? 's' : ''}</p>
                    </div>

                    <hr />

                    <div className="price-breakdown">
                      <div className="price-row">
                        <span className="price-label">Subtotal</span>
                        <span className="price-amount">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="price-row tax-row">
                        <span className="price-label">Tax (15%)</span>
                        <span className="price-amount tax-amount">${tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="total-section">
                      <div className="total-row">
                        <span className="total-label">Total Paid</span>
                        <span className="total-amount">${amount.toFixed(2)}</span>
                      </div>
                    </div>

                    <hr />

                    <div className="payment-method">
                      <p className="method-label">Payment Method</p>
                      <p className="method-value">
                        <span className="badge bg-primary">Credit Card</span>
                      </p>
                    </div>

                    <Button
                      onClick={handleDownloadReceipt}
                      className="w-100 mt-4 receipt-btn"
                      variant="outline-primary"
                    >
                      <FiDownload /> Download Receipt
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Action Buttons */}
          <motion.div
            className="action-buttons mt-5 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <Button
              onClick={() => navigate('/my-courses')}
              className="btn-success-action me-3"
              size="lg"
            >
              🎓 Go to My Courses
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline-primary"
              size="lg"
            >
              <FiHome /> Return to Home
            </Button>
          </motion.div>

          {/* Success Footer */}
          <motion.div
            className="success-footer mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <p className="text-center text-muted">
              A confirmation email has been sent to <strong>{email}</strong>
            </p>
            <p className="text-center text-muted small">
              You can start accessing your courses immediately. Thank you for choosing EduCore!
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default PaymentSuccessPage;