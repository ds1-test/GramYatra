import React from 'react';

const OriginIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`w-6 h-6 text-green-500 ${className}`}
    viewBox="0 0 24 24" 
    strokeWidth="2" 
    stroke="currentColor" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 21a9 9 0 1 0 0 -18a9 9 0 0 0 0 18z" />
    <path d="M9 12l2 2l4 -4" />
  </svg>
);
export default OriginIcon;