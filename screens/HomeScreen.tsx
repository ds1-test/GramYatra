import React, { useState } from 'react';
import { User, Theme } from '../App';
import Navbar from '../components/home/Navbar';
import Map from '../components/home/Map';
import SidePanel from '../components/home/SidePanel';
import { Language } from '../translations';
import ProfileScreen from './ProfileScreen';

interface HomeScreenProps {
  user: User;
  onSignOut: () => void;
  onUpdateUser: (updatedUser: User) => void;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export interface Stop {
    name: string;
    etaMinutes: number;
    lat: number;
    lng: number;
}

export interface TrackedLocation {
    lat: number;
    lng: number;
    name: string;
    status: 'on-time' | 'delayed';
    type: 'bus' | 'route';
    stops?: Stop[];
    path?: [number, number][];
    alert?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, onSignOut, onUpdateUser, theme, toggleTheme, language, setLanguage }) => {
    const [trackedLocation, setTrackedLocation] = useState<TrackedLocation | null>(null);
    const [sidePanelKey, setSidePanelKey] = useState(0);
    const [isProfileVisible, setIsProfileVisible] = useState(false);

    const handleGoHome = () => {
        setTrackedLocation(null);
        setSidePanelKey(prevKey => prevKey + 1);
    };

    return (
        <div className="flex-1 text-gray-800 dark:text-white flex flex-col overflow-hidden transition-colors duration-500">
            <Navbar 
                user={user}
                onSignOut={onSignOut} 
                theme={theme} 
                toggleTheme={toggleTheme} 
                onGoHome={handleGoHome}
                onOpenProfile={() => setIsProfileVisible(true)}
                language={language}
                setLanguage={setLanguage}
            />
            {/* The main content area, with a vertical split on mobile and horizontal on desktop */}
            <div className="relative z-10 flex-1 flex flex-col md:flex-row pt-20 overflow-hidden p-2 md:p-0 md:pt-20 gap-2 md:gap-0">
                {/* Map container: rounded with shadow on mobile */}
                <div className="h-[40%] md:h-full md:flex-1 relative rounded-2xl md:rounded-none overflow-hidden shadow-lg dark:shadow-black/50 md:shadow-none">
                    <Map trackedLocation={trackedLocation} theme={theme} language={language} />
                </div>

                {/* Side Panel container: rounded with shadow on mobile */}
                <div className="h-[60%] md:h-full md:w-96 lg:w-[28rem] md:flex-shrink-0 relative rounded-2xl md:rounded-none overflow-hidden shadow-lg dark:shadow-black/50 md:shadow-none">
                    <SidePanel
                        key={sidePanelKey}
                        setTrackedLocation={setTrackedLocation}
                        trackedLocation={trackedLocation}
                        theme={theme}
                        language={language}
                    />
                </div>
            </div>
             {isProfileVisible && (
                <ProfileScreen
                    user={user}
                    onClose={() => setIsProfileVisible(false)}
                    onUpdateUser={onUpdateUser}
                    theme={theme}
                    language={language}
                />
            )}
        </div>
    );
};

export default HomeScreen;