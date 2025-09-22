import { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../translations';

// Define the interface for the SpeechRecognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

// Extend the Window interface
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const LANGUAGE_MAP: Record<Language, string> = {
    en: 'en-US',
    kn: 'kn-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    ml: 'ml-IN',
};

const HINDI_NUMBER_WORDS: Record<string, string> = {
  'शून्य': '0', 'एक': '1', 'दो': '2', 'तीन': '3', 'चार': '4',
  'पांच': '5', 'छह': '6', 'छः': '6', 'सात': '7', 'आठ': '8', 'नौ': '9',
};

const KANNADA_NUMBER_WORDS: Record<string, string> = {
  'ಸೊನ್ನೆ': '0', 'ಒಂದು': '1', 'ಎರಡು': '2', 'ಮೂರು': '3', 'ನಾಲ್ಕು': '4',
  'ಐದು': '5', 'ಆರು': '6', 'ಏಳು': '7', 'ಎಂಟು': '8', 'ಒಂಬತ್ತು': '9',
};

const useVoiceRecognition = (language: Language) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after the first final result
    recognition.interimResults = false; // Only get final results
    recognition.lang = LANGUAGE_MAP[language] || 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = event.results[0][0].transcript;
      // The speech recognition API often adds a period at the end of an utterance.
      // We remove it to provide a cleaner input for search fields.
      if (currentTranscript.endsWith('.')) {
        currentTranscript = currentTranscript.slice(0, -1);
      }
      
      let finalTranscript = currentTranscript;

      // Convert number words to digits for specific languages
      if (language === 'hi' || language === 'kn') {
        const words = currentTranscript.split(' ');
        const numberMap = language === 'hi' ? HINDI_NUMBER_WORDS : KANNADA_NUMBER_WORDS;

        // Step 1: Convert number words to digit strings
        const convertedWords = words.map(word => numberMap[word] || word);

        // Step 2: Combine consecutive digits into a single string
        const processedWords: string[] = [];
        let currentNumber = '';

        for (const word of convertedWords) {
          // Check if the word is a string of digits
          if (/^\d+$/.test(word)) {
            currentNumber += word;
          } else {
            if (currentNumber) {
              processedWords.push(currentNumber);
              currentNumber = '';
            }
            processedWords.push(word);
          }
        }
        // Add any trailing number
        if (currentNumber) {
          processedWords.push(currentNumber);
        }
        finalTranscript = processedWords.join(' ');
      }
      
      setTranscript(finalTranscript);
    };

    recognition.onerror = (event) => {
      // Differentiate between a user not speaking and a technical error.
      if (event.error === 'no-speech') {
        // This is a common occurrence, so we'll treat it as a warning.
        console.warn('Speech recognition warning:', event.error);
      } else {
        console.error('Speech recognition error:', event.error);
      }
      setError(event.error || 'unknown');
      setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Update language if it changes
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }

  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop(); // Allow toggling off
      } else {
        setTranscript('');
        setError(null);
        recognitionRef.current.start();
        setIsListening(true);
      }
    } else {
        setError('Speech recognition is not available.');
    }
  }, [isListening]);


  return {
    isListening,
    transcript,
    error,
    startListening,
    hasRecognitionSupport: !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)),
  };
};

export default useVoiceRecognition;