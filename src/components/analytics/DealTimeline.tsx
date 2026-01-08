// src/components/analytics/DealTimeline.tsx
interface TimelineEvent {
  milestone: string;
  date: string;
  status: 'completed' | 'in_progress' | 'pending';
  duration_days: number;
}

export function DealTimeline() {
  const events: TimelineEvent[] = [
    {
      milestone: "Term Sheet Uploaded",
      date: "Jan 5, 2025",
      status: "completed",
      duration_days: 0
    },
    {
      milestone: "Document Generation",
      date: "Jan 12, 2025",
      status: "completed",
      duration_days: 0.01 // 43 seconds
    },
    {
      milestone: "Syndicate Review",
      date: "Jan 12-14, 2025",
      status: "in_progress",
      duration_days: 2
    },
    {
      milestone: "Negotiation & Revisions",
      date: "Jan 14-16, 2025",
      status: "pending",
      duration_days: 2
    },
    {
      milestone: "Final Approvals",
      date: "Jan 16, 2025",
      status: "pending",
      duration_days: 0.5
    },
    {
      milestone: "Execution",
      date: "Jan 17, 2025",
      status: "pending",
      duration_days: 0.5
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'in_progress':
        return (
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
            <svg className="w-6 h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  // const totalDays = events.reduce((sum, event) => sum + event.duration_days, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Deal Timeline</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Total Duration:</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded-full text-sm">
              ~3 days
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600">TechCorp LBO Financing - From upload to execution</p>
      </div>

      {/* Comparison Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6 border-2 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-green-900 text-lg">93% Faster</p>
              <p className="text-sm text-green-700">vs. traditional 6-week process</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-green-600">3 days</p>
            <p className="text-xs text-gray-600">vs. 42 days</p>
          </div>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gray-300"></div>

        {/* Events */}
        <div className="space-y-6">
          {events.map((event, idx) => (
            <div key={idx} className="relative flex items-start gap-4">
              {/* Icon */}
              <div className="relative z-10">
                {getStatusIcon(event.status)}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className={`rounded-lg border-2 p-4 ${getStatusColor(event.status)}`}>
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{event.milestone}</h4>
                    <span className="px-2 py-1 bg-white rounded text-xs font-medium">
                      {event.duration_days < 1 
                        ? event.duration_days === 0 
                          ? 'Instant' 
                          : `${Math.round(event.duration_days * 24)}h`
                        : `${event.duration_days}d`
                      }
                    </span>
                  </div>
                  <p className="text-sm opacity-75">{event.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-blue-600">40%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: '40%' }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>2 of 6 milestones completed</span>
          <span>Est. completion: Jan 17</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-gray-700">Started</span>
          </div>
          <p className="text-sm font-bold text-gray-900">Jan 5</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-blue-700">In Progress</span>
          </div>
          <p className="text-sm font-bold text-blue-900">Day 2</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-gray-700">Target</span>
          </div>
          <p className="text-sm font-bold text-gray-900">Jan 17</p>
        </div>
      </div>
    </div>
  );
}
