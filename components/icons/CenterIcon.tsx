import React from 'react';

const CenterIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`w-6 h-6 ${className}`}
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4H4v5m11-5h5v5m-5 11h5v-5M9 20H4v-5" />
  </svg>
);

export default CenterIcon;
