import React from 'react';
import HomeIcon from '../icons/HomeIcon';
import { Theme, User } from '../../App';
import LogoIcon from '../icons/LogoIcon';
import ThemeToggle from '../ThemeToggle';
import { Language } from '../../translations';
import { useTranslations } from '../../hooks/useTranslations';
import ProfileDropdown from './ProfileDropdown';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
    user: User;
    onSignOut: () => void;
    theme: Theme;
    toggleTheme: () => void;
    onGoHome: () => void;
    onOpenProfile: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onSignOut, theme, toggleTheme, onGoHome, onOpenProfile, language, setLanguage }) => {
    const { t } = useTranslations(language);
    
    return (
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 md:p-4 glassmorphic shadow-md shadow-gray-400/20 dark:shadow-black/50 transition-colors duration-500">
            <LogoIcon theme={theme} />
            <div className="flex items-center gap-1 md:gap-2">
                 <LanguageSwitcher
                    currentLanguage={language}
                    onChangeLanguage={setLanguage}
                 />
                 <div className="flex items-center justify-center px-1">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                 </div>
                 <button onClick={onGoHome} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label="Go to home screen">
                     <HomeIcon />
                 </button>
                 <ProfileDropdown user={user} onSignOut={onSignOut} onOpenProfile={onOpenProfile} language={language} />
            </div>
        </header>
    );
};

export default Navbar;