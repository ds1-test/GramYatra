import React, { useState } from 'react';
import { User, Theme } from '../App';
import { Language } from '../translations';
import { useTranslations } from '../hooks/useTranslations';
import * as api from '../services/api';
import NeonInput from '../components/NeonInput';
import NeonButton from '../components/NeonButton';
import { useToast } from '../hooks/useToast';
import XIcon from '../components/icons/XIcon';

interface ProfileScreenProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  theme: Theme;
  language: Language;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onClose, onUpdateUser, theme, language }) => {
  const { t } = useTranslations(language);
  const { addToast } = useToast();
  const [newUsername, setNewUsername] = useState(user.username);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveChanges = async () => {
    if (newUsername === user.username) {
        onClose();
        return;
    }
    setError(null);
    setIsLoading(true);
    try {
        const { success, updatedUser } = await api.updateUsername(user, newUsername);
        if (success) {
            onUpdateUser(updatedUser);
            addToast(t('profileUpdatedSuccess'), 'success');
            onClose();
        }
    } catch (err: any) {
        setError(err.message || t('unexpectedError'));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-[fade-in-down_0.3s_ease-out]"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-dialog-title"
    >
        <div 
            className="relative w-full max-w-md m-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <div
                className="p-1 rounded-3xl bg-gradient-to-r from-orange-500 via-green-500 to-orange-500 animate-[shimmer-border_5s_ease-in-out_infinite]"
                style={{ backgroundSize: '200% 200%' }}
            >
                <div className="w-full bg-white/80 dark:bg-black/60 backdrop-blur-2xl rounded-[1.4rem] p-6 sm:p-8 md:p-10 shadow-2xl shadow-gray-400/50 dark:shadow-black/50">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-black/10 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-8">
                        <h1 id="profile-dialog-title" className="text-3xl md:text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 dark:from-orange-400 dark:to-green-400">
                            {t('myProfile')}
                        </h1>
                        <p className="text-gray-500 dark:text-[#8A8D91] mt-2">
                            {t('editProfile')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <NeonInput
                            id="username"
                            label={t('username')}
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            theme={theme}
                            language={language}
                        />
                         <NeonInput
                            id="email"
                            label={t('emailAddress')}
                            value={user.identifier}
                            theme={theme}
                            language={language}
                            disabled
                        />

                        {error && <p className="text-xs text-center text-red-500 dark:text-red-400 transition-opacity duration-300">{error}</p>}

                        <div className="mt-4">
                            <NeonButton
                                onClick={handleSaveChanges}
                                isLoading={isLoading}
                                theme={theme}
                            >
                                {t('saveChanges')}
                            </NeonButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfileScreen;
