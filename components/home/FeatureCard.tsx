import React from 'react';
import { Theme } from '../../App';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    theme: Theme;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, onClick, theme }) => {
    return (
        <div 
            className={`
                group p-px rounded-2xl bg-gradient-to-br  
                transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 active:scale-95 cursor-pointer
                shadow-lg 
                ${theme === 'dark' 
                    ? 'from-white/20 via-white/10 to-transparent shadow-black/40 hover:shadow-[0_0_35px_-8px_rgba(56,189,109,0.5)]'
                    : 'from-gray-400/50 via-gray-300/30 to-transparent shadow-gray-400/40 hover:shadow-xl hover:shadow-orange-500/20'
                }
            `}
            onClick={onClick}
        >
            <div className="bg-white/70 dark:bg-black/70 backdrop-blur-xl rounded-[15px] p-4 flex flex-col items-center justify-center gap-3 aspect-square transition-colors duration-300 group-hover:bg-white/50 dark:group-hover:bg-black/50">
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-green-500/20 dark:from-orange-500/20 dark:to-green-500/20 rounded-full text-orange-600 dark:text-orange-400 transition-all duration-300 group-hover:from-orange-500/30 group-hover:to-green-500/30 dark:group-hover:from-orange-500/30 dark:group-hover:to-green-500/30 group-hover:scale-110">
                    {icon}
                </div>
                <h2 className="text-sm font-semibold text-gray-800 dark:text-white text-center transition-colors duration-300 group-hover:text-orange-700 dark:group-hover:text-green-200">{title}</h2>
            </div>
        </div>
    );
};

export default FeatureCard;