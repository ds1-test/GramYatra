import React from 'react';
import { Theme } from '../App';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative inline-flex items-center h-8 w-14 rounded-full 
        transition-colors duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${isDark 
          ? 'bg-gray-700 focus:ring-green-500 focus:ring-offset-gray-800' 
          : 'bg-gray-200 focus:ring-orange-500 focus:ring-offset-white'
        }
      `}
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Background icons */}
      <span className="absolute left-2 transition-opacity duration-300">
        <SunIcon className={`w-4 h-4 ${isDark ? 'text-gray-400 opacity-50' : 'text-yellow-500 opacity-100'}`} />
      </span>
      <span className="absolute right-2 transition-opacity duration-300">
        <MoonIcon className={`w-4 h-4 ${isDark ? 'text-yellow-300 opacity-100' : 'text-gray-400 opacity-50'}`} />
      </span>

      {/* Switch handle */}
      <span
        className={`
          absolute inline-block w-6 h-6 transform
          rounded-full bg-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${isDark ? 'translate-x-7' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default ThemeToggle;
