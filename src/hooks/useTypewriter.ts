// src/hooks/useTypewriter.ts
// Custom hook for streaming text effect (like ChatGPT)

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTypewriterOptions {
    speed?: number; // milliseconds per character
    delay?: number; // delay before starting
    onComplete?: () => void;
}

interface UseTypewriterReturn {
    displayText: string;
    isTyping: boolean;
    isComplete: boolean;
    start: () => void;
    reset: () => void;
}

export function useTypewriter(
    fullText: string,
    options: UseTypewriterOptions = {}
): UseTypewriterReturn {
    const { speed = 20, delay = 0, onComplete } = options;

    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [shouldStart, setShouldStart] = useState(false);

    const indexRef = useRef(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const cleanup = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const reset = useCallback(() => {
        cleanup();
        setDisplayText('');
        setIsTyping(false);
        setIsComplete(false);
        setShouldStart(false);
        indexRef.current = 0;
    }, [cleanup]);

    const start = useCallback(() => {
        reset();
        setShouldStart(true);
    }, [reset]);

    useEffect(() => {
        if (!shouldStart || !fullText) return;

        const startTyping = () => {
            setIsTyping(true);

            intervalRef.current = setInterval(() => {
                if (indexRef.current < fullText.length) {
                    setDisplayText(fullText.slice(0, indexRef.current + 1));
                    indexRef.current++;
                } else {
                    cleanup();
                    setIsTyping(false);
                    setIsComplete(true);
                    onComplete?.();
                }
            }, speed);
        };

        const timeoutId = setTimeout(startTyping, delay);

        return () => {
            clearTimeout(timeoutId);
            cleanup();
        };
    }, [fullText, speed, delay, shouldStart, onComplete, cleanup]);

    // Auto-start on mount if delay is 0
    useEffect(() => {
        if (fullText && delay === 0) {
            start();
        }
    }, [fullText]); // eslint-disable-line react-hooks/exhaustive-deps

    return { displayText, isTyping, isComplete, start, reset };
}

// Simpler auto-start version
export function useAutoTypewriter(
    fullText: string,
    speed: number = 20
): { displayText: string; isComplete: boolean } {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!fullText) return;

        let index = 0;
        setDisplayText('');
        setIsComplete(false);

        const interval = setInterval(() => {
            if (index < fullText.length) {
                setDisplayText(fullText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
                setIsComplete(true);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [fullText, speed]);

    return { displayText, isComplete };
}

export default useTypewriter;
