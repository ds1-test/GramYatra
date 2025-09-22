import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';
import { Theme } from '../App';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  theme: Theme; // Keep theme prop for API consistency
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  className = '',
  isLoading = false,
  disabled = false,
}) => {
  const isDisabled = isLoading || disabled;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full px-6 py-2 rounded-xl text-white font-semibold tracking-wider
        bg-gradient-to-r from-orange-500 to-green-500
        transition-all duration-300 ease-in-out
        disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-lg disabled:hover:scale-100 disabled:hover:-translate-y-0
        hover:from-orange-600 hover:to-green-600
        transform hover:scale-105 hover:-translate-y-1 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-gray-900
        shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-green-500/30
        dark:shadow-lg dark:shadow-orange-500/20 dark:hover:shadow-xl dark:hover:shadow-green-400/30
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <SpinnerIcon />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default NeonButton;