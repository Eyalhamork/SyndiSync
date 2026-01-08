import { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { initializeGemini, resolveConflict, getApiKey } from '../../lib/gemini';
import { useAutoTypewriter } from '../../hooks/useTypewriter';

const BANK_POSITIONS = [
  { name: 'BofA', ratio: 4.5, status: 'conflict', label: 'Bank of America' },
  { name: 'JPM', ratio: 5.5, status: 'conflict', label: 'JP Morgan' },
  { name: 'Citi', ratio: 5.0, status: 'pending', label: 'Citibank' },
  { name: 'Wells', ratio: 4.8, status: 'conflict', label: 'Wells Fargo' },
  { name: 'Global', ratio: 5.0, status: 'agreed', label: 'Global Bank', hasEquityCure: true },
];

const MARKET_DATA = [
  { range: '4.0x', count: 12 },
  { range: '4.5x', count: 45 },
  { range: '5.0x', count: 85 }, // Median
  { range: '5.5x', count: 30 },
  { range: '6.0x', count: 5 },
];

export function NegotiationHub() {
  const [showResolution, setShowResolution] = useState(false);
  const [resolving, setResolving] = useState(false);

  const [aiProposal, setAiProposal] = useState<string | null>(null);

  const [processingStep, setProcessingStep] = useState(0);

  const { displayText: streamingProposal } = useAutoTypewriter(aiProposal || "", 30);

  const PROCESSING_STEPS = [
    { label: "Analyzing Bank Positions...", icon: FiAlertTriangle, color: "text-red-400" },
    { label: "Cross-referencing 147 Precedents...", icon: FiTrendingUp, color: "text-primary-400" },
    { label: "Synthesizing Compromise...", icon: FiCheckCircle, color: "text-gold-400" }
  ];

  const handleResolve = async () => {
    setResolving(true);
    setProcessingStep(0);

    // AI Logic (runs in background while animation plays)
    let proposalResult: string | null = null;
    const isLive = window.localStorage.getItem('liveMode') === 'true';
    const apiKey = getApiKey();

    if (isLive && apiKey) {
      try {
        initializeGemini(apiKey);
        const positions = {
          bankA: "BofA wants 4.5x",
          bankB: "JPM wants 5.5x",
          bankC: "Wells wants 4.8x",
          median: "5.1x"
        };
        // Start the promise but don't await immediately, let animation start
        resolveConflict(positions).then(res => proposalResult = res);
      } catch (e) {
        console.error("AI Resolution Failed", e);
      }
    }

    // Sequence the animation
    await new Promise(r => setTimeout(r, 1500)); // Step 0
    setProcessingStep(1);
    await new Promise(r => setTimeout(r, 1500)); // Step 1

    // If live, ensure we have the result by now (or await it)
    if (isLive && apiKey && !proposalResult) {
      // Wait a bit more if API is slow, usually fast enough
      await new Promise(r => setTimeout(r, 1000));
    }

    setProcessingStep(2);
    await new Promise(r => setTimeout(r, 1200)); // Step 2

    if (proposalResult) setAiProposal(proposalResult);

    setResolving(false);
    setShowResolution(true);
  };

  return (
    <div className="p-8 space-y-8 bg-navy-900 min-h-screen text-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Negotiation Intelligence</h1>
          <p className="text-slate-400">Conflict detected in <span className="text-gold-400">Financial Covenants</span></p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full border border-red-500/30 animate-pulse-slow">
          <FiAlertTriangle />
          <span className="font-semibold">3 Banks in Conflict</span>
        </div>
      </div>

      {/* Bank Cards */}
      <div className="grid grid-cols-5 gap-4">
        {BANK_POSITIONS.map((bank, i) => (
          <div key={i} className={`glass-card p-4 rounded-xl border-t-4 transition-all hover:-translate-y-1 ${bank.status === 'conflict' ? 'border-t-red-500' : 'border-t-green-500'
            }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 px-3 rounded-lg bg-navy-700 flex items-center justify-center font-bold text-white text-xs tracking-wide">
                {bank.name}
              </div>
              {bank.status === 'conflict' ? (
                <FiAlertTriangle className="text-red-500" />
              ) : (
                <FiCheckCircle className="text-green-500" />
              )}
            </div>
            <p className="text-sm text-slate-400">Leverage Ask</p>
            <p className={`text-2xl font-bold ${bank.status === 'conflict' ? 'text-red-400' : 'text-green-400'
              }`}>{bank.ratio}x</p>
          </div>
        ))}
      </div>

      {/* Conflict Resolution Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-gold-500" /> Market Analysis
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MARKET_DATA}>
                <XAxis dataKey="range" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#112240', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {MARKET_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.range === '5.0x' ? '#cca43b' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {!showResolution && (
            <div className="absolute inset-0 bg-navy-900/90 backdrop-blur-md flex items-center justify-center transition-all duration-500 z-10">
              {resolving ? (
                <div className="text-center w-full max-w-sm">
                  {/* Icon Animation */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-navy-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-gold-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
                      {(() => {
                        const Icon = PROCESSING_STEPS[processingStep].icon;
                        return <Icon className={PROCESSING_STEPS[processingStep].color} />;
                      })()}
                    </div>
                  </div>

                  {/* Text Animation */}
                  <div className="space-y-3 animate-fade-in-up">
                    <h4 className="text-xl font-bold text-white transition-all duration-300">
                      {PROCESSING_STEPS[processingStep].label}
                    </h4>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-48 mx-auto bg-navy-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500 ease-out"
                        style={{ width: `${((processingStep + 1) / 3) * 100}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-slate-500 font-mono">
                      step {processingStep + 1}/3
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleResolve}
                  className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-xl"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-primary-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 w-full h-full border border-white/20 rounded-xl"></div>

                  <div className="relative flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                      <FiTrendingUp className="text-gold-300" />
                      <span>Resolve Conflict with AI</span>
                    </div>
                    <span className="text-xs text-primary-100 opacity-90">Analyzes 147 comparable deals</span>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute top-0 -left-[100%] group-hover:left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 ease-in-out transform skew-x-12"></div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* AI Proposal Slide-In */}
        {showResolution && (
          <div className="glass-card p-8 rounded-2xl border border-gold-500/30 animate-slide-in-right relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>

            <h3 className="text-xl font-bold text-white mb-2">AI Compromise Proposal</h3>
            <p className="text-slate-400 mb-4">Based on median market terms for Q4 2025 LBOs.</p>

            {/* Market Insight Callout */}
            <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiTrendingUp className="text-primary-400 text-2xl" />
                <div>
                  <p className="text-xs text-primary-300 uppercase tracking-wider font-medium">Market Median (147 deals)</p>
                  <p className="text-2xl font-bold text-white">5.10x Leverage</p>
                </div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                Source: Q4 2025<br />Manufacturing LBOs
              </div>
            </div>

            {aiProposal ? (
              <div className="p-4 bg-navy-800 rounded-lg border border-gold-500/20 mb-6">
                <p className="text-white italic">"{streamingProposal}"</p>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-navy-800 rounded-lg border border-gold-500/20">
                  <span className="text-slate-300">Target Leverage</span>
                  <span className="text-2xl font-bold text-gold-400">5.0x</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-navy-800 rounded-lg border border-white/5">
                  <span className="text-slate-300">Step-down</span>
                  <span className="text-lg font-bold text-white">4.75x <span className="text-xs font-normal text-slate-500">(After 24mo)</span></span>
                </div>
                <div className="flex justify-between items-center p-4 bg-navy-800 rounded-lg border border-white/5">
                  <span className="text-slate-300">Equity Cure</span>
                  <span className="text-lg font-bold text-white">2 Rights</span>
                </div>
              </div>
            )}

            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-bold">Predicted Acceptance</span>
                <span className="text-2xl font-bold text-green-400">85%</span>
              </div>
              <div className="w-full bg-navy-900 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
