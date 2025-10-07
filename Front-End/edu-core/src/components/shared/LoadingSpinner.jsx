import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return <Spinner animation="border" size={size} variant="primary" />;
};

export default LoadingSpinner;