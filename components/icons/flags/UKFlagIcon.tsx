import React from 'react';

const UKFlagIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 30"
    className={`w-6 h-auto rounded-sm ${className}`}
  >
    <clipPath id="a">
      <path d="M0 0h60v30H0z" />
    </clipPath>
    <clipPath id="b">
      <path d="M30 15h30v15H30zm0-15h30v15H30zM0 15h30v15H0zM0 0h30v15H0z" />
    </clipPath>
    <g clipPath="url(#a)">
      <path d="M0 0v30h60V0z" fill="#012169" />
      <path
        d="M0 0l60 30m0-30L0 30"
        stroke="#fff"
        strokeWidth="6"
      />
      <path
        d="M0 0l60 30m0-30L0 30"
        clipPath="url(#b)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path
        d="M30 0v30M0 15h60"
        stroke="#fff"
        strokeWidth="10"
      />
      <path
        d="M30 0v30M0 15h60"
        stroke="#C8102E"
        strokeWidth="6"
      />
    </g>
  </svg>
);

export default UKFlagIcon;
