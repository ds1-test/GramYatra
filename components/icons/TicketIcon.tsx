import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number;
  focused?: boolean;
}

const TicketIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 24, focused = false, className, ...props }) => (
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
    <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
    <path d="M3 15v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
    <path d="M22 12a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v0Z" />
    {focused && <path d="M8 12h.01M12 12h.01M16 12h.01" />}
  </svg>
);

export default TicketIcon;