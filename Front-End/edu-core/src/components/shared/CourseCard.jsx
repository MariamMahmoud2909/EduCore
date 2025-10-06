import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { FiStar, FiClock, FiUser, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { cartAtom, userAtom } from '../../store/atoms';
import { cartService } from '../../services/api';
import { toast } from 'react-toastify';
import './CourseCard.css';

const CourseCard = ({ course, delay = 0 }) => {
  const [cart, setCart] = useAtom(cartAtom);
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  
  const isInCart = cart.some(item => item.id === course.id);
  
  const addToCart = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.info('Please login to add courses to cart');
      navigate('/login');
      return;
    }
    
    try {
      await cartService.addToCart(course.id);
      setCart(prev => [...prev, course]);
      toast.success('Course added to cart!');
    } catch (error) {
      toast.error('Failed to add course to cart');
      console.error('Error adding to cart:', error);
    }
  };

  const getLevelBadgeClass = () => {
    switch(course.level) {
      case 1: return 'badge-success';
      case 2: return 'badge-warning';
      case 3: return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  const getLevelName = () => {
    switch(course.level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Expert';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      className="course-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      {/* Course Image */}
      <div className="course-image">
        <img 
          src={course.image || 'https://via.placeholder.com/400x250/1E3A8A/FFFFFF?text=Course'} 
          alt={course.title}
        />
        <span className={`course-level-badge badge ${getLevelBadgeClass()}`}>
          {getLevelName()}
        </span>
      </div>

      {/* Course Content */}
      <div className="course-content">
        {/* Category */}
        <span className="course-category">{course.categoryName}</span>

        {/* Title */}
        <h3 className="course-title">{course.title}</h3>

        {/* Description */}
        <p className="course-description">
          {course.description?.substring(0, 80)}...
        </p>

        {/* Meta Info */}
        <div className="course-meta">
          <div className="course-rating">
            <FiStar className="star-icon filled" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          <div className="course-duration">
            <FiClock />
            <span>{course.duration}h</span>
          </div>
          <div className="course-instructor">
            <FiUser />
            <span>{course.instructorName}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="course-footer">
          <div className="course-price">
            <span className="price-amount">${course.price}</span>
          </div>
          <button 
            className={`btn ${isInCart ? 'btn-outline' : 'btn-primary'} btn-sm`}
            onClick={addToCart}
            disabled={isInCart}
          >
            <FiShoppingCart />
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
