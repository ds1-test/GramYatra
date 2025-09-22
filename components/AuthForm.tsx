import React, { useState } from 'react';
import NeonInput from './NeonInput';
import { User, Theme } from '../App';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import * as api from '../services/api';
import GoogleIcon from './icons/GoogleIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import { Language } from '../translations';
import { useTranslations } from '../hooks/useTranslations';

interface AuthFormProps {
  mode: 'user' | 'driver';
  onSignInSuccess: (userData: User) => void;
  onBack: () => void;
  theme: Theme;
  language: Language;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSignInSuccess, onBack, theme, language }) => {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations(language);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      // In a real OAuth flow, this would trigger a popup and token exchange.
      // Here, we simulate it using the provided identifier.
      const { user } = await api.signInWithGoogle(identifier);
      onSignInSuccess(user);
    } catch (err: any) {
      const errorMessage = err.message || t('unexpectedError');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const title = mode === 'driver' ? t('driverSignInTitle') : t('userSignInTitle');
  const isDark = theme === 'dark';

  return (
    <div className="relative w-full max-w-md animate-float">
      <button 
        onClick={onBack} 
        disabled={isLoading} 
        className="absolute -top-4 -left-4 md:-left-12 text-gray-500 dark:text-[#8A8D91] hover:text-gray-800 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50 z-20"
        aria-label={t('goBack')}
      >
        <ArrowLeftIcon />
      </button>
      <div
        className="p-1 rounded-3xl bg-gradient-to-r from-orange-500 via-green-500 to-orange-500 animate-[shimmer-border_5s_ease-in-out_infinite]"
        style={{ backgroundSize: '200% 200%' }}
      >
        <div className="w-full bg-white/80 dark:bg-black/60 backdrop-blur-2xl rounded-[1.4rem] p-6 sm:p-8 md:p-12 shadow-2xl shadow-gray-400/50 dark:shadow-black/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 dark:from-orange-400 dark:to-green-400">
              {title}
            </h1>
            <p className="text-gray-500 dark:text-[#8A8D91] mt-2">
              {t('signInSubtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <NeonInput 
              id="identifier" 
              type="email" 
              label={t('emailLabel')}
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              theme={theme} 
              // FIX: Added missing 'language' prop to satisfy NeonInputProps.
              language={language}
            />
            
            {error && <p className="text-xs text-center text-red-500 dark:text-red-400 transition-opacity duration-300">{error}</p>}

            <div className="mt-4">
               <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className={`
                    w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold tracking-wider transition-all duration-300
                    border-2
                    ${isDark 
                      ? 'bg-[#0B0D10] text-white border-white/20 hover:bg-white/5 disabled:bg-white/5 shadow-md shadow-black/50 hover:shadow-lg hover:shadow-white/10'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 disabled:bg-gray-100 shadow-lg hover:shadow-xl'
                    }
                    disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 hover:-translate-y-1 active:scale-95 disabled:hover:translate-y-0
                  `}
                >
                  {isLoading ? <SpinnerIcon /> : <GoogleIcon />}
                  <span>{t('continueWithGoogle')}</span>
                </button>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-[#8A8D91] mt-2">
              {t('termsAgreement')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;