import React from 'react';

const IndiaFlagIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    className={`w-6 h-auto rounded-sm ${className}`}
  >
    <rect width="900" height="600" fill="#f93" />
    <rect width="900" height="400" fill="#fff" />
    <rect width="900" height="200" fill="#128807" />
    <g transform="translate(450 300)">
      <circle r="90" fill="#008" />
      <circle r="70" fill="#fff" />
      <circle r="20" fill="#008" />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(7.5)"
      />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(15)"
      />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(22.5)"
      />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(30)"
      />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(37.5)"
      />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(45)"
      />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(52.5)"
      />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(60)"
      />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(67.5)"
      />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(75)"
      />
      <path
        fill="#008"
        d="M-57.5 0h115M0-57.5v115"
        transform="rotate(82.5)"
      />
    </g>
  </svg>
);

export default IndiaFlagIcon;
