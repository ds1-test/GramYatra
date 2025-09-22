import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrackedLocation } from '../../screens/HomeScreen';
import { Theme } from '../../App';
import { Language } from '../../translations';
import { useTranslations } from '../../hooks/useTranslations';
import * as api from '../../services/api';
import { GoogleGenAI, Type, Chat } from '@google/genai';

import FeatureCard from './FeatureCard';
import NeonButton from '../NeonButton';
import NeonInput from '../NeonInput';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import BusIcon from '../icons/BusIcon';
import JourneyPlannerIcon from '../icons/JourneyPlannerIcon';
import TimetableIcon from '../icons/TimetableIcon';
import FareCalculatorIcon from '../icons/FareCalculatorIcon';
import FacilitiesIcon from '../icons/FacilitiesIcon';
import FeedbackIcon from '../icons/FeedbackIcon';
import ChatIcon from '../icons/ChatIcon';
import UserGuideIcon from '../icons/UserGuideIcon';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';
import { useToast } from '../../hooks/useToast';
import SpinnerIcon from '../icons/SpinnerIcon';
import BusSimpleIcon from '../icons/BusSimpleIcon';
import BusExpressIcon from '../icons/BusExpressIcon';
import BusAcIcon from '../icons/BusAcIcon';
import { BuildingIcon, FoodIcon, ParkingIcon, RestroomIcon, ShopIcon, WaitingRoomIcon, WaterIcon } from '../icons/FacilityIcons';
import TicketIcon from '../icons/TicketIcon';
import InfoIcon from '../icons/InfoIcon';
import SendIcon from '../icons/SendIcon';
import LogoIcon from '../icons/LogoIcon';
import UserIcon from '../icons/UserIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import EtaIcon from '../icons/EtaIcon';
import LostFoundIcon from '../icons/LostFoundIcon';
import TrackedBusDetails from './TrackedBusDetails';


type PanelView = 'main' | 'track' | 'plan' | 'timetable' | 'fare' | 'facilities' | 'feedback' | 'chat' | 'guide' | 'eta' | 'lostAndFound';

interface SidePanelProps {
    setTrackedLocation: (location: TrackedLocation | null) => void;
    trackedLocation: TrackedLocation | null;
    theme: Theme;
    language: Language;
}

const ViewWrapper: React.FC<{title: string; onBack: () => void; children: React.ReactNode; language: Language}> = ({ title, onBack, children, language }) => {
    const { t } = useTranslations(language);
    return (
        <div className="p-6 animate-[slide-in-right_0.3s_ease-out]">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label={t('goBack')}>
                    <ArrowLeftIcon />
                </button>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
            </div>
            {children}
        </div>
    );
};

const TrackBusViewInternal: React.FC<{ onBack: () => void; setTrackedLocation: (location: TrackedLocation | null) => void; theme: Theme; language: Language; }> = ({ onBack, setTrackedLocation, theme, language }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslations(language);
    const { addToast } = useToast();
    const { transcript, isListening, startListening, hasRecognitionSupport, error: voiceError } = useVoiceRecognition(language);

    useEffect(() => {
        if (transcript) setQuery(transcript);
    }, [transcript]);

    useEffect(() => {
        if (voiceError) {
            if (voiceError === 'no-speech') {
                addToast(t('voiceSearchNoSpeech'), 'warning');
            } else {
                addToast(t('voiceSearchError'), 'error');
            }
        }
    }, [voiceError, addToast, t]);

    const handleTrack = async () => {
        if (!query) {
            setError(t('busRouteNumberRequired'));
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            const { found, location } = await api.trackBusOrRoute(query);
            if (found && location) {
                setTrackedLocation(location);
                if (location.alert) {
                    addToast(location.alert.split(': ')[1], 'warning');
                }
            } else {
                setError(t('busRouteNotFound').replace('{query}', query));
                setTrackedLocation(null);
            }
        } catch (err: any) {
            setError(err.message || t('unexpectedError'));
            setTrackedLocation(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ViewWrapper title={t('trackBusRoute')} onBack={onBack} language={language}>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('trackBusRouteDescription')}</p>
                <NeonInput 
                    id="track-query"
                    label={isListening ? t('listening') : t('enterBusRouteNumber')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    theme={theme}
                    language={language}
                    type="text"
                    showVoiceSearch={hasRecognitionSupport}
                    isListening={isListening}
                    onVoiceSearchClick={startListening}
                />
                {error && <p className="text-xs text-center text-red-500">{error}</p>}
                <NeonButton onClick={handleTrack} isLoading={isLoading} theme={theme}>
                    {t('track')}
                </NeonButton>
            </div>
        </ViewWrapper>
    );
};

const JourneyPlannerViewInternal: React.FC<{ onBack: () => void; theme: Theme; language: Language; }> = ({ onBack, theme, language }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [listeningField, setListeningField] = useState<'origin' | 'destination' | null>(null);
    const { t } = useTranslations(language);
    const { addToast } = useToast();
    const { transcript, isListening, startListening, hasRecognitionSupport, error: voiceError } = useVoiceRecognition(language);

    useEffect(() => {
        if (transcript && listeningField) {
            if (listeningField === 'origin') {
                setOrigin(transcript);
            } else {
                setDestination(transcript);
            }
            setListeningField(null);
        }
    }, [transcript, listeningField]);

    useEffect(() => {
        if (voiceError) {
            if (voiceError === 'no-speech') {
                addToast(t('voiceSearchNoSpeech'), 'warning');
            } else {
                addToast(t('voiceSearchError'), 'error');
            }
            setListeningField(null);
        }
    }, [voiceError, addToast, t]);

    const handlePlan = async () => {
        if (!origin || !destination) {
            setError(t('originDestinationRequired'));
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            const response = await api.planJourney(origin, destination);
            if (response.success) {
                addToast(response.message, 'success');
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.message || t('unexpectedError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceSearch = (field: 'origin' | 'destination') => {
        setListeningField(field);
        startListening();
    };

    return (
        <ViewWrapper title={t('journeyPlanner')} onBack={onBack} language={language}>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('journeyPlannerDescription')}</p>
                <NeonInput 
                    id="origin"
                    label={isListening && listeningField === 'origin' ? t('listening') : t('origin')}
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    theme={theme}
                    language={language}
                    type="text"
                    showVoiceSearch={hasRecognitionSupport}
                    isListening={isListening && listeningField === 'origin'}
                    onVoiceSearchClick={() => handleVoiceSearch('origin')}
                />
                <NeonInput 
                    id="destination"
                    label={isListening && listeningField === 'destination' ? t('listening') : t('destination')}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    theme={theme}
                    language={language}
                    type="text"
                    showVoiceSearch={hasRecognitionSupport}
                    isListening={isListening && listeningField === 'destination'}
                    onVoiceSearchClick={() => handleVoiceSearch('destination')}
                />
                {error && <p className="text-xs text-center text-red-500">{error}</p>}
                <NeonButton onClick={handlePlan} isLoading={isLoading} theme={theme}>
                    {t('planJourney')}
                </NeonButton>
            </div>
        </ViewWrapper>
    );
};

interface FareResult {
  serviceType: string;
  distanceRange: string;
  fareRange: string;
  description: string;
}

const FareCalculatorViewInternal: React.FC<{ onBack: () => void; theme: Theme; language: Language; }> = ({ onBack, theme, language }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<FareResult[] | null>(null);
    const [listeningField, setListeningField] = useState<'origin' | 'destination' | null>(null);
    
    const { t } = useTranslations(language);
    const { addToast } = useToast();
    const { transcript, isListening, startListening, hasRecognitionSupport, error: voiceError } = useVoiceRecognition(language);

    useEffect(() => {
        if (transcript && listeningField) {
            if (listeningField === 'origin') setOrigin(transcript);
            else setDestination(transcript);
            setListeningField(null);
        }
    }, [transcript, listeningField]);

    useEffect(() => {
        if (voiceError) {
            if (voiceError === 'no-speech') addToast(t('voiceSearchNoSpeech'), 'warning');
            else addToast(t('voiceSearchError'), 'error');
            setListeningField(null);
        }
    }, [voiceError, addToast, t]);

    const getServiceIcon = (serviceType: string) => {
        const lowerCaseService = serviceType.toLowerCase();
        if (lowerCaseService.includes('ac') || lowerCaseService.includes('luxury')) {
            return <BusAcIcon className="text-blue-500 dark:text-blue-400" />;
        }
        if (lowerCaseService.includes('express') || lowerCaseService.includes('deluxe')) {
            return <BusExpressIcon className="text-red-500 dark:text-red-400" />;
        }
        return <BusSimpleIcon className="text-gray-600 dark:text-gray-300" />;
    };

    const handleCalculateFare = async () => {
        if (!origin || !destination) {
            setError(t('originDestinationRequired'));
            return;
        }
         if (origin.toLowerCase() === destination.toLowerCase()) {
            setError(t('originDestinationSame'));
            return;
        }

        setError(null);
        setIsLoading(true);
        setResults(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const prompt = `
                Calculate the estimated bus fare in India from "${origin}" to "${destination}".
                Adhere strictly to the following fare structure:
                1. Base Fare: ₹10 (covers the first 2 km).
                2. Per-kilometer rates after the base distance:
                    - Ordinary / City Bus: ₹1.5 per km.
                    - Express / Semi-Deluxe: ₹2.0 per km.
                    - Luxury / AC / Volvo: ₹2.5 per km.

                Generate a JSON array of fare options for these three service types. Your response MUST be a valid JSON array and nothing else.
                For each option, provide:
                - An estimated distance as a range in kilometers (e.g., "15-20 km"). The distance between two places is not exact, so provide a realistic range.
                - A calculated fare as a range in Rupees based on the distance range and the fare structure (e.g., "₹30 - ₹40").
                - A brief, user-friendly, one-sentence description of the service type.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            serviceType: { type: Type.STRING, description: 'Type of bus service (e.g., Ordinary, Express, AC Bus).' },
                            distanceRange: { type: Type.STRING, description: "Estimated distance range in km (e.g., '15-20 km')." },
                            fareRange: { type: Type.STRING, description: "Estimated fare range in Rupees (e.g., '₹30 - ₹40')." },
                            description: { type: Type.STRING, description: 'A short, user-friendly description of the service.' },
                          },
                          required: ["serviceType", "distanceRange", "fareRange", "description"],
                        },
                    },
                }
            });

            const jsonResponse = JSON.parse(response.text);
            setResults(jsonResponse);

        } catch (err: any) {
            console.error("Fare calculation error:", err);
            setError(err.message || t('unexpectedError'));
            addToast(t('fareCalculationError'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceSearch = (field: 'origin' | 'destination') => {
        setListeningField(field);
        startListening();
    };

    return (
        <ViewWrapper title={t('fareCalculator')} onBack={onBack} language={language}>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('fareCalculatorDescription')}</p>
                <NeonInput
                    id="origin-fare"
                    label={isListening && listeningField === 'origin' ? t('listening') : t('origin')}
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    theme={theme} language={language} type="text"
                    showVoiceSearch={hasRecognitionSupport}
                    isListening={isListening && listeningField === 'origin'}
                    onVoiceSearchClick={() => handleVoiceSearch('origin')}
                />
                <NeonInput
                    id="destination-fare"
                    label={isListening && listeningField === 'destination' ? t('listening') : t('destination')}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    theme={theme} language={language} type="text"
                    showVoiceSearch={hasRecognitionSupport}
                    isListening={isListening && listeningField === 'destination'}
                    onVoiceSearchClick={() => handleVoiceSearch('destination')}
                />
                {error && <p className="text-xs text-center text-red-500 dark:text-red-400">{error}</p>}
                <NeonButton onClick={handleCalculateFare} isLoading={isLoading} theme={theme}>
                    {t('calculateFare')}
                </NeonButton>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <SpinnerIcon />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">{t('calculatingFare')}</p>
                </div>
            )}
            
            {results && (
                <div className="mt-6 flex flex-col gap-3 animate-[fade-in-down_0.5s_ease-out]">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-white">{t('estimatedFares')}</h4>
                    {results.map((result, index) => (
                        <div 
                            key={index} 
                            className="p-4 rounded-xl bg-gray-500/10 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-start gap-4"
                        >
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-500/10 dark:bg-white/10 rounded-full">
                                {getServiceIcon(result.serviceType)}
                            </div>
                            <div className="flex-1">
                                <h5 className="font-bold text-gray-900 dark:text-white">{result.serviceType}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{result.description}</p>
                                <div className="text-xs flex items-center gap-4 mt-2 text-gray-500 dark:text-gray-400">
                                    <span><strong>Dist:</strong> {result.distanceRange}</span>
                                    <span className="font-bold text-base text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 dark:from-orange-400 dark:to-green-400">{result.fareRange}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ViewWrapper>
    );
};

// --- START: ETA PREDICTIONS VIEW ---
interface EtaPrediction {
    stopName: string;
    etaMinutes: number;
}
const EtaPredictionsViewInternal: React.FC<{ onBack: () => void; theme: Theme; language: Language; }> = ({ onBack, theme, language }) => {
    const [routeNumber, setRouteNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<EtaPrediction[] | null>(null);
    const { t } = useTranslations(language);
    const { addToast } = useToast();

    const handleFetchEtas = async () => {
        if (!routeNumber) {
            setError(t('busRouteNumberRequired'));
            return;
        }
        setError(null);
        setIsLoading(true);
        setPredictions(null);
        try {
            const { predictions: fetchedPredictions } = await api.getEtaPredictions(routeNumber);
            setPredictions(fetchedPredictions);
        } catch (err: any) {
            console.error("ETA prediction error:", err.message || err);
            const errorMessage = err.message || t('noEtaData').replace('{route}', routeNumber);
            setError(errorMessage);
            addToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ViewWrapper title={t('etaPredictions')} onBack={onBack} language={language}>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('etaPredictionsDescription')}</p>
                <NeonInput
                    id="eta-query"
                    label={t('enterBusRouteNumber')}
                    value={routeNumber}
                    onChange={(e) => setRouteNumber(e.target.value)}
                    theme={theme}
                    language={language}
                />
                {error && <p className="text-xs text-center text-red-500 dark:text-red-400">{error}</p>}
                <NeonButton onClick={handleFetchEtas} isLoading={isLoading} theme={theme}>
                    {t('getEta')}
                </NeonButton>
            </div>
            {isLoading && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <SpinnerIcon />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">{t('fetchingEta')}</p>
                </div>
            )}
            {predictions && (
                <div className="mt-6 flex flex-col gap-1 animate-[fade-in-down_0.5s_ease-out]">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{t('etaResultsForRoute').replace('{route}', routeNumber)}</h4>
                    <div className="space-y-2">
                        {predictions.map((pred, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-gray-500/10 dark:bg-white/5 border border-black/10 dark:border-white/10">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-orange-600 dark:text-green-400">
                                   <EtaIcon size={28} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{pred.stopName}</p>
                                </div>
                                <div className="text-right">
                                     <p className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 dark:from-orange-400 dark:to-green-400">{pred.etaMinutes}</p>
                                     <p className="text-xs text-gray-500 dark:text-gray-400">{t('min')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ViewWrapper>
    );
};
// --- END: ETA PREDICTIONS VIEW ---


interface TimetableEntry {
  stopName: string;
  scheduledTime: string;
}

const TimetableViewInternal: React.FC<{ onBack: () => void; theme: Theme; language: Language; }> = ({ onBack, theme, language }) => {
    const [routeNumber, setRouteNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timetable, setTimetable] = useState<TimetableEntry[] | null>(null);
    const { t } = useTranslations(language);
    const { addToast } = useToast();

    const handleFetchTimetable = async () => {
        if (!routeNumber) {
            setError(t('busRouteNumberRequired'));
            return;
        }
        setError(null);
        setIsLoading(true);
        setTimetable(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
                Generate a sample weekday bus timetable for route number "${routeNumber}" which typically operates in India.
                The response must be a valid JSON array of objects.
                Each object must contain a "stopName" and a "scheduledTime".
                The timetable should represent a single trip from the origin to the destination, with at least 5 stops and a maximum of 10 stops.
                Example format: [{"stopName": "Kengeri", "scheduledTime": "08:00 AM"}, ...].
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            stopName: { type: Type.STRING, description: "The name of the bus stop." },
                            scheduledTime: { type: Type.STRING, description: "The scheduled arrival time at the stop (e.g., '08:00 AM')." },
                          },
                          required: ["stopName", "scheduledTime"],
                        },
                    },
                }
            });

            const jsonResponse = JSON.parse(response.text);
            setTimetable(jsonResponse);

        } catch (err: any) {
            console.error("Timetable generation error:", err);
            setError(err.message || t('unexpectedError'));
            addToast(t('timetableGenerationError'), 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <ViewWrapper title={t('timetables')} onBack={onBack} language={language}>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('timetablesDescription')}</p>
                <NeonInput 
                    id="timetable-query"
                    label={t('enterBusRouteNumber')}
                    value={routeNumber}
                    onChange={(e) => setRouteNumber(e.target.value)}
                    theme={theme}
                    language={language}
                />
                {error && <p className="text-xs text-center text-red-500 dark:text-red-400">{error}</p>}
                <NeonButton onClick={handleFetchTimetable} isLoading={isLoading} theme={theme}>
                    {t('getTimetable')}
                </NeonButton>
            </div>
             {isLoading && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <SpinnerIcon />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">{t('generatingTimetable')}</p>
                </div>
            )}
            {timetable && (
                <div className="mt-6 flex flex-col gap-1 animate-[fade-in-down_0.5s_ease-out]">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{t('sampleTimetableForRoute').replace('{route}', routeNumber)}</h4>
                    <ul className="relative pl-5">
                        {/* Vertical line for the timeline */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 ml-[5px]" />
                        
                        {timetable.map((entry, index) => (
                            <li key={index} className="flex items-center gap-4 py-3 relative">
                                {/* Dot on the timeline */}
                                <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-400 dark:border-gray-500" />
                                
                                <div className="flex-shrink-0 w-20 text-right">
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{entry.scheduledTime}</p>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">{entry.stopName}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </ViewWrapper>
    );
};

interface Facility {
    name: string;
    description: string;
}
const FacilitiesViewInternal: React.FC<{ onBack: () => void; theme: Theme; language: Language; }> = ({ onBack, theme, language }) => {
    const [stationName, setStationName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [facilities, setFacilities] = useState<Facility[] | null>(null);
    const { t } = useTranslations(language);
    const { addToast } = useToast();

    const getFacilityIcon = (facilityName: string) => {
        const name = facilityName.toLowerCase();
        if (name.includes('restroom') || name.includes('toilet')) return <RestroomIcon />;
        if (name.includes('water')) return <WaterIcon />;
        if (name.includes('waiting')) return <WaitingRoomIcon />;
        if (name.includes('food') || name.includes('canteen')) return <FoodIcon />;
        if (name.includes('shop')) return <ShopIcon />;
        if (name.includes('parking')) return <ParkingIcon />;
        if (name.includes('ticket')) return <TicketIcon />;
        if (name.includes('information') || name.includes('help desk')) return <InfoIcon />;
        return <BuildingIcon />;
    };

    const handleFetchFacilities = async () => {
        if (!stationName) {
            setError(t('stationNameRequired'));
            return;
        }
        setError(null);
        setIsLoading(true);
        setFacilities(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `List the typical facilities available at "${stationName}" bus station in India. The response must be a valid JSON array. For each facility, provide a name and a brief, one-sentence description. Include common facilities like restrooms, drinking water, waiting rooms, and food stalls.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING, description: 'The name of the facility (e.g., "Restrooms").' },
                            description: { type: Type.STRING, description: "A brief one-sentence description of the facility." },
                          },
                          required: ["name", "description"],
                        },
                    },
                }
            });
            const jsonResponse = JSON.parse(response.text);
            setFacilities(jsonResponse);

        } catch (err: any) {
            console.error("Facility generation error:", err);
            setError(err.message || t('unexpectedError'));
            addToast(t('facilityGenerationError'), 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <ViewWrapper title={t('stationFacilities')} onBack={onBack} language={language}>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('stationFacilitiesDescription')}</p>
                <NeonInput 
                    id="station-name"
                    label={t('enterStationName')}
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                    theme={theme}
                    language={language}
                />
                {error && <p className="text-xs text-center text-red-500 dark:text-red-400">{error}</p>}
                <NeonButton onClick={handleFetchFacilities} isLoading={isLoading} theme={theme}>
                    {t('findFacilities')}
                </NeonButton>
            </div>
             {isLoading && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <SpinnerIcon />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">{t('findingFacilities')}</p>
                </div>
            )}
            {facilities && (
                <div className="mt-6 animate-[fade-in-down_0.5s_ease-out]">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{t('facilitiesAtStation').replace('{station}', stationName)}</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {facilities.map((facility) => (
                             <div key={facility.name} className="p-4 rounded-xl bg-gray-500/10 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col items-center text-center">
                                <div className="w-12 h-12 flex items-center justify-center text-orange-600 dark:text-green-400 mb-2">
                                    {getFacilityIcon(facility.name)}
                                </div>
                                <h5 className="font-bold text-sm text-gray-900 dark:text-white">{facility.name}</h5>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{facility.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ViewWrapper>
    );
};

const FeedbackViewInternal: React.FC<{ onBack: () => void; theme: Theme; language: Language; }> = ({ onBack, theme, language }) => {
    const [feedbackType, setFeedbackType] = useState('suggestion');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslations(language);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            addToast(t('feedbackMessageRequired'), 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await api.submitFeedback(feedbackType, message);
            addToast(t('feedbackSuccess'), 'success');
            setMessage('');
            setFeedbackType('suggestion');
            onBack();
        } catch (err: any) {
            addToast(err.message || t('unexpectedError'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ViewWrapper title={t('feedbackSupport')} onBack={onBack} language={language}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                 <p className="text-sm text-gray-600 dark:text-gray-400">{t('feedbackDescription')}</p>
                 <div>
                    <label htmlFor="feedback-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('feedbackType')}</label>
                    <select 
                        id="feedback-type" 
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="w-full px-4 py-3 text-base bg-white/80 dark:bg-black/60 rounded-xl border-2 outline-none transition-colors duration-300 text-gray-800 dark:text-white border-gray-300 dark:border-white/20 focus:border-orange-500 dark:focus:border-green-400"
                    >
                        <option value="suggestion">{t('suggestion')}</option>
                        <option value="bug">{t('bugReport')}</option>
                        <option value="compliment">{t('compliment')}</option>
                    </select>
                 </div>
                 <div>
                    <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('message')}</label>
                    <textarea 
                        id="feedback-message"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('feedbackPlaceholder')}
                        className="w-full px-4 py-3 text-base bg-white/80 dark:bg-black/60 rounded-xl border-2 outline-none transition-colors duration-300 text-gray-800 dark:text-white border-gray-300 dark:border-white/20 focus:border-orange-500 dark:focus:border-green-400"
                    />
                 </div>
                 <NeonButton onClick={() => {}} isLoading={isSubmitting} theme={theme}>
                    {t('submitFeedback')}
                 </NeonButton>
            </form>
        </ViewWrapper>
    );
};

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
const ChatMessageBubble: React.FC<{ role: 'user' | 'model', text: string, theme: Theme }> = ({ role, text, theme }) => {
    const isModel = role === 'model';
    return (
        <div className={`flex items-start gap-3 my-4 ${isModel ? 'animate-[fade-in-down_0.3s_ease-out]' : ''} ${isModel ? '' : 'flex-row-reverse'}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isModel ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gradient-to-br from-orange-500 to-green-500'}`}>
                {isModel ? <LogoIcon theme={theme} size={20} showText={false} /> : <UserIcon size={18} className="text-white" />}
            </div>
            <div className={`relative max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-md ${isModel ? 'bg-gray-100 dark:bg-gray-700 rounded-bl-lg' : 'bg-orange-500/90 dark:bg-green-500/90 text-white rounded-br-lg'}`}>
                <p className="text-sm whitespace-pre-wrap">{text}</p>
            </div>
        </div>
    );
};
const ChatViewInternal: React.FC<{ onBack: () => void; theme: Theme; language: Language; }> = ({ onBack, theme, language }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslations(language);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a helpful and friendly assistant for the GramYatra app, a real-time rural bus tracking service in India. Your name is 'Yatra Mitra'. Your goal is to assist users with their queries about the app's features, bus schedules, journey planning, and general information about public transport in India. Be concise and clear in your answers. When asked about bus schedules or real-time data, clarify that you provide *sample* or *estimated* information as you do not have access to live data. You can speak English, and other major Indian languages if the user interacts in them. Keep your answers brief, ideally under 50 words.",
            },
        });
        setChat(newChat);
        setMessages([{ role: 'model', text: t('chatWelcomeMessage') }]);
    }, [t]);

    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading || !chat) return;
        
        const text = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', text }]);
        setIsLoading(true);

        try {
            const result = await chat.sendMessageStream({ message: text });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '...' }]);
            for await (const chunk of result) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: t('unexpectedError') }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-0 h-full flex flex-col">
            <div className="flex items-center mb-0 p-6 border-b border-black/10 dark:border-white/10">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label={t('goBack')}>
                    <ArrowLeftIcon />
                </button>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('liveChat')}</h3>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 custom-scrollbar">
                {messages.map((msg, index) => <ChatMessageBubble key={index} role={msg.role} text={msg.text} theme={theme} />)}
                {isLoading && messages[messages.length - 1].role === 'user' && <ChatMessageBubble role="model" text="..." theme={theme} />}
            </div>
            <div className="p-4 border-t border-black/10 dark:border-white/10">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <NeonInput id="chat-input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} theme={theme} language={language} label={t('chatPlaceholder')} disabled={isLoading} />
                    <NeonButton onClick={() => {}} theme={theme} className="w-auto px-4 py-3 aspect-square" disabled={isLoading || !inputValue.trim()}>
                        {isLoading ? <SpinnerIcon /> : <SendIcon />}
                    </NeonButton>
                </form>
            </div>
        </div>
    );
};

const UserGuideViewInternal: React.FC<{ onBack: () => void; language: Language; }> = ({ onBack, language }) => {
    const { t } = useTranslations(language);
    const [openAccordion, setOpenAccordion] = useState<string | null>('track');

    const guideSections = [
        { id: 'track', title: t('guideTitleTrack'), content: t('guideContentTrack') },
        { id: 'plan', title: t('guideTitlePlan'), content: t('guideContentPlan') },
        { id: 'fare', title: t('guideTitleFare'), content: t('guideContentFare') },
        { id: 'facilities', title: t('guideTitleFacilities'), content: t('guideContentFacilities') },
    ];
    
    return (
        <ViewWrapper title={t('userGuide')} onBack={onBack} language={language}>
            <div className="space-y-3">
                {guideSections.map(section => (
                    <div key={section.id} className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
                        <button 
                            onClick={() => setOpenAccordion(openAccordion === section.id ? null : section.id)}
                            className="w-full flex justify-between items-center p-4 text-left bg-gray-500/5 dark:bg-white/5"
                            aria-expanded={openAccordion === section.id}
                        >
                            <h4 className="font-bold text-gray-800 dark:text-white">{section.title}</h4>
                            {openAccordion === section.id ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        </button>
                        {openAccordion === section.id && (
                            <div className="p-4 bg-white/50 dark:bg-black/20 text-sm text-gray-600 dark:text-gray-300 animate-[fade-in-down_0.3s_ease-out]">
                                <p>{section.content}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </ViewWrapper>
    );
};

// --- START: LOST & FOUND VIEW ---
interface LostFoundItem {
    id: number;
    status: 'lost' | 'found';
    itemName: string;
    busNumber: string;
    date: string;
    contact: string;
    description: string;
    postDate: string;
}

const mockLostAndFoundItems: LostFoundItem[] = [
    { id: 1, status: 'lost', itemName: 'Black Backpack', busNumber: '102', date: '2024-07-20', contact: '9876543210', description: 'Contains a laptop and books. Lost on the evening bus from Kengeri.', postDate: '2024-07-21' },
    { id: 2, status: 'found', itemName: 'Blue Umbrella', busNumber: '375', date: '2024-07-19', contact: 'depot@transport.gov', description: 'Found near the front seat. Please contact the Kengeri depot.', postDate: '2024-07-20' },
    { id: 3, status: 'lost', itemName: 'Steel Water Bottle', busNumber: '45A', date: '2024-07-22', contact: 'user@email.com', description: 'Silver bottle with a green cap.', postDate: '2024-07-22' },
];

const LostAndFoundViewInternal: React.FC<{ onBack: () => void; theme: Theme; language: Language; }> = ({ onBack, theme, language }) => {
    const { t } = useTranslations(language);
    const { addToast } = useToast();

    const [items, setItems] = useState<LostFoundItem[]>(mockLostAndFoundItems);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [status, setStatus] = useState<'lost' | 'found'>('lost');
    const [itemName, setItemName] = useState('');
    const [busNumber, setBusNumber] = useState('');
    const [date, setDate] = useState('');
    const [contact, setContact] = useState('');
    const [description, setDescription] = useState('');
    
    const resetForm = () => {
        setStatus('lost');
        setItemName('');
        setBusNumber('');
        setDate('');
        setContact('');
        setDescription('');
    };
    
    const handlePostItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName) { addToast(t('itemNameRequired'), 'error'); return; }
        if (!busNumber) { addToast(t('busNumberRequired'), 'error'); return; }
        if (!date) { addToast(t('dateRequired'), 'error'); return; }
        if (!contact) { addToast(t('contactInfoRequired'), 'error'); return; }

        setIsLoading(true);
        try {
            const newItemData = { status, itemName, busNumber, date, contact, description };
            const { item: newItem } = await api.postLostAndFoundItem(newItemData);
            setItems(prevItems => [newItem, ...prevItems]); // Add new item to the top of the list
            addToast(t('itemPostedSuccess'), 'success');
            resetForm();
            setIsFormVisible(false);
        } catch (err: any) {
            addToast(err.message || t('unexpectedError'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = items.filter(item => 
        item.busNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ViewWrapper title={t('lostAndFound')} onBack={onBack} language={language}>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('lostAndFoundDescription')}</p>
                <NeonButton onClick={() => setIsFormVisible(!isFormVisible)} theme={theme}>
                    {isFormVisible ? t('closePanel') : t('postAnItem')}
                </NeonButton>
                
                {isFormVisible && (
                    <form onSubmit={handlePostItem} className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col gap-4 animate-[fade-in-down_0.3s_ease-out]">
                        <div className="grid grid-cols-2 gap-3">
                           <label className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border-2 ${status === 'lost' ? 'border-orange-500 dark:border-green-400 bg-orange-500/10 dark:bg-green-500/10' : 'border-gray-300 dark:border-white/20'}`}>
                               <input type="radio" name="status" value="lost" checked={status === 'lost'} onChange={() => setStatus('lost')} className="form-radio text-orange-600 dark:text-green-500" />
                               <span>{t('lost')}</span>
                           </label>
                           <label className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border-2 ${status === 'found' ? 'border-orange-500 dark:border-green-400 bg-orange-500/10 dark:bg-green-500/10' : 'border-gray-300 dark:border-white/20'}`}>
                               <input type="radio" name="status" value="found" checked={status === 'found'} onChange={() => setStatus('found')} className="form-radio text-orange-600 dark:text-green-500" />
                               <span>{t('found')}</span>
                           </label>
                        </div>
                        <NeonInput id="itemName" label={t('itemName')} value={itemName} onChange={e => setItemName(e.target.value)} theme={theme} language={language} required/>
                        <NeonInput id="busNumber" label={t('busRouteNumber')} value={busNumber} onChange={e => setBusNumber(e.target.value)} theme={theme} language={language} required/>
                        <NeonInput id="date" type="date" label={t('date')} value={date} onChange={e => setDate(e.target.value)} theme={theme} language={language} required/>
                        <NeonInput id="contact" label={t('contactInfo')} value={contact} onChange={e => setContact(e.target.value)} theme={theme} language={language} required/>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t('description')} rows={3} className="w-full px-4 py-3 text-base bg-white/80 dark:bg-black/60 rounded-xl border-2 outline-none transition-colors duration-300 text-gray-800 dark:text-white border-gray-300 dark:border-white/20 focus:border-orange-500 dark:focus:border-green-400" />
                        <NeonButton onClick={() => {}} isLoading={isLoading} theme={theme}>
                            {t('postItem')}
                        </NeonButton>
                    </form>
                )}

                <hr className="border-t border-black/10 dark:border-white/10 my-2" />
                
                <NeonInput id="search" label={t('searchByBus')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} theme={theme} language={language} />

                <div className="space-y-3 mt-2">
                    {filteredItems.map(item => (
                        <div key={item.id} className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg text-gray-800 dark:text-white">{item.itemName}</h4>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.status === 'lost' ? 'bg-red-500/20 text-red-600' : 'bg-green-500/20 text-green-600'}`}>
                                    {item.status === 'lost' ? t('lost') : t('found')}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                                <span><strong>Bus:</strong> {item.busNumber}</span>
                                <span><strong>Date:</strong> {item.date}</span>
                                <span><strong>{t('contact')}:</strong> {item.contact}</span>
                            </div>
                             <p className="text-right text-xs text-gray-400 dark:text-gray-500 mt-2">{t('postedOn')} {item.postDate}</p>
                        </div>
                    ))}
                </div>
            </div>
        </ViewWrapper>
    );
};
// --- END: LOST & FOUND VIEW ---

const SidePanel: React.FC<SidePanelProps> = ({ setTrackedLocation, trackedLocation, theme, language }) => {
    const [currentView, setCurrentView] = useState<PanelView>('main');
    const { t } = useTranslations(language);

    useEffect(() => {
        if (trackedLocation) {
            setCurrentView('main');
        }
    }, [trackedLocation]);

    const handleBack = () => {
        setCurrentView('main');
        setTrackedLocation(null);
    };

    const features = [
        { id: 'track', title: t('trackBusRoute'), icon: <BusIcon />, view: 'track' as PanelView },
        { id: 'plan', title: t('journeyPlanner'), icon: <JourneyPlannerIcon />, view: 'plan' as PanelView },
        { id: 'eta', title: t('etaPredictions'), icon: <EtaIcon />, view: 'eta' as PanelView },
        { id: 'timetable', title: t('timetables'), icon: <TimetableIcon />, view: 'timetable' as PanelView },
        { id: 'fare', title: t('fareCalculator'), icon: <FareCalculatorIcon />, view: 'fare' as PanelView },
        { id: 'facilities', title: t('stationFacilities'), icon: <FacilitiesIcon />, view: 'facilities' as PanelView },
        { id: 'lostAndFound', title: t('lostAndFound'), icon: <LostFoundIcon />, view: 'lostAndFound' as PanelView },
        { id: 'feedback', title: t('feedbackSupport'), icon: <FeedbackIcon />, view: 'feedback' as PanelView },
        { id: 'chat', title: t('liveChat'), icon: <ChatIcon />, view: 'chat' as PanelView },
        { id: 'guide', title: t('userGuide'), icon: <UserGuideIcon />, view: 'guide' as PanelView },
    ];
    
    const renderMainView = () => (
        <div className="animate-[slide-in-right_0.3s_ease-out]">
            <h2 className="text-xl font-bold mb-4 px-6 pt-6 text-gray-800 dark:text-white">{t('features')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 px-6 pb-6">
                {features.map(feature => (
                     <div key={feature.id}>
                        <FeatureCard 
                            icon={feature.icon}
                            title={feature.title}
                            onClick={() => setCurrentView(feature.view)}
                            theme={theme}
                        />
                     </div>
                ))}
            </div>
        </div>
    );
    
    const renderView = () => {
        switch (currentView) {
            case 'track':
                return <TrackBusViewInternal onBack={handleBack} setTrackedLocation={setTrackedLocation} theme={theme} language={language} />;
            case 'plan':
                return <JourneyPlannerViewInternal onBack={handleBack} theme={theme} language={language} />;
            case 'eta':
                return <EtaPredictionsViewInternal onBack={handleBack} theme={theme} language={language} />;
            case 'timetable':
                return <TimetableViewInternal onBack={handleBack} theme={theme} language={language} />;
            case 'fare':
                return <FareCalculatorViewInternal onBack={handleBack} theme={theme} language={language} />;
            case 'facilities':
                return <FacilitiesViewInternal onBack={handleBack} theme={theme} language={language} />;
            case 'lostAndFound':
                return <LostAndFoundViewInternal onBack={handleBack} theme={theme} language={language} />;
            case 'feedback':
                return <FeedbackViewInternal onBack={handleBack} theme={theme} language={language} />;
            case 'chat':
                 return <ChatViewInternal onBack={handleBack} theme={theme} language={language} />;
            case 'guide':
                return <UserGuideViewInternal onBack={handleBack} language={language} />;
            default:
                return renderMainView();
        }
    };

    return (
        <aside className="h-full w-full bg-white/70 dark:bg-black/60 backdrop-blur-2xl flex flex-col">
            <header className="flex items-center justify-center p-4 border-b border-black/10 dark:border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 dark:from-orange-400 dark:to-green-400">
                        GramYatra
                    </h1>
                </div>
            </header>
            <div className="flex-1 overflow-hidden">
                {trackedLocation ? (
                    <TrackedBusDetails 
                        trackedLocation={trackedLocation}
                        theme={theme}
                        language={language}
                        onStopTracking={() => setTrackedLocation(null)}
                    />
                ) : (
                    <div className={`h-full ${currentView !== 'chat' ? 'overflow-y-auto custom-scrollbar' : ''}`}>
                        {renderView()}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default SidePanel;