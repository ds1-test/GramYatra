import React from 'react';

interface MicrophoneIconProps {
  isListening?: boolean;
  className?: string;
}

const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({ isListening = false, className = '' }) => {
  return (
    <div className="relative flex items-center justify-center">
       {isListening && (
            <div className="absolute w-6 h-6 bg-current rounded-full animate-[pulse-mic_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
       )}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`relative w-6 h-6 ${className}`} 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <rect x="9" y="2" width="6" height="11" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0" />
        <line x1="8" y1="21" x2="16" y2="21" />
      </svg>
    </div>
  );
};

export default MicrophoneIcon;