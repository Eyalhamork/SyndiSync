// src/components/common/AnimatedCounter.tsx
// Animated number counter that counts up from 0 to target value

import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
    value: number;
    duration?: number; // in milliseconds
    prefix?: string;
    suffix?: string;
    decimals?: number;
    className?: string;
    onComplete?: () => void;
}

// Easing function for smooth animation
function easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function AnimatedCounter({
    value,
    duration = 2000,
    prefix = '',
    suffix = '',
    decimals = 0,
    className = '',
    onComplete
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (value === 0) {
            setDisplayValue(0);
            return;
        }

        const animate = (timestamp: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = timestamp;
            }

            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);

            setDisplayValue(easedProgress * value);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
                onComplete?.();
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [value, duration, onComplete]);

    const formattedValue = displayValue.toFixed(decimals);

    return (
        <span className={className}>
            {prefix}{parseFloat(formattedValue).toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            })}{suffix}
        </span>
    );
}

// Common variants
export function CurrencyCounter({
    value,
    className = '',
    duration = 2000
}: {
    value: number;
    className?: string;
    duration?: number;
}) {
    // Format as compact currency (e.g., $2.06M)
    const formatCompactCurrency = (num: number): { value: number; suffix: string } => {
        if (num >= 1000000) {
            return { value: num / 1000000, suffix: 'M' };
        } else if (num >= 1000) {
            return { value: num / 1000, suffix: 'K' };
        }
        return { value: num, suffix: '' };
    };

    const { value: displayNum, suffix } = formatCompactCurrency(value);

    return (
        <AnimatedCounter
            value={displayNum}
            prefix="$"
            suffix={suffix}
            decimals={2}
            duration={duration}
            className={className}
        />
    );
}

export function HoursCounter({
    value,
    className = '',
    duration = 2000
}: {
    value: number;
    className?: string;
    duration?: number;
}) {
    return (
        <AnimatedCounter
            value={value}
            suffix=" hrs"
            decimals={0}
            duration={duration}
            className={className}
        />
    );
}

export function PercentageCounter({
    value,
    className = '',
    duration = 1500
}: {
    value: number;
    className?: string;
    duration?: number;
}) {
    return (
        <AnimatedCounter
            value={value}
            suffix="%"
            decimals={0}
            duration={duration}
            className={className}
        />
    );
}

export default AnimatedCounter;
