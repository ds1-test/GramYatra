import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number;
}

const JourneyPlannerIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 28, className, ...props }) => (
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
    <path d="M10 12.5l-1.5 -1.5" />
    <path d="M13.5 9.5l-1.5 1.5" />
    <path d="M13.847 13.851l-1.347 1.349" />
    <path d="M10.149 9.851l-1.349 1.349" />
    <path d="M15 12h.01" />
    <path d="M9 12h.01" />
    <path d="M12 9v.01" />
    <path d="M12 15v.01" />
    <path d="M5.05 17.05l-1.05 -1.05" />
    <path d="M17.05 5.05l-1.05 -1.05" />
    <path d="M5.05 5.05l-1.05 1.05" />
    <path d="M17.05 17.05l-1.05 1.05" />
    <path d="M7 12a5 5 0 1 0 10 0a5 5 0 0 0 -10 0" />
  </svg>
);

export default JourneyPlannerIcon;