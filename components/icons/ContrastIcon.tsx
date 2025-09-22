import React from 'react';

const ContrastIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`w-6 h-6 ${className}`}
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
    <path d="M12,3 A9,9 0 0,0 12,21 z" stroke="currentColor" fill="currentColor" />
    <path d="M12 12a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />
  </svg>
);

export default ContrastIcon;