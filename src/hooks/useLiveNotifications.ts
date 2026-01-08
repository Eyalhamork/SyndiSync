// src/hooks/useLiveNotifications.ts
// Simulates live activity with timed toast notifications

import { useEffect, useRef } from 'react';
import useAppStore from '../store/appStore';

interface LiveNotification {
    delay: number; // milliseconds before showing
    type: 'info' | 'success';
    title: string;
    message?: string;
}

const LIVE_NOTIFICATIONS: LiveNotification[] = [
    {
        delay: 8000,
        type: 'info',
        title: 'Sarah Chen commented',
        message: 'New comment on Section 7.1 - Financial Covenants'
    },
    {
        delay: 18000,
        type: 'success',
        title: 'Wells Fargo accepted proposal',
        message: 'Leverage covenant compromise approved'
    },
    {
        delay: 30000,
        type: 'info',
        title: 'Document revision ready',
        message: 'TechCorp Facility Agreement v2 generated'
    },
    {
        delay: 45000,
        type: 'success',
        title: 'AI Analysis complete',
        message: 'ESG compliance score updated to 94/100'
    },
    {
        delay: 60000,
        type: 'info',
        title: 'JP Morgan reviewing',
        message: 'Section 8.3 - Restricted Payments under review'
    }
];

export function useLiveNotifications(enabled: boolean = true) {
    const showToast = useAppStore((state) => state.showToast);
    const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        if (!enabled) return;

        // Clear any existing timeouts
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        // Schedule notifications
        LIVE_NOTIFICATIONS.forEach((notification) => {
            const timeout = setTimeout(() => {
                showToast(notification.type, notification.title, notification.message);
            }, notification.delay);

            timeoutsRef.current.push(timeout);
        });

        return () => {
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
        };
    }, [enabled, showToast]);
}

// Hook for one-time activity simulation (e.g., after an action)
export function useActivitySimulation() {
    const showToast = useAppStore((state) => state.showToast);
    const addActivity = useAppStore((state) => state.addActivity);

    const simulateActivity = (type: 'comment' | 'resolution' | 'update') => {
        const activities = {
            comment: {
                title: 'New comment added',
                message: 'Bank of America responded to your proposal',
                activity: {
                    id: `act_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    user: 'Michael Thompson (BoFA)',
                    action: 'commented' as const,
                    target: 'Section 7.1',
                    description: 'Agrees with modified leverage structure',
                    icon: 'comment' as const
                }
            },
            resolution: {
                title: 'Conflict resolved!',
                message: '4 of 5 banks have accepted the AI proposal',
                activity: {
                    id: `act_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    user: 'AI Assistant',
                    action: 'resolved' as const,
                    target: 'Leverage Covenant',
                    description: '85% acceptance achieved',
                    icon: 'ai-sparkle' as const
                }
            },
            update: {
                title: 'Document updated',
                message: 'Financial covenants section revised',
                activity: {
                    id: `act_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    user: 'System',
                    action: 'generated' as const,
                    target: 'TechCorp Facility Agreement',
                    description: 'Version 2 generated',
                    icon: 'document' as const
                }
            }
        };

        const { title, message, activity } = activities[type];
        showToast('success', title, message);
        addActivity(activity);
    };

    return { simulateActivity };
}

export default useLiveNotifications;
