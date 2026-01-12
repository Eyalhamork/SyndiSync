// src/components/common/PageTransition.tsx
// Smooth page transition wrapper using Framer Motion

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 12,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: {
            duration: 0.2,
            ease: 'easeIn',
        },
    },
};

export function PageTransition({ children, className = '' }: PageTransitionProps) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Stagger container for animating lists of items
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

// Individual item animation
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        }
    },
};

// Fade in animation
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { duration: 0.5 }
    },
};

// Scale in animation (good for modals, success icons)
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
        }
    },
};

// Slide in from right (for panels, sidebars)
export const slideInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 25,
        }
    },
};

// Slide up animation
export const slideUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        }
    },
};

export default PageTransition;
