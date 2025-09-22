import React from 'react';
import { Theme } from '../../App';

interface LogoIconProps {
  theme: Theme; // The theme prop is kept for API consistency, though the new logo is theme-agnostic.
  className?: string;
  size?: number;
  showText?: boolean;
}

const LogoIcon: React.FC<LogoIconProps> = ({ theme, className, size = 36, showText = true }) => {
    return (
        <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logo-main-gradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#0EA5E9"/>
                        <stop offset="0.5" stopColor="#22C55E"/>
                        <stop offset="1" stopColor="#FACC15"/>
                    </linearGradient>
                    <linearGradient id="logo-highlight" x1="15" y1="5" x2="85" y2="50" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0.6"/>
                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="orbital-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22C55E" />
                        <stop offset="100%" stopColor="#FACC15" />
                    </linearGradient>
                    <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#22C55E" floodOpacity="0.3"/>
                    </filter>
                </defs>

                <g filter="url(#logo-shadow)">
                    {/* Orbital Ring for movement and connectivity */}
                    <path d="M 10,50 a 40,20 0 1,0 80,0 a 40,20 0 1,0 -80,0" stroke="url(#orbital-gradient)" strokeWidth="5" strokeLinecap="round" transform="rotate(-15 50 50)"/>

                    {/* Main bus body shaped like a location pin */}
                    <path d="M50 95C69.8528 87.5 85 68.1929 85 45C85 21.8071 69.8528 5 50 5C30.1472 5 15 21.8071 15 45C15 68.1929 30.1472 87.5 50 95Z" fill="url(#logo-main-gradient)"/>
                    
                    {/* Inner Bevel for 3D/Glass effect */}
                    <path d="M50 92C68 85 82 67 82 45C82 23 68 8 50 8C32 8 18 23 18 45C18 67 32 85 50 92Z" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
                    
                    {/* Wheels */}
                    <circle cx="35" cy="78" r="8" fill="#1E293B" stroke="#F8FAFC" strokeWidth="1.5"/>
                    <circle cx="65" cy="78" r="8" fill="#1E293B" stroke="#F8FAFC" strokeWidth="1.5"/>
                    <circle cx="35" cy="78" r="3" fill="#475569"/>
                    <circle cx="65" cy="78" r="3" fill="#475569"/>

                    {/* Stylized Bus Icon instead of windshield */}
                    <path d="M36 42.5 v-11 a4 4 0 0 1 4 -4 h12 a8 8 0 0 1 8 8 v7 h-2 a2 2 0 1 1 0 -4 h-1 a1 1 0 0 0 -1 1 v3 h-18 v-1 a1 1 0 0 0 -1 -1 h-1 a2 2 0 1 1 0 4 h-2 Z" fill="white" fillOpacity="0.9" />

                    {/* Highlight for glassmorphism/3D effect */}
                    <path d="M 25 45 C 30 25, 70 25, 75 45 C 70 48, 30 48, 25 45" fill="url(#logo-highlight)" style={{ mixBlendMode: 'overlay' }}/>
                </g>
            </svg>
             {showText && (
                <h1 className="hidden md:block text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-green-500 to-yellow-400">
                    GramYatra
                </h1>
            )}
        </div>
    );
};
export default LogoIcon;