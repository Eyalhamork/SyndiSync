// src/components/analytics/ROICalculator.tsx
import { useState, useEffect } from 'react';

interface ROICalculatorProps {
  dealSize?: number;
}

export function ROICalculator({ dealSize = 450000000 }: ROICalculatorProps) {
  const [timeSaved, setTimeSaved] = useState(0);
  const [costSaved, setCostSaved] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Traditional process costs
  const traditional = {
    timeline_weeks: 6,
    legal_fees: 850000,
    internal_costs: 325000,
    opportunity_cost: 1200000,
    total_cost: 2375000
  };

  // SyndiSync process costs
  const syndisync = {
    timeline_days: 3,
    legal_fees: 150000,
    internal_costs: 50000,
    subscription_fee: 15000,
    opportunity_cost: 100000,
    total_cost: 315000
  };

  const savings = {
    time_saved_days: (traditional.timeline_weeks * 7) - syndisync.timeline_days,
    cost_saved: traditional.total_cost - syndisync.total_cost,
    roi_percentage: Math.round(((traditional.total_cost - syndisync.total_cost) / syndisync.total_cost) * 100)
  };

  // Animated counter effect
  useEffect(() => {
    if (showResults) {
      const duration = 2000;
      const steps = 60;
      const timeIncrement = savings.time_saved_days / steps;
      const costIncrement = savings.cost_saved / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        setTimeSaved(Math.round(timeIncrement * currentStep));
        setCostSaved(Math.round(costIncrement * currentStep));

        if (currentStep >= steps) {
          clearInterval(interval);
          setTimeSaved(savings.time_saved_days);
          setCostSaved(savings.cost_saved);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [showResults]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ROI Calculator</h2>
        <p className="text-gray-600">See how much you save with SyndiSync AI</p>
      </div>

      {/* Deal Size Input */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Deal Size
        </label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">$</span>
          <input
            type="text"
            value={dealSize.toLocaleString()}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-semibold text-gray-900"
          />
        </div>
      </div>

      {/* Calculate Button */}
      {!showResults && (
        <button
          onClick={() => setShowResults(true)}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calculate Savings
        </button>
      )}

      {/* Results */}
      {showResults && (
        <div className="space-y-6">
          {/* Big Numbers */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-green-300 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-600">Time Saved</span>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-1">
                {timeSaved}
              </div>
              <div className="text-sm text-gray-600">days faster</div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-green-300 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-600">Cost Saved</span>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-1">
                {formatCurrency(costSaved)}
              </div>
              <div className="text-sm text-gray-600">per deal</div>
            </div>
          </div>

          {/* ROI Metric */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white text-center shadow-xl">
            <div className="text-sm font-medium mb-2 opacity-90">Return on Investment</div>
            <div className="text-5xl font-black mb-2">{savings.roi_percentage}%</div>
            <div className="text-sm opacity-90">ROI in first deal</div>
          </div>

          {/* Breakdown Comparison */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
            <div className="space-y-4">
              {/* Traditional */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Traditional Process</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(traditional.total_cost)}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>External Legal Fees</span>
                    <span>{formatCurrency(traditional.legal_fees)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Internal Costs</span>
                    <span>{formatCurrency(traditional.internal_costs)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Opportunity Cost</span>
                    <span>{formatCurrency(traditional.opportunity_cost)}</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>

              {/* SyndiSync */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">With SyndiSync</span>
                  <span className="text-sm font-bold text-green-600">{formatCurrency(syndisync.total_cost)}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Legal Review</span>
                    <span>{formatCurrency(syndisync.legal_fees)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Internal Coordination</span>
                    <span>{formatCurrency(syndisync.internal_costs)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>SyndiSync Subscription</span>
                    <span>{formatCurrency(syndisync.subscription_fee)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Opportunity Cost</span>
                    <span>{formatCurrency(syndisync.opportunity_cost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Ready to transform your deal process?
                </p>
                <p className="text-xs text-blue-700">
                  Start closing deals in 72 hours instead of 6 weeks. Schedule a demo to see SyndiSync in action.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
