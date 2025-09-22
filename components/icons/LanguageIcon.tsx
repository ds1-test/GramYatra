import React from 'react';
import { Language } from '../../translations';

interface LanguageIconProps {
  language: Language;
  className?: string;
}

const LanguageIcon: React.FC<LanguageIconProps> = ({ language, className = '' }) => (
  <div className={`flex items-center justify-center w-6 h-6 font-bold text-sm ${className}`}>
    {language === 'en' ? 'EN' : 'ಕ'}
  </div>
);

export default LanguageIcon;
