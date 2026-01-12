import { useState, useEffect, useCallback } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../../lib/audio';
import {
    DocumentTextIcon,
    ScaleIcon,
    ChartBarIcon,
    HomeIcon,
} from '@heroicons/react/24/outline';

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

const COMMAND_LIST = [
    { label: 'Documents', icon: DocumentTextIcon, color: 'from-purple-500 to-pink-500', glow: 'hover-glow-purple' },
    { label: 'Negotiations', icon: ScaleIcon, color: 'from-cyan-500 to-blue-500', glow: 'hover-glow-cyan' },
    { label: 'Analytics', icon: ChartBarIcon, color: 'from-emerald-500 to-teal-500', glow: 'hover-glow-emerald' },
    { label: 'Dashboard', icon: HomeIcon, color: 'from-amber-500 to-orange-500', glow: 'hover-glow-gold' },
];

// Floating particles for the background
function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/20"
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                        scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                        y: [null, '-20%'],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: Math.random() * 4 + 4,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </div>
    );
}

// Sound wave visualization
function SoundWave({ isActive }: { isActive: boolean }) {
    return (
        <div className="flex items-center justify-center gap-1 h-8">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-full"
                    animate={isActive ? {
                        height: [8, 24, 8],
                    } : {
                        height: 8,
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: isActive ? Infinity : 0,
                        delay: i * 0.1,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

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
            <motion.button
                onClick={startListening}
                className="fixed bottom-8 right-8 w-16 h-16 rounded-full z-50 flex items-center justify-center group"
                title="Voice Commander"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Animated glow rings */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-purple to-accent-cyan opacity-40"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.1, 0.4],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple opacity-30"
                    animate={{
                        scale: [1.1, 1.4, 1.1],
                        opacity: [0.3, 0.05, 0.3],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                    }}
                />
                {/* Main button */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent-purple via-accent-indigo to-accent-cyan flex items-center justify-center shadow-lg shadow-accent-purple/30 group-hover:shadow-accent-cyan/40 transition-shadow">
                    <FiMic size={28} className="text-white group-hover:scale-110 transition-transform" />
                </div>
            </motion.button>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-950/95 backdrop-blur-xl mesh-gradient"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeOverlay}
            >
                {/* Floating Particles */}
                <FloatingParticles />

                {/* Animated gradient orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-purple/20 rounded-full blur-[100px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-cyan/20 rounded-full blur-[100px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -30, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />

                {/* Instructional Text */}
                <motion.p
                    className="text-slate-400 text-sm mb-8 relative z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Say a command like "Go to negotiations" or "Show documents"
                </motion.p>

                {/* Main Voice UI Card */}
                <motion.div
                    className="glass-card-premium rounded-3xl px-12 py-10 flex flex-col items-center gap-6 min-w-[450px] relative overflow-hidden gradient-border"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {/* Mic Button with animated rings */}
                    <div className="relative">
                        {/* Animated pulse rings when listening */}
                        {isListening && (
                            <>
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-accent-rose/30"
                                    animate={{
                                        scale: [1, 2],
                                        opacity: [0.5, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeOut',
                                    }}
                                />
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-accent-rose/30"
                                    animate={{
                                        scale: [1, 2],
                                        opacity: [0.5, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeOut',
                                        delay: 0.5,
                                    }}
                                />
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-accent-rose/30"
                                    animate={{
                                        scale: [1, 2],
                                        opacity: [0.5, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeOut',
                                        delay: 1,
                                    }}
                                />
                            </>
                        )}

                        <motion.button
                            onClick={isListening ? stopListening : startListening}
                            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all ${isListening
                                    ? 'bg-gradient-to-br from-accent-rose to-red-600 shadow-glow-rose'
                                    : 'bg-gradient-to-br from-accent-purple via-accent-indigo to-accent-cyan shadow-glow-purple hover:shadow-glow-cyan'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isListening ? (
                                <FiMicOff size={44} className="text-white" />
                            ) : (
                                <FiMic size={44} className="text-white" />
                            )}
                        </motion.button>
                    </div>

                    {/* Sound Wave Visualization */}
                    <SoundWave isActive={isListening} />

                    {/* Status */}
                    <div className="text-center min-h-[70px]">
                        {isListening && !transcript && (
                            <motion.p
                                className="text-xl text-gradient-purple-cyan font-medium"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                Listening...
                            </motion.p>
                        )}
                        {transcript && (
                            <motion.p
                                className="text-2xl font-semibold text-white font-mono"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                "{transcript}"
                            </motion.p>
                        )}
                        {feedback && (
                            <motion.p
                                className="text-lg text-accent-emerald mt-3 flex items-center justify-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <span className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse" />
                                {feedback}
                            </motion.p>
                        )}
                    </div>

                    {/* Available Commands with gradient colors */}
                    <div className="flex flex-wrap gap-3 justify-center mt-2">
                        {COMMAND_LIST.map((cmd, i) => (
                            <motion.button
                                key={cmd.label}
                                className={`group flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900/60 border border-white/5 hover:border-white/20 transition-all ${cmd.glow}`}
                                onClick={() => {
                                    setTranscript(cmd.label.toLowerCase());
                                    const route = findMatchingRoute(cmd.label.toLowerCase());
                                    if (route) {
                                        setFeedback(`Navigating to ${route}...`);
                                        audioManager.playSuccess();
                                        setTimeout(() => {
                                            setIsOpen(false);
                                            navigate(route);
                                        }, 600);
                                    }
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${cmd.color} flex items-center justify-center`}>
                                    <cmd.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                    {cmd.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <motion.p
                    className="text-slate-600 text-xs mt-8 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Click anywhere to close
                </motion.p>
            </motion.div>
        </AnimatePresence>
    );
}
