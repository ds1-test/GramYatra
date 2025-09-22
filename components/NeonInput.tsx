import React, { useState } from 'react';
import { Theme } from '../App';
import EyeIcon from './icons/EyeIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import { useTranslations } from '../hooks/useTranslations';
import { Language } from '../translations';

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  theme: Theme;
  language: Language;
  type?: string;
  showVoiceSearch?: boolean;
  isListening?: boolean;
  onVoiceSearchClick?: () => void;
}

const NeonInput: React.FC<NeonInputProps> = ({ 
  id, 
  label, 
  theme, 
  language,
  type = 'text', 
  value, 
  showVoiceSearch = false,
  isListening = false,
  onVoiceSearchClick,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasValue = value ? String(value).length > 0 : false;
  const isDark = theme === 'dark';
  const { t } = useTranslations(language);

  const finalType = type === 'password' && isPasswordVisible ? 'text' : type;

  const handleToggleVisibility = () => {
    if (type === 'password') {
      setIsPasswordVisible(prev => !prev);
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        type={finalType}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          peer w-full px-4 py-3 text-base bg-transparent rounded-xl
          border-2 outline-none transition-colors duration-300
          ${isDark
            ? 'text-white border-white/20 focus:border-green-400'
            : 'text-gray-800 border-gray-300 focus:border-orange-500'
          }
          ${showVoiceSearch || type === 'password' ? 'pr-12' : ''}
        `}
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 transition-all duration-300 ease-out pointer-events-none
          ${isFocused || hasValue
            ? 'top-[-0.6rem] text-xs px-1'
            : 'top-3 text-base'
          }
          ${isDark
            ? `bg-black/60 ${isFocused ? 'text-green-400' : 'text-gray-400'}`
            : `bg-white/80 ${isFocused ? 'text-orange-500' : 'text-gray-500'}`
          }
        `}
      >
        {label}
      </label>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {type === 'password' && (
          <button
            type="button"
            onClick={handleToggleVisibility}
            className="p-1 rounded-full text-gray-500 hover:bg-black/10 dark:hover:bg-white/10"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            <EyeIcon isVisible={isPasswordVisible} className="w-5 h-5" />
          </button>
        )}
        {showVoiceSearch && onVoiceSearchClick && (
          <button
            type="button"
            onClick={onVoiceSearchClick}
            className={`p-1 rounded-full text-gray-500 transition-colors ${isListening ? 'text-orange-500 dark:text-green-400' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}
            aria-label={t('voiceSearch')}
          >
            <MicrophoneIcon isListening={isListening} className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NeonInput;