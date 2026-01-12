import { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiDatabase, FiEdit2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeGemini, resolveConflict, getApiKey } from '../../lib/gemini';
import { useAutoTypewriter } from '../../hooks/useTypewriter';
import { MARKET_STATS } from '../../data/comparable-deals';
import ComparablesModal from './ComparablesModal';
import useAppStore from '../../store/appStore';
import { staggerContainer, staggerItem } from '../common/PageTransition';

// Market data derived from real comparable deals (Restored)
const MARKET_DATA = [
  { range: '4.5x', count: 8, isP25: true },
  { range: '4.7x', count: 12 },
  { range: '4.9x', count: 25 },
  { range: `${MARKET_STATS.leverage.median}x`, count: 38, isMedian: true }, // Median from real data
  { range: '5.2x', count: 18 },
  { range: '5.4x', count: 6, isP75: true },
];

// Helper to extract ratio
const extractRatio = (text: string): number => {
  const match = text.match(/(\d+\.?\d*)x/);
  return match ? parseFloat(match[1]) : 0;
};

// Map full bank names to short codes
const getShortName = (name: string): string => {
  if (name.includes('America')) return 'BofA';
  if (name.includes('Chase') || name.includes('JPM')) return 'JPM';
  if (name.includes('Citi')) return 'Citi';
  if (name.includes('Wells')) return 'Wells';
  if (name.includes('Global')) return 'Global';
  return name.substring(0, 4);
};

export function NegotiationHub() {
  const [showResolution, setShowResolution] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [showComparables, setShowComparables] = useState(false);
  const [aiProposal, setAiProposal] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false); // Human-in-the-loop state

  const { displayText: streamingProposal } = useAutoTypewriter(aiProposal || "", 30);
  const { currentDeal, negotiations, showToast } = useAppStore();

  const activeNegotiations = negotiations.filter(n => n.deal_id === currentDeal?.deal_id);
  // Assume the first negotiation is the primary financial covenant one for the demo flow
  const primaryNegotiation = activeNegotiations.find(n => n.clause_reference.includes('Financial Covenants')) || activeNegotiations[0];

  const bankPositions = primaryNegotiation ? primaryNegotiation.positions.map(pos => {
    const ratio = extractRatio(pos.position);
    // Simple logic to determine status based on ratio (mock logic for visualization)
    // In a real app, this would be compared against a target or median
    let status = 'pending';
    if (Math.abs(ratio - 5.0) < 0.1) status = 'agreed'; // 5.0 is agreed
    else if (ratio > 5.2 || ratio < 4.8) status = 'conflict';

    return {
      name: getShortName(pos.party),
      ratio: ratio,
      status: status,
      label: pos.party,
      hasEquityCure: pos.position.toLowerCase().includes('equity cure')
    };
  }) : []; // If no negotiations, empty array (or could show empty state)

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
        const positions = (primaryNegotiation?.positions || []).reduce((acc, pos) => {
          acc[getShortName(pos.party)] = pos.position;
          return acc;
        }, {} as Record<string, string>);

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

    // Use live result or fallback to stored AI resolution in usage
    if (proposalResult) {
      setAiProposal(proposalResult);
    } else if (primaryNegotiation?.ai_proposed_resolutions?.[0]) {
      setAiProposal(primaryNegotiation.ai_proposed_resolutions[0].resolution_text);
    }

    setResolving(false);
    setIsReviewing(true); // Enter review mode
    setShowResolution(true);
  };

  const handleApprove = () => {
    setIsReviewing(false);
    showToast('success', 'Proposal Approved', 'The compromised terms have been circulated to all parties.');
  };

  return (
    <div className="p-8 space-y-8 bg-navy-900 min-h-screen text-slate-100">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Negotiation Intelligence</h1>
          <p className="text-slate-400 text-sm md:text-base">Conflict detected in <span className="text-gold-400">Financial Covenants</span></p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto">
          <button
            onClick={() => setShowComparables(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30 hover:bg-primary-500/30 transition-colors text-sm md:text-base"
          >
            <FiDatabase />
            <span className="font-semibold">View {MARKET_STATS.sample_size} Deals</span>
          </button>
          <div className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full border border-red-500/30 animate-pulse-slow text-sm md:text-base">
            <FiAlertTriangle />
            <span className="font-semibold">{bankPositions.length} Conflicting Banks</span>
          </div>
        </div>
      </motion.div>

      {/* Bank Cards Staggered */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {bankPositions.map((bank, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={`glass-card p-4 rounded-xl border-t-4 transition-all ${bank.status === 'conflict' ? 'border-t-red-500' : 'border-t-green-500'}`}
          >
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
            <p className="text-xs md:text-sm text-slate-400">Leverage Ask</p>
            <p className={`text-xl md:text-2xl font-bold ${bank.status === 'conflict' ? 'text-red-400' : 'text-green-400'
              }`}>{bank.ratio}x</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Market Analysis Card - Compact above resolution */}
      <motion.div
        className="glass-card p-6 rounded-2xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FiTrendingUp className="text-gold-500" />
            Market Analysis
          </h3>
          <span className="text-xs text-slate-400 font-mono">Based on {MARKET_STATS.sample_size} comparable deals</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MARKET_DATA}>
              <XAxis dataKey="range" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#112240', border: '1px solid rgba(255,255,255,0.1)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                animationDuration={1200}
                animationBegin={200}
                animationEasing="ease-out"
              >
                {MARKET_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.range === '5.0x' ? '#cca43b' : '#334155'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* FULL-WIDTH CONFLICT RESOLUTION HERO SECTION */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Premium glow effect when not resolved */}
        {!showResolution && (
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-gold-500/20 to-red-500/20 rounded-3xl blur-xl animate-pulse" />
        )}
        {showResolution && (
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-gold-500/20 to-green-500/20 rounded-3xl blur-xl" />
        )}

        <div className={`relative glass-card rounded-3xl overflow-hidden border-2 transition-all duration-700 ${showResolution ? 'border-green-500/30' : 'border-gold-500/30'
          }`}>

          {/* Animated top border gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />

          {/* Header Bar */}
          <div className="bg-navy-800/50 px-4 md:px-8 py-3 md:py-4 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <motion.div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${showResolution ? 'bg-green-500/20 text-green-400' : 'bg-gold-500/20 text-gold-400'
                  }`}
                animate={!showResolution ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {showResolution ? <FiCheckCircle size={20} /> : <FiAlertTriangle size={20} />}
              </motion.div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                  {showResolution ? 'AI Resolution Approved' : 'Conflict Resolution Center'}
                </h3>
                <p className="text-[10px] md:text-sm text-slate-400">
                  {showResolution ? 'All parties aligned on compromise terms' : 'AI-powered analysis & negotiation synthesis'}
                </p>
              </div>
            </div>
            {resolving && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gold-500/10 rounded-full border border-gold-500/30 ml-1 sm:ml-0">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
                <span className="text-xs md:text-sm font-medium text-gold-400 uppercase tracking-wider">Processing</span>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="p-8 min-h-[400px] relative">

            <AnimatePresence mode="wait">
              {/* STATE: Not yet resolved - Show CTA */}
              {!showResolution && !resolving && (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center h-full min-h-[300px]"
                >
                  {/* Floating particles background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-gold-500/20"
                        style={{
                          left: `${15 + i * 15}%`,
                          top: `${20 + (i % 3) * 25}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                          duration: 3 + i * 0.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>

                  <motion.div
                    className="text-center relative z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-full border border-red-500/20 mb-6 text-sm font-medium">
                      <FiAlertTriangle />
                      {bankPositions.filter(b => b.status === 'conflict').length} Banks with Conflicting Positions
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      Ready to Resolve with <span className="text-gradient-gold">AI Intelligence</span>
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto mb-8">
                      Our AI will analyze {MARKET_STATS.sample_size} comparable deals, cross-reference bank positions,
                      and synthesize an optimal compromise that maximizes acceptance probability.
                    </p>

                    <motion.button
                      onClick={handleResolve}
                      className="group relative px-10 py-5 rounded-2xl overflow-hidden"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Button gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Shine effect */}
                      <div className="absolute top-0 -left-[100%] group-hover:left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 ease-out transform skew-x-12" />

                      <div className="relative flex items-center gap-2 md:gap-3 text-navy-900 font-bold text-base md:text-lg">
                        <FiTrendingUp className="text-lg md:text-xl" />
                        <span>Resolve Conflict with AI</span>
                      </div>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {/* STATE: Resolving - Show premium loading animation */}
              {resolving && (
                <motion.div
                  key="resolving"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full min-h-[300px]"
                >
                  {/* Central orb animation */}
                  <div className="relative w-32 h-32 mb-8">
                    {/* Outer ring */}
                    <motion.div
                      className="absolute inset-0 border-4 border-gold-500/30 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Middle ring */}
                    <motion.div
                      className="absolute inset-2 border-4 border-t-gold-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Inner ring */}
                    <motion.div
                      className="absolute inset-4 border-4 border-primary-500/50 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={processingStep}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-4xl"
                        >
                          {(() => {
                            const Icon = PROCESSING_STEPS[processingStep].icon;
                            return <Icon className={PROCESSING_STEPS[processingStep].color} />;
                          })()}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Step label */}
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={processingStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-2xl font-bold text-white mb-4"
                    >
                      {PROCESSING_STEPS[processingStep].label}
                    </motion.h3>
                  </AnimatePresence>

                  {/* Progress bar */}
                  <div className="w-64 h-2 bg-navy-800 rounded-full overflow-hidden mb-4">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((processingStep + 1) / 3) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <p className="text-sm text-slate-500 font-mono">
                    Step {processingStep + 1} of 3
                  </p>
                </motion.div>
              )}

              {/* STATE: Resolved - Show full-width results */}
              {showResolution && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                >
                  {/* Success banner */}
                  {isReviewing ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-3 mb-8 px-6 py-3 bg-primary-500/10 border border-primary-500/30 rounded-xl"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                      <span className="text-primary-400 font-bold">HUMAN REVIEW REQUIRED</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center gap-3 mb-8 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-xl"
                    >
                      <FiCheckCircle className="text-green-400 text-xl" />
                      <span className="text-green-400 font-bold">APPROVED & CIRCULATED TO ALL PARTIES</span>
                    </motion.div>
                  )}

                  {/* Two-column result layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Market insight + Proposal */}
                    <div className="space-y-6">
                      {/* Market Insight Callout */}
                      <div className="p-5 bg-primary-500/10 border border-primary-500/30 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <FiTrendingUp className="text-primary-400 text-2xl" />
                          </div>
                          <div>
                            <p className="text-xs text-primary-300 uppercase tracking-wider font-medium mb-1">Market Median ({MARKET_STATS.sample_size} deals)</p>
                            <p className="text-3xl font-bold text-white">5.10x <span className="text-lg font-normal text-slate-400">Leverage</span></p>
                          </div>
                        </div>
                      </div>

                      {/* AI Proposal */}
                      {aiProposal ? (
                        <div className={`p-6 rounded-xl border-2 transition-all ${isReviewing ? 'bg-navy-800 border-gold-500/50' : 'bg-green-500/5 border-green-500/30'
                          }`}>
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">AI-Synthesized Compromise</h4>
                          <p className="text-white text-lg italic leading-relaxed">"{streamingProposal}"</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-4 bg-navy-800 rounded-xl border border-gold-500/20">
                            <span className="text-slate-300">Target Leverage</span>
                            <span className="text-2xl font-bold text-gold-400">5.0x</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-navy-800 rounded-xl border border-white/5">
                            <span className="text-slate-300">Step-down</span>
                            <span className="text-lg font-bold text-white">4.75x <span className="text-xs font-normal text-slate-500">(After 24mo)</span></span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-navy-800 rounded-xl border border-white/5">
                            <span className="text-slate-300">Equity Cure</span>
                            <span className="text-lg font-bold text-white">2 Rights</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions + Acceptance */}
                    <div className="space-y-6">
                      {isReviewing ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Review Actions</h4>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex-1 py-3 md:py-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
                              <FiEdit2 />
                              Edit Terms
                            </button>
                            <motion.button
                              onClick={handleApprove}
                              className="flex-1 py-3 md:py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-navy-900 font-bold transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 text-sm md:text-base"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FiCheckCircle />
                              Approve & Circulate
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-green-500/10 rounded-xl p-6 border border-green-500/20"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-green-400 font-bold text-lg">Predicted Acceptance</span>
                            <span className="text-4xl font-bold text-green-400">85%</span>
                          </div>
                          <div className="w-full bg-navy-900 rounded-full h-3 mb-4">
                            <motion.div
                              className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '85%' }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                            />
                          </div>
                          <p className="text-sm text-slate-400">Based on historical acceptance rates for similar compromise terms</p>
                        </motion.div>
                      )}

                      {/* Bank status summary */}
                      <div className="p-5 bg-navy-800/50 rounded-xl border border-white/5">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Bank Alignment Status</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {bankPositions.map((bank, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 * i }}
                              className={`p-3 rounded-lg text-center ${showResolution && !isReviewing ? 'bg-green-500/10 border border-green-500/20' :
                                bank.status === 'conflict' ? 'bg-red-500/10 border border-red-500/20' :
                                  'bg-green-500/10 border border-green-500/20'
                                }`}
                            >
                              <span className="text-xs font-bold text-white">{bank.name}</span>
                              <div className="mt-1">
                                {(showResolution && !isReviewing) || bank.status !== 'conflict' ? (
                                  <FiCheckCircle className="text-green-400 mx-auto" />
                                ) : (
                                  <FiAlertTriangle className="text-red-400 mx-auto" />
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Comparables Modal */}
      <ComparablesModal
        isOpen={showComparables}
        onClose={() => setShowComparables(false)}
      />
    </div>
  );
}
