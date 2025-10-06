import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Button } from 'react-bootstrap';
import { FiCheckCircle, FiHome } from 'react-icons/fi';
import './PaymentSuccessPage.css';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

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
            <FiCheckCircle className="success-icon" />
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

          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/')}
            className="mt-4"
          >
            <FiHome /> Return to Home
          </Button>
        </motion.div>
      </Container>
    </div>
  );
};

export default PaymentSuccessPage;