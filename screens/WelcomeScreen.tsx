import React from 'react';
import NeonButton from '../components/NeonButton';
import LogoIcon from '../components/icons/LogoIcon';
import ThemeToggle from '../components/ThemeToggle';
import { Theme } from '../App';
import { Language } from '../translations';
import { useTranslations } from '../hooks/useTranslations';
import LanguageSwitcher from '../components/home/LanguageSwitcher';

interface WelcomeScreenProps {
    onSelectRole: (role: 'user' | 'driver') => void;
    theme: Theme;
    toggleTheme: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectRole, theme, toggleTheme, language, setLanguage }) => {
    const { t } = useTranslations(language);
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-4 pb-48 sm:pb-40 overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1 md:gap-2 z-20">
                <LanguageSwitcher
                    currentLanguage={language}
                    onChangeLanguage={setLanguage}
                />
                <div className="flex items-center justify-center">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
            </div>
            <div className="text-center relative z-10">
                <div className="mb-4 inline-block">
                    <LogoIcon theme={theme} size={80} showText={false} />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 dark:from-orange-400 dark:to-green-400">
                    {t('welcomeTitle')}
                </h1>
                <p className="text-gray-500 dark:text-[#8A8D91] mt-2 text-lg">{t('welcomeSubtitle')}</p>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 z-10 pointer-events-none">
                <div className="max-w-sm mx-auto pointer-events-auto">
                    <div className="glassmorphic shadow-xl shadow-gray-400/40 dark:shadow-2xl dark:shadow-green-500/10 rounded-2xl p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <NeonButton onClick={() => onSelectRole('user')} theme={theme} className="py-3 text-lg">
                                {t('iAmAUser')}
                            </NeonButton>
                            <NeonButton onClick={() => onSelectRole('driver')} theme={theme} className="py-3 text-lg">
                                {t('iAmADriver')}
                            </NeonButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;