// src/components/negotiations/CovenantBenchmark.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface CovenantBenchmarkProps {
  dealValue?: number;
}

export function CovenantBenchmark({ dealValue = 5.0 }: CovenantBenchmarkProps) {
  // Market data from demo-data.ts
  const data = [
    {
      name: '10th %ile',
      value: 4.0,
      fill: '#e5e7eb'
    },
    {
      name: '25th %ile',
      value: 4.6,
      fill: '#d1d5db'
    },
    {
      name: 'Median',
      value: 5.1,
      fill: '#3b82f6'
    },
    {
      name: '75th %ile',
      value: 5.6,
      fill: '#d1d5db'
    },
    {
      name: '90th %ile',
      value: 6.2,
      fill: '#e5e7eb'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-sm text-blue-600 font-medium">{payload[0].value}x leverage</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Market Covenant Benchmarks</h3>
        <p className="text-sm text-gray-600">Total Net Leverage Ratio - Manufacturing LBOs (Q4 2024)</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span className="text-xs text-gray-600">Market Median</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded"></div>
            <span className="text-xs text-gray-600">Your Deal Position</span>
          </div>
          <div className="ml-auto text-xs text-gray-500">
            Sample: 147 deals
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            label={{ value: 'Leverage Ratio', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            domain={[0, 7]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={dealValue} 
            stroke="#ef4444" 
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{ 
              value: `Your Deal: ${dealValue}x`, 
              position: 'right',
              fill: '#ef4444',
              fontSize: 12,
              fontWeight: 'bold'
            }}
          />
          <Bar 
            dataKey="value" 
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Analysis Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-blue-900">Position</span>
          </div>
          <p className="text-lg font-bold text-blue-600">{dealValue}x</p>
          <p className="text-xs text-blue-700 mt-1">Within market range</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-green-900">Percentile</span>
          </div>
          <p className="text-lg font-bold text-green-600">48th</p>
          <p className="text-xs text-green-700 mt-1">Below median</p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-amber-900">Trend</span>
          </div>
          <p className="text-lg font-bold text-amber-600">Tightening</p>
          <p className="text-xs text-amber-700 mt-1">Due to rate environment</p>
        </div>
      </div>

      {/* Recent Comparables */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Comparable Deals</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">IndustrialTech Corp (Q3 2024)</span>
            <span className="font-semibold text-gray-900">5.2x</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">ManuCo Holdings (Q4 2024)</span>
            <span className="font-semibold text-gray-900">4.8x</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Precision Industries (Q1 2025)</span>
            <span className="font-semibold text-green-600">5.0x with equity cure ✓</span>
          </div>
        </div>
      </div>

      {/* Source Attribution */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <span>Data source: LMA Market Intelligence Database</span>
        <span>Last updated: Q4 2024</span>
      </div>
    </div>
  );
}
