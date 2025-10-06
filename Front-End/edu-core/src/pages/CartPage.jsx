import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { cartAtom, cartTotalAtom } from '../store/atoms';
import { cartService } from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const TAX_RATE = 0.15;
  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + tax;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      await cartService.removeFromCart(courseId);
      setCart(prev => prev.filter(course => course.id !== courseId));
      toast.success('Course removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove course');
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <motion.div 
            className="empty-cart-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FiShoppingBag size={80} className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Start learning today by adding some courses to your cart!</p>
            <Link to="/courses" className="btn btn-primary btn-lg">
              Browse Courses
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">{cart.length} course{cart.length !== 1 ? 's' : ''} in cart</p>

          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items">
              {cart.map((course, index) => (
                <motion.div
                  key={course.id}
                  className="cart-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img 
                    src={course.image || 'https://via.placeholder.com/150x100'} 
                    alt={course.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{course.title}</h3>
                    <p className="cart-item-instructor">by {course.instructorName}</p>
                    <div className="cart-item-meta">
                      <span className="badge badge-primary">{course.categoryName}</span>
                      <span className="cart-item-duration">{course.duration}h</span>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <p className="cart-item-price">${course.price}</p>
                    <button
                      className="btn-remove"
                      onClick={() => removeFromCart(course.id)}
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax (15%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row summary-total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <button 
                className="btn btn-primary btn-lg w-full"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
              </button>
              
              <Link to="/courses" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;