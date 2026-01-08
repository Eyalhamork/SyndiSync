// src/components/negotiations/AIResolutionPanel.tsx
import { useState } from 'react';
import type { AIResolution } from '../../types';
import useAppStore from '../../store/appStore';

interface AIResolutionPanelProps {
  resolution: AIResolution;
  isAnalyzing: boolean;
  negotiationId?: string;
  onResolutionAccepted?: () => void;
}

export function AIResolutionPanel({ resolution, isAnalyzing, negotiationId, onResolutionAccepted }: AIResolutionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [modifiedValue, setModifiedValue] = useState('5.0');
  const { updateNegotiation, addActivity, showToast } = useAppStore();

  const handleAccept = () => {
    if (negotiationId) {
      // Update negotiation status to resolved
      updateNegotiation(negotiationId, {
        status: 'resolved',
        selected_resolution: resolution.resolution_text,
        resolution_rationale: resolution.rationale
      });

      // Add activity
      addActivity({
        id: `activity_${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'John Morrison',
        action: 'approved',
        target: 'Total Net Leverage Ratio',
        description: 'Accepted AI-proposed resolution: 5.0x leverage ratio with step-down',
        icon: 'check-circle'
      });

      // Show success toast
      showToast(
        'success',
        'Resolution Accepted!',
        'The AI-proposed covenant of 5.0x leverage ratio with step-down to 4.75x has been accepted. Document will be updated automatically and all parties will be notified.'
      );

      // Call the callback to hide the panel
      if (onResolutionAccepted) {
        onResolutionAccepted();
      }
    }
  };

  const handleModify = () => {
    setShowModifyDialog(true);
  };

  const handleSubmitModification = () => {
    if (negotiationId && modifiedValue) {
      // Update status back to discussing
      updateNegotiation(negotiationId, {
        status: 'discussing'
      });

      addActivity({
        id: `activity_${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'John Morrison',
        action: 'commented',
        target: 'Total Net Leverage Ratio',
        description: `Modified AI resolution to ${modifiedValue}x leverage ratio`,
        icon: 'pencil'
      });

      setShowModifyDialog(false);
      showToast(
        'info',
        'Resolution Modified!',
        `Updated covenant value to ${modifiedValue}x leverage ratio. The modification has been sent to all parties for review.`
      );
    }
  };

  if (isAnalyzing) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Analyzing Conflict...</h3>
          <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
            AI is analyzing party positions, market data, and precedents to propose an optimal resolution
          </p>
          <div className="mt-4 flex gap-2">
            {['Analyzing positions', 'Retrieving market data', 'Generating proposal'].map((step, idx) => (
              <div
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full animate-pulse"
                style={{ animationDelay: `${idx * 0.3}s` }}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const acceptancePercentage = Math.round(resolution.predicted_acceptance * 100);
  const getAcceptanceColor = () => {
    if (acceptancePercentage >= 80) return 'text-green-600 bg-green-100';
    if (acceptancePercentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI-Proposed Resolution</h3>
              <p className="text-sm text-blue-100">Analysis complete</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold ${getAcceptanceColor()}`}>
            {acceptancePercentage}% Predicted Acceptance
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Resolution Text */}
        <div className="bg-white rounded-lg p-5 border-2 border-blue-200 mb-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Proposed Covenant Language</h4>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <span>Collapse</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Expand</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
          {isExpanded && (
            <p className="text-sm text-gray-900 leading-relaxed font-mono bg-gray-50 p-4 rounded border border-gray-200">
              {resolution.resolution_text}
            </p>
          )}
        </div>

        {/* Rationale */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            AI Analysis
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">{resolution.rationale}</p>
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Pros */}
          <div className="bg-white rounded-lg p-5 border border-green-200">
            <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Strengths
            </h4>
            <ul className="space-y-2">
              {resolution.pros.map((pro, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="bg-white rounded-lg p-5 border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Considerations
            </h4>
            <ul className="space-y-2">
              {resolution.cons.map((con, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Affected Clauses */}
        {resolution.affected_clauses && resolution.affected_clauses.length > 0 && (
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Affected Document Sections
            </h4>
            <div className="flex flex-wrap gap-2">
              {resolution.affected_clauses.map((clause, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                >
                  {clause}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Accept Resolution
          </button>
          <button
            onClick={handleModify}
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modify
          </button>
        </div>
      </div>

      {/* Modify Dialog */}
      {showModifyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Modify AI Resolution</h3>
            <p className="text-sm text-gray-600 mb-4">
              Adjust the proposed leverage ratio. The AI suggested 5.0x based on market data.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leverage Ratio
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.25"
                  value={modifiedValue}
                  onChange={(e) => setModifiedValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 5.0"
                />
                <span className="absolute right-3 top-2.5 text-gray-500">x</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Market median: 5.1x | Your position: 5.0x
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModifyDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitModification}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Modification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
