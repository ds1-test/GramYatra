import React from 'react';

// FIX: Added size prop to EtaIconProps to allow for dynamic sizing and resolve type error in Map.tsx.
interface EtaIconProps {
    className?: string;
    size?: number;
}

const EtaIcon: React.FC<EtaIconProps> = ({ className = '', size = 28 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M21 12a9 9 0 1 0 -9.968 8.948" />
        <path d="M12 7v5l3 3" />
        <path d="M16 22l5 -5" />
        <path d="M21 21.5v-4.5h-4.5" />
    </svg>
);

export default EtaIcon;