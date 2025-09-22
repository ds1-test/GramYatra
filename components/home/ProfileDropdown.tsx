import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../App';
import { Language } from '../../translations';
import { useTranslations } from '../../hooks/useTranslations';
import PhoneIcon from '../icons/PhoneIcon';
import SignOutIcon from '../icons/SignOutIcon';
import ProfileIcon from '../icons/ProfileIcon';

interface ProfileDropdownProps {
  user: User;
  onSignOut: () => void;
  onOpenProfile: () => void;
  language: Language;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onSignOut, onOpenProfile, language }) => {
  const { t } = useTranslations(language);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const userInitial = user.username ? user.username.charAt(0).toUpperCase() : '?';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenProfile = () => {
    onOpenProfile();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-500 to-green-500 text-white font-bold text-lg rounded-full shadow-md hover:opacity-90 transition-opacity"
        aria-label={t('profile')}
      >
        {userInitial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-2 z-50 animate-[fade-in-down_0.2s_ease-out]">
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold truncate text-gray-800 dark:text-white">{user.username}</p>
            <p className="text-xs truncate text-gray-500 dark:text-gray-400">{user.identifier}</p>
          </div>
          <div className="py-1">
             <button
              onClick={handleOpenProfile}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <ProfileIcon className="w-5 h-5 text-gray-500" />
              <span>{t('myProfile')}</span>
            </button>
            <a
              href="tel:1800-123-4567"
              className="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-gray-500" />
                <span>{t('helpline')}</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-white">
                1800-123-4567
              </span>
            </a>
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-md transition-colors"
            >
              <SignOutIcon className="w-5 h-5" />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;