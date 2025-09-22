import React from 'react';
import { TrackedLocation } from '../../screens/HomeScreen';
import { Theme } from '../../App';
import { Language } from '../../translations';
import { useTranslations } from '../../hooks/useTranslations';
import EtaIcon from '../icons/EtaIcon';
import NeonButton from '../NeonButton';
import { useToast } from '../../hooks/useToast';
import ClockIcon from '../icons/ClockIcon';
import CrowdIcon from '../icons/CrowdIcon';

interface TrackedBusDetailsProps {
    trackedLocation: TrackedLocation;
    onStopTracking: () => void;
    theme: Theme;
    language: Language;
}

const TrackedBusDetails: React.FC<TrackedBusDetailsProps> = ({ trackedLocation, onStopTracking, theme, language }) => {
    const { t } = useTranslations(language);
    const { addToast } = useToast();

    const statusText = trackedLocation.status === 'delayed' ? t('delayed') : t('onTime');
    const isSpecialRoute = trackedLocation.name.includes('102');

    const handleReportDelay = () => {
        console.log(`[Community Report] Delay reported for bus: ${trackedLocation.name}`);
        addToast(t('delayReportedSuccess'), 'success');
    };

    const handleReportCrowd = () => {
        console.log(`[Community Report] Crowd reported for bus: ${trackedLocation.name}`);
        addToast(t('crowdReportedSuccess'), 'success');
    };

    return (
        <div className="p-6 animate-[slide-in-right_0.3s_ease-out] h-full overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex-grow">
                {/* Driver Alert with animation */}
                {trackedLocation.alert && (
                    <div className="p-4 mb-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-800 dark:text-yellow-200 animate-[fade-in-down_0.5s_ease-out]">
                        <p className="font-bold text-sm">{t('driverAlert')}</p>
                        <p className="text-sm mt-1">{trackedLocation.alert.split(': ')[1]}</p>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 dark:from-orange-400 dark:to-green-400">{trackedLocation.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('status')}: 
                            <span className={`font-semibold px-2 py-0.5 rounded-full ml-1.5 ${trackedLocation.status === 'delayed' ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'bg-green-500/20 text-green-600 dark:text-green-400'}`}>
                              {statusText}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Stops List */}
                {trackedLocation.type === 'route' && trackedLocation.stops && trackedLocation.stops.length > 0 && (
                    <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-white my-2">{t('upcomingStops')}</h4>
                        <ul className="space-y-2">
                            {trackedLocation.stops.map((stop, index) => (
                                <li key={index} className="flex items-center justify-between text-sm p-3 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
                                    <span className="font-medium truncate pr-2">{stop.name}</span>
                                    <span className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">
                                        <EtaIcon size={16} className="opacity-70" />
                                        {stop.etaMinutes} {t('min')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Community Reporting - Enhanced Layout */}
                <div className="mt-6 p-4 rounded-xl bg-gray-500/10 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-white mb-3">{t('reportIssue')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={handleReportDelay} 
                            className="flex flex-col items-center justify-center gap-2 p-3 text-center rounded-lg bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 hover:bg-orange-500/20 dark:hover:bg-orange-500/30 transition-all transform hover:scale-105"
                        >
                            <ClockIcon className="w-6 h-6" />
                            <span className="text-xs font-semibold">{t('reportDelay')}</span>
                        </button>
                        <button 
                            onClick={handleReportCrowd} 
                            className="flex flex-col items-center justify-center gap-2 p-3 text-center rounded-lg bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 hover:bg-sky-500/20 dark:hover:bg-sky-500/30 transition-all transform hover:scale-105"
                        >
                            <CrowdIcon className="w-6 h-6" />
                            <span className="text-xs font-semibold">{t('reportCrowd')}</span>
                        </button>
                    </div>
                </div>

                {/* Special Info Box for Route 102 */}
                {isSpecialRoute && (
                    <div className="mt-6 p-4 rounded-xl bg-blue-900/10 dark:bg-sky-500/10 border border-blue-900/20 dark:border-sky-500/20">
                         <h4 className="font-bold text-sm text-blue-900 dark:text-sky-300 mb-2">{t('specialService')}</h4>
                         <p className="text-xs text-blue-800 dark:text-sky-400">{t('specialServiceDescription')}</p>
                    </div>
                )}
            </div>
            {/* Stop Tracking Button */}
            <div className="mt-6">
                <NeonButton onClick={onStopTracking} theme={theme}>
                    {t('stopTracking')}
                </NeonButton>
            </div>
        </div>
    );
};

export default TrackedBusDetails;