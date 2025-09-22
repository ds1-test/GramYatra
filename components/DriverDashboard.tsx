import React, { useState, useCallback } from 'react';
import NeonButton from './NeonButton';
import GpsIcon from './icons/GpsIcon';
import { User, Theme } from '../App';
import { Language } from '../translations';
import { useTranslations } from '../hooks/useTranslations';
import NeonInput from './NeonInput';
import * as api from '../services/api';
import { useToast } from '../hooks/useToast';

type GpsStatus = 'idle' | 'enabling' | 'active' | 'error';

interface DriverDashboardProps {
  user: User;
  onSignOut: () => void;
  theme: Theme;
  language: Language;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, onSignOut, theme, language }) => {
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const { t } = useTranslations(language);
  const { addToast } = useToast();

  // In a real app, this would come from the driver's session data.
  const DRIVER_BUS_NUMBER = '102';

  const handleGpsToggle = useCallback(() => {
    if (gpsStatus === 'active') {
      setGpsStatus('idle');
      setLocation(null);
      setErrorMsg(null);
      return;
    }
    
    setGpsStatus('enabling');
    setErrorMsg(null);
    setLocation(null);

    // --- MOCK GPS FOR DEMO ---
    // Simulate successful GPS activation to bypass browser permissions for the presentation.
    // The location is set to Bengaluru.
    setTimeout(() => {
      const mockCoords: GeolocationCoordinates = {
        latitude: 12.9767, // Majestic Circle, Bengaluru
        longitude: 77.5713,
        accuracy: 20,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      };

      setGpsStatus('active');
      setLocation(mockCoords);
    }, 1500); // Simulate a 1.5 second delay for enabling GPS
  }, [gpsStatus]);

  const getGpsButtonText = () => {
    switch (gpsStatus) {
      case 'enabling': return t('gpsEnabling');
      case 'active': return t('gpsActive');
      case 'error': return t('gpsError');
      default: return t('gpsEnable');
    }
  };

  const handleSendAlert = async () => {
    if (!alertMessage.trim()) {
      addToast(t('alertRequired'), 'error');
      return;
    }
    setIsSendingAlert(true);
    try {
      await api.sendDriverAlert(DRIVER_BUS_NUMBER, alertMessage);
      addToast(t('alertSentSuccess'), 'success');
      setAlertMessage('');
    } catch (err: any) {
      addToast(err.message || t('unexpectedError'), 'error');
    } finally {
      setIsSendingAlert(false);
    }
  };

  return (
    <div
      className="p-1 rounded-3xl bg-gradient-to-r from-orange-500 via-green-500 to-orange-500 animate-[shimmer-border_5s_ease-in-out_infinite] w-full max-w-md"
      style={{ backgroundSize: '200% 200%' }}
    >
      <div className="w-full bg-white/80 dark:bg-black/60 backdrop-blur-2xl rounded-[1.4rem] p-8 md:p-12 shadow-2xl shadow-gray-400/50 dark:shadow-black/50 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 dark:from-orange-400 dark:to-green-400 mb-2 text-center">
          {t('driverDashboardTitle')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-[#8A8D91] mb-8">{t('welcomeUser')} <span className="font-bold text-gray-800 dark:text-white/90">{user.username}</span>!</p>

        <div className="w-full flex flex-col gap-6 border-y border-black/10 dark:border-white/10 py-8">
            {/* GPS Section */}
            <div className="w-full flex flex-col items-center">
                <NeonButton 
                    onClick={handleGpsToggle} 
                    className="w-full font-bold text-lg py-3 relative overflow-hidden animate-[pulse-scale_2.5s_ease-in-out_infinite]"
                    theme={theme}
                >
                    <div className="flex items-center justify-center gap-3">
                    <GpsIcon status={gpsStatus} />
                    <span>{getGpsButtonText()}</span>
                    </div>
                </NeonButton>
                {gpsStatus === 'enabling' && <p className="text-sm text-teal-500 dark:text-teal-300 animate-pulse mt-2">Requesting location...</p>}
                {gpsStatus === 'active' && location && <p className="text-sm text-green-600 dark:text-green-400 mt-2">Location acquired successfully.</p>}
                {gpsStatus === 'error' && errorMsg && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errorMsg}</p>}
            </div>

            <hr className="w-full border-t border-black/10 dark:border-white/10" />
            
            {/* Alert Section */}
            <div className="w-full">
                <h2 className="text-lg font-bold text-center mb-4 text-gray-800 dark:text-white/90">{t('sendAlertTitle')}</h2>
                <div className="flex flex-col gap-4">
                    <NeonInput
                        id="alert-message"
                        label={t('alertMessagePlaceholder')}
                        value={alertMessage}
                        onChange={(e) => setAlertMessage(e.target.value)}
                        theme={theme}
                        language={language}
                        type="text"
                        disabled={isSendingAlert}
                    />
                    <NeonButton
                        onClick={handleSendAlert}
                        isLoading={isSendingAlert}
                        theme={theme}
                    >
                        {t('sendAlertButton')}
                    </NeonButton>
                </div>
            </div>
        </div>

        <div className="w-full mt-8">
            <NeonButton onClick={onSignOut} className="w-full" theme={theme}>
                {t('signOut')}
            </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;