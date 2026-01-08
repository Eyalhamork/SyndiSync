import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MicrophoneIcon } from '@heroicons/react/24/solid';
import { MicrophoneIcon as MicrophoneOutlineIcon } from '@heroicons/react/24/outline';
import useAppStore from '../../store/appStore';

// Type definition for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceControl() {
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  // Actions to trigger from store/commands
  const {
    setMobileMenuOpen,
    isMobileMenuOpen
  } = useAppStore();

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback('Listening...');
      };

      recognition.onend = () => {
        setIsListening(false);
        // Clear feedback after delay
        setTimeout(() => {
          if (!isListening) setFeedback('');
        }, 2000);
      };

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.toLowerCase();
        processCommand(text);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setFeedback('Error: ' + event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const processCommand = (text: string) => {
    console.log('Voice command:', text);
    setFeedback(`Heard: "${text}"`);

    // Command mapping
    if (text.includes('dashboard') || text.includes('home')) {
      navigate('/dashboard');
      setFeedback('Navigating to Dashboard...');
    }
    else if (text.includes('document')) {
      navigate('/documents');
      setFeedback('Opening Documents...');
    }
    else if (text.includes('negotiation')) {
      navigate('/negotiations');
      setFeedback('Opening Negotiations...');
    }
    else if (text.includes('analytic') || text.includes('stat')) {
      navigate('/analytics');
      setFeedback('Showing Analytics...');
    }
    else if (text.includes('menu') || text.includes('sidebar')) {
      setMobileMenuOpen(!isMobileMenuOpen);
      setFeedback('Toggling Menu...');
    }
    else if (text.includes('generate') || text.includes('create')) {
      navigate('/generate');
      setFeedback('Starting Generation...');
    }
    // ESG Commands
    else if (text.includes('esg') || text.includes('green') || text.includes('sustain')) {
      navigate('/dashboard');
      setFeedback('Analyzing Sustainability...');
    }
    else {
      setFeedback('Unknown command');
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    return null; // Hide if not supported
  }

  return (
    <div className="relative flex items-center">
      {/* Feedback Popover */}
      {feedback && (
        <div className="absolute top-12 right-0 w-48 bg-gray-900/90 text-white text-xs px-3 py-2 rounded-lg shadow-xl backdrop-blur-sm animate-fade-in z-50">
          {feedback}
        </div>
      )}

      {/* Mic Button */}
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full transition-all duration-300 ${isListening
          ? 'bg-red-100 text-red-600 ring-4 ring-red-50 animate-pulse'
          : 'hover:bg-gray-100 text-gray-600'
          }`}
        title="Voice Control"
      >
        {isListening ? (
          <MicrophoneIcon className="h-6 w-6" />
        ) : (
          <MicrophoneOutlineIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
