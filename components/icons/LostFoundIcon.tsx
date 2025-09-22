import React from 'react';

const LostFoundIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`w-7 h-7 ${className}`}
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M12 16v.01" />
        <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
    </svg>
);

export default LostFoundIcon;