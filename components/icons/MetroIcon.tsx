import React from 'react';

const MetroIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`w-6 h-6 ${className}`}
    viewBox="0 0 24 24" 
    strokeWidth="1.5" 
    stroke="currentColor" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <rect x="3" y="12" width="18" height="6" rx="3" />
    <path d="M6 12v-6a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v6" />
    <line x1="10" y1="15" x2="14" y2="15" />
  </svg>
);
export default MetroIcon;