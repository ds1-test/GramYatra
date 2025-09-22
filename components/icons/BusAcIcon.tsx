import React from 'react';

const BusAcIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`w-8 h-8 ${className}`}
    viewBox="0 0 24 24" 
    strokeWidth="1.5" 
    stroke="currentColor" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <circle cx="6" cy="17" r="2" />
    <circle cx="18" cy="17" r="2" />
    <path d="M4 17h-2v-11a1 1 0 0 1 1 -1h14a5 7 0 0 1 5 7v5h-2m-4 0h-8" />
    <line x1="2" y1="10" x2="17" y2="10" />
    {/* Snowflake */}
    <path d="M12 5l0 2.5" />
    <path d="M10.5 6.5l3 0" />
    <path d="M10.85 5.5l2.3 2.3" />
    <path d="M13.15 5.5l-2.3 2.3" />
  </svg>
);

export default BusAcIcon;
