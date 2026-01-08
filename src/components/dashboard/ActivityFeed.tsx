// src/components/dashboard/ActivityFeed.tsx
import { useEffect, useState } from 'react';
import useAppStore from '../../store/appStore';

interface ActivityItem {
  id: string;
  timestamp: string;
  user: string;
  action: 'commented' | 'approved' | 'rejected' | 'uploaded' | 'generated' | 'resolved' | 'created' | 'joined' | 'requested';
  target: string;
  description: string;
  icon: string;
}

export function ActivityFeed() {
  const { activities, addActivity } = useAppStore();
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time updates for demo
  useEffect(() => {
    if (isLive && activities.length < 10) {
      const demoActivities: ActivityItem[] = [
        {
          id: `act_${Date.now()}_1`,
          timestamp: new Date().toISOString(),
          user: 'Sarah Chen (JP Morgan)',
          action: 'commented',
          target: 'Section 7.1 - Financial Covenants',
          description: 'Proposed alternative leverage ratio structure',
          icon: 'comment'
        },
        {
          id: `act_${Date.now()}_2`,
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          user: 'AI Assistant',
          action: 'resolved',
          target: 'Conflict: Interest Rate Margin',
          description: 'Proposed compromise: SOFR + 425 bps',
          icon: 'ai-sparkle'
        },
        {
          id: `act_${Date.now()}_3`,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'Michael Thompson (BofA)',
          action: 'approved',
          target: 'Article III - Representations',
          description: 'Approved with no changes',
          icon: 'check-circle'
        },
        {
          id: `act_${Date.now()}_4`,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: 'System',
          action: 'generated',
          target: 'Facility Agreement v1',
          description: 'Generated 287-page document in 43 seconds',
          icon: 'document'
        },
        {
          id: `act_${Date.now()}_5`,
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          user: 'John Morrison (Global IB)',
          action: 'uploaded',
          target: 'Term Sheet',
          description: 'Uploaded TechCorp LBO Term Sheet',
          icon: 'upload'
        },
        {
          id: `act_${Date.now()}_6`,
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          user: 'David Park (Wells Fargo)',
          action: 'joined',
          target: 'Deal Syndicate',
          description: 'Joined as syndicate member ($50M commitment)',
          icon: 'user-plus'
        },
        {
          id: `act_${Date.now()}_7`,
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          user: 'Emily Rodriguez (Citibank)',
          action: 'requested',
          target: 'Financial Projections',
          description: 'Requested additional covenant sensitivity analysis',
          icon: 'chart-bar'
        }
      ];

      demoActivities.forEach(activity => {
        if (!activities.find(a => a.description === activity.description)) {
          addActivity(activity);
        }
      });
    }
  }, [isLive]);

  const getIcon = (action: string) => {
    switch (action) {
      case 'commented':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        );
      case 'approved':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'resolved':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        );
      case 'generated':
        return (
          <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        );
      case 'uploaded':
        return (
          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'joined':
        return (
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        );
      case 'requested':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900">Activity Feed</h3>
          {isLive && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-xs font-medium text-green-600">Live</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {activities.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 font-medium mb-1">No activity yet</p>
            <p className="text-sm text-gray-500">Activity will appear here as your deal progresses</p>
          </div>
        ) : (
          activities.map((activity, idx) => (
            <div
              key={activity.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
              style={{
                animation: idx < 3 ? 'slideIn 0.3s ease-out' : 'none',
                animationDelay: `${idx * 0.1}s`
              }}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getIcon(activity.action)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {activity.user}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="capitalize">{activity.action}</span> on{' '}
                    <span className="font-medium text-gray-900">{activity.target}</span>
                  </p>
                  
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {activities.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View all activity →
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
