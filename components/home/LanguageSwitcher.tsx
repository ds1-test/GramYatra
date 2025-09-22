import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../../translations';
import { useTranslations } from '../../hooks/useTranslations';
import UKFlagIcon from '../icons/flags/UKFlagIcon';
import IndiaFlagIcon from '../icons/flags/IndiaFlagIcon';
import LanguageIcon from '../icons/LanguageIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onChangeLanguage: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onChangeLanguage }) => {
  const { t } = useTranslations(currentLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; flag: React.ReactNode }[] = [
    { code: 'en', name: 'English', flag: <UKFlagIcon /> },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: <IndiaFlagIcon /> },
    { code: 'hi', name: 'हिन्दी', flag: <IndiaFlagIcon /> },
    { code: 'ta', name: 'தமிழ்', flag: <IndiaFlagIcon /> },
    { code: 'te', name: 'తెలుగు', flag: <IndiaFlagIcon /> },
    { code: 'ml', name: 'മലയാളം', flag: <IndiaFlagIcon /> },
  ];

  const selectedLanguage = languages.find(l => l.code === currentLanguage) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langCode: Language) => {
    onChangeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-2 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
        aria-label={t('selectLanguage')}
      >
        {selectedLanguage.flag}
        <span className="hidden sm:inline text-sm font-semibold">{selectedLanguage.code.toUpperCase()}</span>
        <ArrowDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-2 z-50 animate-[fade-in-down_0.2s_ease-out]">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-3 p-2 rounded-md text-left text-sm transition-colors ${
                currentLanguage === lang.code
                  ? 'bg-orange-500/10 dark:bg-green-500/20 text-orange-700 dark:text-green-200 font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {lang.flag}
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;