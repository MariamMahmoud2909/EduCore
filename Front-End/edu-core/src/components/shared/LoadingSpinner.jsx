import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const content = (
    <div className={`spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className={`spinner ${size}`}></div>
    </div>
  );

  return content;
};

export default LoadingSpinner;