import React from 'react';

const FacilitiesIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
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
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M12 17l-1 -4l-4 -1l4 -1l1 -4l1 4l4 1l-4 1z" />
    </svg>
);

export default FacilitiesIcon;
