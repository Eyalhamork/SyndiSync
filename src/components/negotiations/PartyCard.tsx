// src/components/negotiations/PartyCard.tsx
import type { Party, Position } from '../../types';

interface PartyCardProps {
  party: Party;
  position?: Position;
  hasConflict?: boolean;
  onClick?: () => void;
}

export function PartyCard({ party, position, hasConflict = false, onClick }: PartyCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border-2 p-6 transition-all duration-200 ${
        hasConflict
          ? 'border-amber-400 shadow-amber-100 shadow-lg'
          : 'border-gray-200 hover:border-gray-300'
      } ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={party.logo_url}
            alt={party.name}
            className="w-12 h-12 rounded-full border-2 border-gray-200"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{party.name}</h3>
            <p className="text-sm text-gray-500">{party.role}</p>
          </div>
        </div>
        {hasConflict && (
          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Conflict
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Commitment</span>
          <span className="font-medium text-gray-900">{formatCurrency(party.commitment)}</span>
        </div>

        {position && (
          <>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Position
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-600 mb-2">{position.position}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{position.rationale}</p>
            </div>
          </>
        )}

        <div className="pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Max Leverage:</span>
              <span className="font-medium text-gray-700">{party.preferences.leverage_max}x</span>
            </div>
            <div className="flex justify-between">
              <span>Min Coverage:</span>
              <span className="font-medium text-gray-700">{party.preferences.interest_coverage_min}x</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <p className="font-medium">{party.contact.name}</p>
          <p>{party.contact.title}</p>
        </div>
        {party.preferences.esg_requirements && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            ESG
          </span>
        )}
      </div>
    </div>
  );
}
