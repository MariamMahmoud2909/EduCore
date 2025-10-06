import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import './StatCard.css';

const StatCard = ({ title, value, icon: Icon, color, delay = 0, prefix = '', suffix = '' }) => {
  return (
    <motion.div
      className="stat-card-admin"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="stat-icon-wrapper" style={{ background: color }}>
        <Icon size={28} color="#FFFFFF" />
      </div>
      <div className="stat-content">
        <h3 className="stat-value">
          {prefix}
          <CountUp end={value} duration={2} separator="," />
          {suffix}
        </h3>
        <p className="stat-title">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;