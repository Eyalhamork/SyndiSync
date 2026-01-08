import { useState, useEffect, useCallback } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import audioManager from '../../lib/audio';

const COMMAND_ROUTES: Record<string, string> = {
    'documents': '/documents',
    'document': '/documents',
    'show me the documents': '/documents',
    'show documents': '/documents',
    'negotiations': '/negotiations',
    'negotiation': '/negotiations',
    'go to negotiations': '/negotiations',
    'show negotiations': '/negotiations',
    'analytics': '/analytics',
    'esg': '/analytics',
    'analyze esg': '/analytics',
    'analyze esg impact': '/analytics',
    'dashboard': '/dashboard',
    'home': '/dashboard',
    'go home': '/dashboard',
    'go to dashboard': '/dashboard',
};

export function VoiceCommander() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [feedback, setFeedback] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
            const recog = new SpeechRecognitionAPI();
            recog.continuous = false;
            recog.interimResults = true;
            recog.lang = 'en-US';

            recog.onresult = (event: any) => {
                const current = event.resultIndex;
                const transcriptResult = event.results[current][0].transcript.toLowerCase().trim();
                setTranscript(transcriptResult);

                // Check if this is a final result
                if (event.results[current].isFinal) {
                    // Try to match a command
                    const matchedRoute = findMatchingRoute(transcriptResult);
                    if (matchedRoute) {
                        setFeedback(`Navigating to ${matchedRoute}...`);
                        audioManager.playSuccess(); // Play success sound
                        setTimeout(() => {
                            setIsOpen(false);
                            setTranscript("");
                            setFeedback(null);
                            navigate(matchedRoute);
                        }, 600);
                    } else {
                        setFeedback("Command not recognized. Try: 'Go to negotiations'");
                        setTimeout(() => setFeedback(null), 2000);
                    }
                    setIsListening(false);
                }
            };

            recog.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setFeedback(`Error: ${event.error}`);
                audioManager.playError(); // Play error sound
                setIsListening(false);
                setTimeout(() => {
                    setFeedback(null);
                    setIsOpen(false);
                }, 1500);
            };

            recog.onend = () => {
                setIsListening(false);
            };

            setRecognition(recog);
        }
    }, [navigate]);

    const findMatchingRoute = (text: string): string | null => {
        // Direct match
        if (COMMAND_ROUTES[text]) {
            return COMMAND_ROUTES[text];
        }
        // Partial match - check if any key is included in the text
        for (const key in COMMAND_ROUTES) {
            if (text.includes(key)) {
                return COMMAND_ROUTES[key];
            }
        }
        return null;
    };

    const startListening = useCallback(() => {
        if (!recognition) {
            // Fallback: Use simulated voice if no browser support
            setIsOpen(true);
            setTranscript("(Voice not supported - using demo mode)");
            setTimeout(() => {
                setTranscript("Go to negotiations");
                setTimeout(() => {
                    setIsOpen(false);
                    navigate('/negotiations');
                }, 800);
            }, 1000);
            return;
        }

        setIsOpen(true);
        setIsListening(true);
        setTranscript("");
        setFeedback(null);

        try {
            recognition.start();
        } catch (e) {
            console.error('Could not start recognition:', e);
        }
    }, [recognition, navigate]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
        }
        setIsListening(false);
    }, [recognition]);

    const closeOverlay = () => {
        stopListening();
        setIsOpen(false);
        setTranscript("");
        setFeedback(null);
    };

    if (!isOpen) {
        return (
            <button
                onClick={startListening}
                className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-900 shadow-glow flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95 group"
                title="Voice Commander"
            >
                <FiMic size={32} className="group-hover:animate-bounce" />
            </button>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-900/90 backdrop-blur-md animate-fade-in"
            onClick={closeOverlay}
        >
            {/* Instructional Text */}
            <p className="text-slate-400 text-sm mb-6">Say a command like "Go to negotiations" or "Show documents"</p>

            {/* Main Voice UI */}
            <div
                className="bg-navy-800 border border-gold-500/30 rounded-2xl px-12 py-8 flex flex-col items-center gap-6 shadow-2xl min-w-[400px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Mic Button */}
                <button
                    onClick={isListening ? stopListening : startListening}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isListening
                        ? 'bg-red-500 animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.5)]'
                        : 'bg-gold-500 hover:bg-gold-400'
                        }`}
                >
                    {isListening ? <FiMicOff size={40} className="text-white" /> : <FiMic size={40} className="text-navy-900" />}
                </button>

                {/* Status */}
                <div className="text-center min-h-[60px]">
                    {isListening && !transcript && (
                        <p className="text-xl text-gold-400 animate-pulse">Listening...</p>
                    )}
                    {transcript && (
                        <p className="text-2xl font-medium text-white font-mono">"{transcript}"</p>
                    )}
                    {feedback && (
                        <p className="text-lg text-green-400 mt-2">{feedback}</p>
                    )}
                </div>

                {/* Available Commands */}
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {['Documents', 'Negotiations', 'Analytics', 'Dashboard'].map((cmd) => (
                        <span key={cmd} className="px-3 py-1 bg-navy-700 text-slate-400 text-xs rounded-full border border-white/10">
                            {cmd}
                        </span>
                    ))}
                </div>
            </div>

            <p className="text-slate-500 text-xs mt-6">Click anywhere to close</p>
        </div>
    );
}
