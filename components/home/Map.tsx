import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import { TrackedLocation } from "../../screens/HomeScreen";
import { Theme } from "../../App";
import PlusIcon from "../icons/PlusIcon";
import MinusIcon from "../icons/MinusIcon";
import CenterIcon from "../icons/CenterIcon";
import EtaIcon from "../icons/EtaIcon";
import { Language } from "../../translations";
import { useTranslations } from "../../hooks/useTranslations";
import GpsIcon from "../icons/GpsIcon";
import { useToast } from "../../hooks/useToast";

const createBusIcon = (status: 'on-time' | 'delayed') => {
    const isDelayed = status === 'delayed';
    const pulseColor = isDelayed ? 'bg-orange-400' : 'bg-green-400';
    const coreColor = isDelayed ? 'bg-orange-500' : 'bg-green-500';
    const pulseAnimation = isDelayed ? 'animate-ping-urgent' : 'animate-ping-slow';
    const shadowColor = isDelayed ? 'shadow-orange-500/50' : 'shadow-green-500/50';

    return L.divIcon({
        html: `
            <div class="relative flex items-center justify-center">
                <div class="absolute w-8 h-8 ${pulseColor} rounded-full ${pulseAnimation} shadow-lg ${shadowColor}"></div>
                <div class="absolute w-5 h-5 ${coreColor} rounded-full border-2 border-white shadow-md shadow-black/30"></div>
            </div>
        `,
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
};

const createUserLocationIcon = () => {
    return L.divIcon({
        html: `
            <div class="relative flex items-center justify-center">
                <div class="absolute w-7 h-7 bg-sky-400 rounded-full animate-ping-slow shadow-lg shadow-sky-500/50"></div>
                <div class="absolute w-4 h-4 bg-sky-500 rounded-full border-2 border-white shadow-md shadow-black/30"></div>
            </div>
        `,
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
};

const createStopIcon = () => {
    return L.divIcon({
        html: `
            <div class="relative flex items-center justify-center">
                 <div class="w-3 h-3 bg-gray-600 dark:bg-gray-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
            </div>
        `,
        className: '',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });
};

const createMajorStopBusIcon = (rotation: number = 0) => {
    // A more prominent, directional icon for key stops.
    return L.divIcon({
        html: `
            <div 
                class="relative flex items-center justify-center" 
                style="transform: rotate(${rotation}deg);"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 drop-shadow-lg" viewBox="0 0 40 40">
                    <defs>
                        <linearGradient id="grad-red" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#ef4444;" />
                            <stop offset="100%" style="stop-color:#b91c1c;" />
                        </linearGradient>
                    </defs>
                    <g transform="rotate(90 20 20)">
                        <path d="M20 2 L 34 14 L 34 26 L 20 38 L 6 26 L 6 14 Z" fill="url(#grad-red)" stroke="#fef2f2" stroke-width="1.5" />
                    </g>
                    <svg x="10" y="10" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="6" cy="17" r="2" />
                        <circle cx="18" cy="17" r="2" />
                        <path d="M4 17h-2v-11a1 1 0 0 1 1 -1h14a5 7 0 0 1 5 7v5h-2m-4 0h-8" />
                        <polyline points="16 5 17.5 12 22 12" />
                        <line x1="2" y1="10" x2="17" y2="10" />
                        <line x1="7" y1="5" x2="7" y2="10" />
                        <line x1="12" y1="5" x2="12" y2="10" />
                    </svg>
                </svg>
            </div>
        `,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const toRadians = (deg: number) => deg * Math.PI / 180;
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const deltaLngRad = toRadians(lng2 - lng1);

    const y = Math.sin(deltaLngRad) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLngRad);
    
    const bearingRad = Math.atan2(y, x);
    const bearingDeg = bearingRad * 180 / Math.PI;
    
    return (bearingDeg + 360) % 360; // Normalize to 0-360
};

const onTimeBusIcon = createBusIcon('on-time');
const delayedBusIcon = createBusIcon('delayed');
const userLocationIcon = createUserLocationIcon();
const stopIcon = createStopIcon();


// Default icon fix for bundler-less environments
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});


// A component to handle map view changes reactively
const MapUpdater = ({ location }: { location: TrackedLocation | null }) => {
    const map = useMap();
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        // Add validation to prevent crash from invalid coordinates
        if (location && typeof location.lat === 'number' && typeof location.lng === 'number' && !isNaN(location.lat) && !isNaN(location.lng)) {
            
            if (location.type === 'route' && location.path && location.path.length > 0) {
                // If it's a route, fit the whole path into view
                map.flyToBounds(L.latLngBounds(location.path), { padding: [50, 50], duration: 1.5 });
            } else {
                // Otherwise, just fly to the single point
                map.flyTo([location.lat, location.lng], 15, {
                    animate: true,
                    duration: 1.5
                });
            }

            // Delay opening popup until after flyTo animation for a smoother effect
            const timer = setTimeout(() => {
                setPopupOpen(true);
            }, 1600);
            return () => clearTimeout(timer);
        } else {
            setPopupOpen(false);
        }
    }, [location, map]);

    // This effect ensures the popup opens once the marker is available and the map has settled
    useEffect(() => {
      if (location && popupOpen && typeof location.lat === 'number' && typeof location.lng === 'number') {
          map.eachLayer(layer => {
              if (layer instanceof L.Marker) {
                  const markerLatLng = layer.getLatLng();
                  // Open popup for the main bus marker
                  if (markerLatLng.lat === location.lat && markerLatLng.lng === location.lng) {
                      layer.openPopup();
                  }
              }
          });
      }
    }, [location, popupOpen, map]);

    return null;
}

interface MapProps {
  trackedLocation: TrackedLocation | null;
  theme: Theme;
  language: Language;
}

const Map: React.FC<MapProps> = ({ trackedLocation, theme, language }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [animatedPosition, setAnimatedPosition] = useState<[number, number] | null>(null);
  const positionRef = useRef<[number, number] | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const { t } = useTranslations(language);
  const { addToast } = useToast();

  const [gpsStatus, setGpsStatus] = useState<'idle' | 'enabling' | 'active' | 'error'>('idle');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const isSpecialRoute = trackedLocation?.name.includes('102');


  useEffect(() => {
      if (trackedLocation) {
          const startPos = positionRef.current ?? [trackedLocation.lat, trackedLocation.lng];
          const endPos: [number, number] = [trackedLocation.lat, trackedLocation.lng];

          if (startPos[0] === endPos[0] && startPos[1] === endPos[1]) {
              if (!animatedPosition) {
                   setAnimatedPosition(endPos);
                   positionRef.current = endPos;
              }
              return;
          }

          if (animationFrameIdRef.current !== null) {
              cancelAnimationFrame(animationFrameIdRef.current);
          }

          const duration = 1500; // 1.5 seconds for a smooth glide
          const startTime = performance.now();

          const animate = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              const progress = Math.min(elapsedTime / duration, 1);
              const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

              const lat = startPos[0] + (endPos[0] - startPos[0]) * easedProgress;
              const lng = startPos[1] + (endPos[1] - startPos[1]) * easedProgress;
              
              const newPos: [number, number] = [lat, lng];
              setAnimatedPosition(newPos);
              positionRef.current = newPos;

              if (progress < 1) {
                  animationFrameIdRef.current = requestAnimationFrame(animate);
              } else {
                  animationFrameIdRef.current = null;
              }
          };

          animationFrameIdRef.current = requestAnimationFrame(animate);
          
          return () => {
               if (animationFrameIdRef.current !== null) {
                  cancelAnimationFrame(animationFrameIdRef.current);
               }
          };
      } else {
          setAnimatedPosition(null);
          positionRef.current = null;
      }
  }, [trackedLocation]);


  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };
  
  const handleShowMyLocation = () => {
    if (gpsStatus === 'active') {
        setUserLocation(null);
        setGpsStatus('idle');
        return;
    }

    if (!navigator.geolocation) {
        addToast(t('geolocationNotSupported'), 'error');
        setGpsStatus('error');
        return;
    }

    setGpsStatus('enabling');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            setGpsStatus('active');
            mapRef.current?.flyTo([latitude, longitude], 16);
        },
        (error) => {
            setGpsStatus('error');
            const message = error.code === error.PERMISSION_DENIED
                ? t('locationPermissionDenied')
                : t('locationError');
            addToast(message, 'error');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const isLocationValid = trackedLocation && typeof trackedLocation.lat === 'number' && typeof trackedLocation.lng === 'number' && !isNaN(trackedLocation.lat) && !isNaN(trackedLocation.lng);

  const handleRecenter = () => {
    if (isLocationValid && mapRef.current) {
        if (trackedLocation.type === 'route' && trackedLocation.path && trackedLocation.path.length > 0) {
            mapRef.current.flyToBounds(L.latLngBounds(trackedLocation.path), { padding: [50, 50] });
        } else {
            mapRef.current.flyTo([trackedLocation.lat, trackedLocation.lng], 15);
        }
    }
  };

  const isDark = theme === 'dark';
  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  const tileAttribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const routeColor = isSpecialRoute ? '#1e40af' : '#3b82f6'; // Dark blue for special route
  const routeWeight = isSpecialRoute ? 8 : 5;

  const createDirectionArrowIcon = (rotation: number = 0) => {
    const arrowFillColor = isDark ? '#FFF' : routeColor;
    const outlineFillColor = isDark ? routeColor : '#FFF';
    return L.divIcon({
        html: `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-90" viewBox="0 0 24 24" style="transform: rotate(${rotation}deg);">
                 <defs>
                    <filter id="poly-arrow-shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.4"/>
                    </filter>
                </defs>
                <g filter="url(#poly-arrow-shadow)">
                    <path d="M12 2L4 20h16L12 2z" fill="${outlineFillColor}"/>
                    <path d="M12 5L6 18h12L12 5z" fill="${arrowFillColor}"/>
                </g>
            </svg>
        `,
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
  };

  const createSpecialDirectionArrowIcon = (rotation: number = 0) => {
    const specialColor = '#dc2626'; // A strong red color
    return L.divIcon({
        html: `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" style="transform: rotate(${rotation}deg);">
                 <defs>
                    <filter id="poly-arrow-shadow-special" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#000" flood-opacity="0.5"/>
                    </filter>
                </defs>
                <g filter="url(#poly-arrow-shadow-special)">
                    <path d="M12 2L4 20h16L12 2z" fill="${specialColor}"/>
                </g>
            </svg>
        `,
        className: '',
        iconSize: [24, 24], // Bigger size
        iconAnchor: [12, 12],
    });
  };


  const DirectionalMarkers = ({ path }: { path: [number, number][] }) => {
      if (!path || path.length < 2) return null;

      const markers: React.ReactNode[] = [];
      path.forEach((point, i) => {
          if (i === path.length - 1) return;

          const start = path[i];
          const end = path[i + 1];

          const midPoint: [number, number] = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
          const bearing = calculateBearing(start[0], start[1], end[0], end[1]);
          
          const arrowIcon = isSpecialRoute 
            ? createSpecialDirectionArrowIcon(bearing) 
            : createDirectionArrowIcon(bearing);

          markers.push(
              <Marker
                  key={`arrow-${i}`}
                  position={midPoint}
                  icon={arrowIcon}
                  interactive={false}
              />
          );
      });

      return <>{markers}</>;
  };

  const currentBusIcon = trackedLocation?.status === 'delayed' ? delayedBusIcon : onTimeBusIcon;
  const statusText = trackedLocation?.status === 'delayed' ? t('delayed') : t('onTime');


  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={[28.6139, 77.2090]} // Default to Delhi, India
        zoom={12} 
        scrollWheelZoom={true} 
        className={`w-full h-full ${isDark ? 'leaflet-dark' : ''}`}
        zoomControl={false}
        ref={mapRef}
        // Interaction enhancements
        inertia={true}
        inertiaDeceleration={2500}
        wheelPxPerZoomLevel={50}
      >
        <TileLayer
          attribution={tileAttribution}
          url={tileUrl}
          key={theme}
        />
        <MapUpdater location={trackedLocation} />
        
        {/* Render Route Path and Direction Arrows */}
        {trackedLocation?.type === 'route' && trackedLocation.path && (
            <>
              <Polyline positions={trackedLocation.path} color={routeColor} weight={routeWeight} opacity={0.8} />
              <DirectionalMarkers path={trackedLocation.path} />
            </>
        )}
        
        {/* Render Route Stops */}
        {trackedLocation?.type === 'route' && trackedLocation.stops?.map((stop) => {
            const isMajorStop = stop.name === 'Mandya' || stop.name === 'Ramanagara';
            
            let icon;
            if (isMajorStop && trackedLocation.stops) {
                let rotation = 0;
                const stopIndex = trackedLocation.stops.findIndex(s => s.name === stop.name);

                if (stop.name === 'Ramanagara') {
                    // Bus is going towards Mysore, so point to the next stop
                    const nextStop = trackedLocation.stops[stopIndex + 1];
                    if (nextStop) {
                        const bearing = calculateBearing(stop.lat, stop.lng, nextStop.lat, nextStop.lng);
                        rotation = bearing - 90; // The icon shape points East (90 deg) by default
                    }
                } else if (stop.name === 'Mandya') {
                    // Bus is going towards Kengeri, so point to the previous stop
                    const prevStop = trackedLocation.stops[stopIndex - 1];
                    if (prevStop) {
                        const bearing = calculateBearing(stop.lat, stop.lng, prevStop.lat, prevStop.lng);
                        rotation = bearing - 90; // Adjust for icon orientation
                    }
                }
                icon = createMajorStopBusIcon(rotation);
            } else {
                icon = stopIcon;
            }

            return (
                <Marker key={stop.name} position={[stop.lat, stop.lng]} icon={icon}>
                     <Popup>
                        <div className="font-poppins text-xs text-gray-800 dark:text-gray-100">
                            <p className="font-bold">{stop.name}</p>
                            <p className="flex items-center gap-1.5 mt-1">
                                <EtaIcon size={12} className="opacity-70" />
                                ETA: {stop.etaMinutes} {t('min')}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            );
        })}

        {/* Render Main Bus/Location Marker */}
        {isLocationValid && animatedPosition && (
          <Marker position={animatedPosition} icon={currentBusIcon}>
            <Popup>
              <div className="font-poppins text-sm w-52 text-gray-800 dark:text-gray-100">
                  <h3 className="font-bold text-lg mb-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 dark:from-orange-400 dark:to-green-400">{trackedLocation.name}</h3>
                  <p className="text-xs mb-2 text-gray-500 dark:text-gray-400">{t('status')}: 
                    <span className={`font-semibold px-2 py-0.5 rounded-full ml-1 ${trackedLocation?.status === 'delayed' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
                      {statusText}
                    </span>
                  </p>

                  {trackedLocation.type === 'route' && trackedLocation.stops ? (
                    <div>
                        <hr className="border-gray-300 dark:border-gray-600 my-2"/>
                        <h4 className="font-semibold text-xs mb-2">{t('upcomingStops')}</h4>
                        <ul className="space-y-1">
                            {trackedLocation.stops.map((stop, index) => (
                                <li key={index} className="flex items-center justify-between text-xs p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                    <span className="truncate pr-2">{stop.name}</span>
                                    <span className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0">
                                        <EtaIcon size={14} className="opacity-70" />
                                        {stop.etaMinutes} {t('min')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                  ) : (
                     <p className="text-xs text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/10 p-2 rounded-md mt-2">{t('lat')}: {trackedLocation.lat.toFixed(4)}, {t('lng')}: {trackedLocation.lng.toFixed(4)}</p>
                  )}
              </div>
            </Popup>
          </Marker>
        )}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>{t('yourLocation')}</Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Custom Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button onClick={handleShowMyLocation} className="p-2 rounded-lg bg-white/70 dark:bg-black/60 backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 transform hover:scale-110 active:scale-95" aria-label={t('showMyLocation')}>
          <GpsIcon status={gpsStatus} />
        </button>
        <button onClick={handleZoomIn} className="p-2 rounded-lg bg-white/70 dark:bg-black/60 backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 transform hover:scale-110 active:scale-95" aria-label="Zoom in">
          <PlusIcon />
        </button>
        <button onClick={handleZoomOut} className="p-2 rounded-lg bg-white/70 dark:bg-black/60 backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 transform hover:scale-110 active:scale-95" aria-label="Zoom out">
          <MinusIcon />
        </button>
        {isLocationValid && (
          <button onClick={handleRecenter} className="p-2 mt-2 rounded-lg bg-white/70 dark:bg-black/60 backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 transform hover:scale-110 active:scale-95" aria-label="Recenter map">
            <CenterIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default Map;