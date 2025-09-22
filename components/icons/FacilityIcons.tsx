import React from 'react';

export const BuildingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <line x1="3" y1="21" x2="21" y2="21" />
        <line x1="9" y1="8" x2="10" y2="8" />
        <line x1="9" y1="12" x2="10" y2="12" />
        <line x1="9" y1="16" x2="10" y2="16" />
        <line x1="14" y1="8" x2="15" y2="8" />
        <line x1="14" y1="12" x2="15" y2="12" />
        <line x1="14" y1="16" x2="15" y2="16" />
        <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />
    </svg>
);

export const WaterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 3v12a5 5 0 0 1 -5 5a5 5 0 0 1 -5 -5c0 -1.667 .833 -3.167 2.5 -4" />
        <path d="M12 3v12a5 5 0 0 0 5 5a5 5 0 0 0 5 -5c0 -1.667 -.833 -3.167 -2.5 -4" />
    </svg>
);

export const RestroomIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M11 4a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M8 21v-1a3 3 0 0 1 3 -3h2" />
        <path d="M16 21v-7a2 2 0 0 0 -2 -2h-2a2 2 0 0 0 -1.783 1.032" />
        <path d="M13 8v5" />
    </svg>
);

export const ParkingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 16v-8h4a2 2 0 0 1 0 4h-4" />
    </svg>
);

export const WaitingRoomIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M6.5 10h11" />
        <path d="M6.5 14h11" />
        <path d="M6.5 18h11" />
        <path d="M7 10v-3.5a2.5 2.5 0 1 1 5 0v3.5" />
        <path d="M17 10v-3.5a2.5 2.5 0 1 0 -5 0v3.5" />
    </svg>
);

export const FoodIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 19h18" />
        <path d="M3 11h18a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
        <path d="M12 4v7" />
        <path d="M6 4v7" />
        <path d="M18 4v7" />
    </svg>
);

export const ShopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 21l1.65 -13.69a1 1 0 0 1 1 -.91h12.7a1 1 0 0 1 1 .91l1.65 13.69" />
        <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
        <path d="M12 11l-2 -3l4 0l-2 3" />
    </svg>
);