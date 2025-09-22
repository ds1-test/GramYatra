import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number;
  focused?: boolean;
}

const UserIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24, focused = false, className, ...props }) => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default UserIcon;