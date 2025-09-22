import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number;
}

const NearbyStopsIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 28, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke={color}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
    <path d="M3 13l9 -9l9 9" />
    <path d="M4 21v-10.5" />
    <path d="M20 10.5v10.5" />
  </svg>
);
export default NearbyStopsIcon;