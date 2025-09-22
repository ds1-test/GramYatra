import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number;
  focused?: boolean;
}

const HomeIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24, focused = false, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={focused ? color : "none"}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

export default HomeIcon;