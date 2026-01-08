// src/components/negotiations/ConflictDetail.tsx
import type { Negotiation, Party } from '../../types';

interface ConflictDetailProps {
  negotiation: Negotiation;
  parties: Party[];
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: () => void;
}

export function ConflictDetail({ negotiation, parties, isOpen, onClose, onAnalyze }: ConflictDetailProps) {
  if (!isOpen) return null;

  const getPartyInfo = (partyName: string) => {
    return parties.find(p => p.name === partyName);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Conflict Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">{negotiation.clause_reference}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Conflict Banner */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">CONFLICT DETECTED</h3>
                <p className="mt-1 text-sm text-amber-700">{negotiation.conflict_description}</p>
              </div>
            </div>
          </div>

          {/* Party Positions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Party Positions</h3>
            <div className="space-y-4">
              {negotiation.positions.map((position, idx) => {
                const party = getPartyInfo(position.party);
                return (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      {party && (
                        <img
                          src={party.logo_url}
                          alt={position.party}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{position.party}</h4>
                          {party && (
                            <span className="text-xs text-gray-500">{party.role}</span>
                          )}
                        </div>
                        <div className="bg-white rounded px-3 py-2 border border-blue-200 mb-2">
                          <p className="text-sm font-medium text-blue-600">{position.position}</p>
                        </div>
                        <p className="text-sm text-gray-600">{position.rationale}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Market Context */}
          {negotiation.market_context && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Context</h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">25th Percentile</p>
                    <p className="text-lg font-bold text-gray-900">{negotiation.market_context.p25}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Median</p>
                    <p className="text-lg font-bold text-blue-600">{negotiation.market_context.median}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">75th Percentile</p>
                    <p className="text-lg font-bold text-gray-900">{negotiation.market_context.p75}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Sample Size</p>
                    <p className="text-lg font-bold text-gray-900">{negotiation.market_context.sample_size}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-blue-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">Recent Comparable Deals:</p>
                  <ul className="space-y-1">
                    {negotiation.market_context.comparable_deals.map((deal, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {deal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={onAnalyze}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Analyze with AI
          </button>
        </div>
      </div>
    </div>
  );
}
