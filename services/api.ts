import { User } from '../App';

// --- MOCK BACKEND API ---

const MOCK_LATENCY = 1000; // in milliseconds
let latestDriverAlert: { message: string; timestamp: number; bus: string } | null = {
    message: 'Driver Alert for 102: Heavy traffic near Ramanagara, expect a 15-minute delay.',
    timestamp: Date.now(),
    bus: '102',
};
const ALERT_LIFESPAN = 5 * 60 * 1000; // 5 minutes

/**
 * Simulates a network request.
 */
const mockRequest = <T,>(data: T, latency: number = MOCK_LATENCY): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, latency);
    });
};

/**
 * Simulates a failing network request.
 */
const mockFailure = <T,>(error: { message: string }, latency: number = MOCK_LATENCY): Promise<T> => {
     return new Promise((_, reject) => {
        setTimeout(() => {
            reject(error);
        }, latency);
    });
}

// --- API Data Types & Mock Database ---

interface Stop {
    name: string;
    etaMinutes: number;
    lat: number;
    lng: number;
}

interface MockLocation {
    lat: number;
    lng: number;
    name: string;
    status: 'on-time' | 'delayed';
    type: 'bus' | 'route';
    stops?: Stop[];
    path?: [number, number][];
    alert?: string;
}

const mockDatabase: { [key: string]: MockLocation } = {
    // Delhi & Karnataka (Existing)
    '101': { lat: 28.6139, lng: 77.2090, name: 'Bus 101 - India Gate, Delhi', status: 'on-time', type: 'bus' },
    '45A': { lat: 28.6562, lng: 77.2410, name: 'Bus 45A - Red Fort, Delhi', status: 'delayed', type: 'bus' },
    '729': { lat: 28.5562, lng: 77.1000, name: 'Bus 729 - Airport T3, Delhi', status: 'on-time', type: 'bus' },
    '102': {
        lat: 12.9166, // Current bus location
        lng: 77.4833,
        name: 'Route 102 - Kengeri to Mysore',
        status: 'on-time',
        type: 'route',
        stops: [
            { name: 'Kengeri', etaMinutes: 0, lat: 12.9166, lng: 77.4833 },
            { name: 'Bidadi', etaMinutes: 30, lat: 12.7969, lng: 77.3838 },
            { name: 'Ramanagara', etaMinutes: 60, lat: 12.7209, lng: 77.2799 },
            { name: 'Channapatna', etaMinutes: 90, lat: 12.6518, lng: 77.2086 },
            { name: 'Mandya', etaMinutes: 135, lat: 12.5218, lng: 76.8951 },
            { name: 'Srirangapatna', etaMinutes: 165, lat: 12.4237, lng: 76.6829 },
            { name: 'Mysore Bus Stand', etaMinutes: 190, lat: 12.3148, lng: 76.6483 },
        ],
        path: [
            [12.9166, 77.4833], // Kengeri
            [12.7969, 77.3838], // Bidadi
            [12.7209, 77.2799], // Ramanagara
            [12.6518, 77.2086], // Channapatna
            [12.5218, 76.8951], // Mandya
            [12.4237, 76.6829], // Srirangapatna
            [12.3148, 76.6483], // Mysore Bus Stand
        ]
    },
    '307': { lat: 12.4237, lng: 76.6829, name: 'Bus 307 - Srirangapatna', status: 'on-time', type: 'bus' },
    '375': {
        lat: 12.9166, // Current bus location (start of route)
        lng: 77.4833,
        name: 'Route 375 - Kengeri to Banashankari',
        status: 'on-time',
        type: 'route',
        stops: [
            { name: 'Kengeri Bus Terminal', etaMinutes: 0, lat: 12.9166, lng: 77.4833 },
            { name: 'BGS Hospital', etaMinutes: 5, lat: 12.9095, lng: 77.4855 },
            { name: 'JSS Academy of Technical Education', etaMinutes: 20, lat: 12.9083, lng: 77.5135 },
            { name: 'Channasandra', etaMinutes: 25, lat: 12.9095, lng: 77.5300 },
            { name: 'Uttarahalli', etaMinutes: 30, lat: 12.9088, lng: 77.5414 },
            { name: 'Banashankari', etaMinutes: 45, lat: 12.9252, lng: 77.5732 },
        ],
        path: [
            [12.9166, 77.4833], // Kengeri Bus Terminal
            [12.9095, 77.4855], // BGS Hospital
            [12.9083, 77.5135], // JSS Academy of Technical Education
            [12.9095, 77.5300], // Channasandra
            [12.9088, 77.5414], // Uttarahalli
            [12.9252, 77.5732], // Banashankari
        ]
    },
    'R5': {
        lat: 28.5245,
        lng: 77.1855,
        name: 'Route R5 - Qutub Minar, Delhi',
        status: 'on-time',
        type: 'route',
        stops: [
            { name: 'Hauz Khas Village', etaMinutes: 5, lat: 28.5503, lng: 77.1954 },
            { name: 'Green Park Metro', etaMinutes: 12, lat: 28.5587, lng: 77.1932 },
            { name: 'AIIMS', etaMinutes: 18, lat: 28.5676, lng: 77.2093 },
        ],
        path: [
            [28.5245, 77.1855],
            [28.5503, 77.1954],
            [28.5587, 77.1932],
            [28.5676, 77.2093],
        ]
    },
    
    // --- All India Demo Buses ---
    // Mumbai
    'M-440': { lat: 18.9220, lng: 72.8347, name: 'Bus M-440 - Gateway of India, Mumbai', status: 'delayed', type: 'bus' },
    // Kolkata
    'K-237': { lat: 22.5852, lng: 88.3639, name: 'Bus K-237 - Howrah Bridge, Kolkata', status: 'on-time', type: 'bus' },
    // Chennai
    'C-570': { lat: 13.0500, lng: 80.2825, name: 'Bus C-570 - Marina Beach, Chennai', status: 'on-time', type: 'bus' },
    // Hyderabad
    'H-18': { lat: 17.3616, lng: 78.4747, name: 'Bus H-18 - Charminar, Hyderabad', status: 'delayed', type: 'bus' },
    // Pune
    'P-155': { lat: 18.5196, lng: 73.8554, name: 'Bus P-155 - Shaniwar Wada, Pune', status: 'on-time', type: 'bus' },
    // Ahmedabad
    'A-501': { lat: 23.0610, lng: 72.5802, name: 'Bus A-501 - Sabarmati Ashram, Ahmedabad', status: 'on-time', type: 'bus' },
    // Bengaluru (City Center)
    'B-500D': { lat: 12.9767, lng: 77.5713, name: 'Bus B-500D - Majestic Circle, Bengaluru', status: 'delayed', type: 'bus' },
    // Jaipur
    'J-3A': { lat: 26.9239, lng: 75.8267, name: 'Bus J-3A - Hawa Mahal, Jaipur', status: 'on-time', type: 'bus' },
    // Lucknow
    'L-11': { lat: 26.8523, lng: 80.9168, name: 'Bus L-11 - Rumi Darwaza, Lucknow', status: 'on-time', type: 'bus' },
    // Chandigarh
    'CH-201': { lat: 30.7525, lng: 76.8101, name: 'Bus CH-201 - Rock Garden, Chandigarh', status: 'delayed', type: 'bus' },
};


// --- API FUNCTIONS ---

export const signInWithGoogle = (identifier: string): Promise<{ user: User }> => {
    console.log(`[API] Attempting to sign in with Google for: ${identifier}`);
    if (!identifier || !identifier.includes('@')) {
        return mockFailure({ message: 'A valid email is required to sign in.' });
    }
    const username = identifier.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return mockRequest({ user: { username, identifier } });
};


export const signOut = (): Promise<void> => {
    console.log('[API] Signing out user.');
    return mockRequest<void>(undefined, 500);
}

export const trackBusOrRoute = (query: string): Promise<{ found: boolean; location?: MockLocation }> => {
    console.log(`[API] Tracking: ${query}`);
    const upperCaseQuery = query.toUpperCase();

    if (mockDatabase[upperCaseQuery]) {
        // Simulate real-time position changes for the bus itself
        const location = { ...mockDatabase[upperCaseQuery] };
        location.lat += (Math.random() - 0.5) * 0.001;
        location.lng += (Math.random() - 0.5) * 0.001;
        
        // Check for a recent alert for this bus/route
        if (latestDriverAlert && latestDriverAlert.bus.toUpperCase() === upperCaseQuery && (Date.now() - latestDriverAlert.timestamp < ALERT_LIFESPAN)) {
            location.alert = latestDriverAlert.message;
        }


        return mockRequest({
            found: true,
            location: location
        });
    } else {
        return mockRequest({
            found: false
        });
    }
}

export const planJourney = (origin: string, destination: string): Promise<{ success: boolean; message: string, duration: number }> => {
    console.log(`[API] Planning journey from ${origin} to ${destination}`);
    if (!origin || !destination) {
        return mockFailure({ message: 'Origin and destination are required.' });
    }
    if (origin.toLowerCase() === destination.toLowerCase()) {
        return mockFailure({ message: 'Origin and destination cannot be the same.'});
    }
    const duration = Math.floor(Math.random() * (90 - 20 + 1)) + 20; // Random duration between 20 and 90 mins
    return mockRequest({
        success: true,
        message: `Estimated duration: ${duration} minutes.`,
        duration: duration,
    });
};

export const getEtaPredictions = (busNumber: string): Promise<{ predictions: { stopName: string; etaMinutes: number }[] }> => {
    console.log(`[API] Getting ETA for bus: ${busNumber}`);
    if (!busNumber) {
        return mockFailure({ message: 'Bus number is required.' });
    }

    const knownBuses: { [key: string]: { stopName: string; etaMinutes: number }[] } = {
        '101': [
            { stopName: 'India Gate Circle', etaMinutes: 3 },
            { stopName: 'National Museum', etaMinutes: 8 },
            { stopName: 'Central Secretariat', etaMinutes: 15 },
        ],
        '45A': [
            { stopName: 'Red Fort Main Gate', etaMinutes: 1 },
            { stopName: 'Jama Masjid', etaMinutes: 11 },
            { stopName: 'Delhi Gate', etaMinutes: 18 },
        ],
        '102': [
            { stopName: 'Bidadi', etaMinutes: 25 },
            { stopName: 'Ramanagara', etaMinutes: 55 },
            { stopName: 'Channapatna', etaMinutes: 85 },
            { stopName: 'Mandya', etaMinutes: 130 },
            { stopName: 'Srirangapatna', etaMinutes: 160 },
            { stopName: 'Mysore Bus Stand', etaMinutes: 185 },
        ],
        '375': [
            { stopName: 'BGS Hospital', etaMinutes: 5 },
            { stopName: 'JSS Academy of Technical Education', etaMinutes: 20 },
            { stopName: 'Channasandra', etaMinutes: 25 },
            { stopName: 'Uttarahalli', etaMinutes: 30 },
            { stopName: 'Banashankari', etaMinutes: 45 },
        ],
    };

    const upperCaseBusNumber = busNumber.toUpperCase();

    if (knownBuses[upperCaseBusNumber]) {
        return mockRequest({ predictions: knownBuses[upperCaseBusNumber] });
    } else {
        return mockFailure({ message: `No ETA data found for bus "${busNumber}".` });
    }
};

export const updateUsername = (currentUser: User, newUsername: string): Promise<{ success: boolean, updatedUser: User }> => {
    console.log(`[API] Updating username for ${currentUser.identifier} to "${newUsername}"`);
    if (!newUsername || newUsername.trim().length < 3) {
        return mockFailure({ message: 'Username must be at least 3 characters long.' });
    }
    const updatedUser = { ...currentUser, username: newUsername };
    return mockRequest({ success: true, updatedUser: updatedUser });
};

export const sendDriverAlert = (busNumber: string, message: string): Promise<void> => {
    console.log(`[API] Driver for bus ${busNumber} is sending alert: "${message}"`);
    if (!busNumber || !message) {
        return mockFailure({ message: 'Bus number and message are required.' });
    }
    latestDriverAlert = {
        message: `Driver Alert for ${busNumber}: ${message}`,
        timestamp: Date.now(),
        bus: busNumber,
    };
    return mockRequest(undefined, 500);
};

export const submitFeedback = (type: string, message: string): Promise<{ success: boolean }> => {
    console.log(`[API] Submitting feedback. Type: ${type}, Message: "${message}"`);
    if (!message.trim()) {
        return mockFailure({ message: 'Feedback message cannot be empty.' });
    }
    // In a real app, this would send data to a backend server.
    // Here, we just simulate a successful submission.
    return mockRequest({ success: true }, 800);
};

export const postLostAndFoundItem = (itemData: any): Promise<{ success: boolean; item: any }> => {
    console.log('[API] Posting new Lost & Found item:', itemData);
    if (!itemData.itemName || !itemData.busNumber || !itemData.date || !itemData.contact) {
        return mockFailure({ message: 'Missing required fields for lost and found item.' });
    }
    const newItem = {
        id: Date.now(),
        ...itemData,
        postDate: new Date().toISOString().split('T')[0], // Add a post date
    };
    // In a real app, this would be saved to a database.
    return mockRequest({ success: true, item: newItem }, 800);
};