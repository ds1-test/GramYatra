import React from 'react';

type GpsStatus = 'idle' | 'enabling' | 'active' | 'error';

interface GpsIconProps {
  status: GpsStatus;
}

const GpsIcon: React.FC<GpsIconProps> = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'enabling':
        return 'text-teal-300';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-500';
    }
  };
  
  const getAnimation = () => {
    return status === 'enabling' || status === 'active' ? 'animate-pulse' : '';
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`w-6 h-6 ${getColor()} transition-colors duration-500`}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" className={getAnimation()} />
    </svg>
  );
};

export default GpsIcon;