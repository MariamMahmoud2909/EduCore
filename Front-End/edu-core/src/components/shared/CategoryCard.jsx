import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="category-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(`/courses?category=${category.id}`)}
    >
      <div className="category-image">
        <img 
          src={category.image || `https://via.placeholder.com/300x200/1E3A8A/FFFFFF?text=${category.name}`} 
          alt={category.name}
        />
      </div>
      <div className="category-content">
        <h3 className="category-name">{category.name}</h3>
        <p className="category-count">{category.coursesCount || Math.floor(Math.random() * 50) + 10} Courses</p>
      </div>
    </motion.div>
  );
};

export default CategoryCard;