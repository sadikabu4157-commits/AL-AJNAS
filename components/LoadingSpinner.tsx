
import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-yellow-400 ${className}`} />
  );
};

export default LoadingSpinner;
