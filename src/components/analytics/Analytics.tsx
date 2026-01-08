import { FiTrendingUp, FiAward, FiGlobe, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const ESG_DATA = [
  { name: 'Environmental', value: 95, color: '#10b981' }, // Green
  { name: 'Social', value: 88, color: '#3b82f6' }, // Blue
  { name: 'Governance', value: 93, color: '#8b5cf6' }, // Purple
];

const IMPACT_METRICS = [
  { label: 'Carbon Offset', value: '450', unit: 'tons CO2', icon: FiGlobe, color: 'text-green-400' },
  { label: 'SLLP Score', value: '92', unit: '/ 100', icon: FiAward, color: 'text-gold-400' },
  { label: 'Rate Reduction', value: '5.5', unit: 'bps', icon: FiTrendingUp, color: 'text-primary-400' },
];

export function Analytics() {
  return (
    <div className="p-8 space-y-8 bg-navy-900 min-h-screen text-slate-100">
      <div className="flex justify-between items-center mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Greener Lending Intelligence</h1>
          <p className="text-slate-400">Sustainability-Linked Loan Principles (SLLP) Compliance</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-xl flex items-center gap-3 border border-green-500/30">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-bold text-green-400">SLLP Certified Deal</span>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {IMPACT_METRICS.map((metric, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-6">
            <div className={`w-16 h-16 rounded-full bg-navy-800 flex items-center justify-center text-2xl ${metric.color} shadow-glow`}>
              <metric.icon />
            </div>
            <div>
              <p className="text-slate-400 text-sm">{metric.label}</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${metric.color} tracking-tight`}>{metric.value}</span>
                <span className="text-sm text-slate-500 font-medium">{metric.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* ESG Breakdown Chart */}
        <div className="glass-card p-8 rounded-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-bold text-white mb-6">ESG Performance Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ESG_DATA} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" stroke="#fff" width={100} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {ESG_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Document Integration */}
        <div className="glass-card p-8 rounded-2xl animate-slide-up border-l-4 border-green-500 bg-gradient-to-br from-navy-800 to-green-900/10" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FiFileText /> Live Clause Integration
          </h3>
          <div className="space-y-4 font-mono text-sm bg-navy-950 p-6 rounded-xl border border-white/5 relative overflow-hidden">

            {/* Glowing effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="mb-4 text-slate-500 text-xs uppercase tracking-wider">Clause 23.4 (Sustainability KPIs)</div>
            <p className="text-slate-300 leading-relaxed">
              "The Margin shall be reduced by <span className="bg-green-500/20 text-green-400 px-1 rounded border border-green-500/50">5.5 basis points</span> if the Company satisfies the Key Performance Indicators set out in Schedule 12 (Sustainability Targets) for the relevant Financial Year..."
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              "...verified by an external reviewer with <span className="bg-green-500/20 text-green-400 px-1 rounded border border-green-500/50">SLLP Accreditation</span>."
            </p>

            <div className="mt-4 flex items-center gap-2 text-green-400 text-xs">
              <FiCheckCircle className="animate-bounce" />
              Auto-inserted based on ESG Score &gt; 90
            </div>
          </div>
        </div>

      </div>

      {/* UN SDG Alignment Section - NEW WOW FACTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* UN SDG Badges */}
        <div className="glass-card p-8 rounded-2xl animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🌍 UN Sustainable Development Goals Alignment
          </h3>
          <p className="text-slate-400 text-sm mb-6">This deal contributes to 4 of the 17 UN SDGs</p>
          <div className="grid grid-cols-4 gap-4">
            {[
              { num: 7, name: 'Affordable Clean Energy', color: 'bg-yellow-500' },
              { num: 9, name: 'Industry, Innovation', color: 'bg-orange-500' },
              { num: 12, name: 'Responsible Consumption', color: 'bg-amber-600' },
              { num: 13, name: 'Climate Action', color: 'bg-green-600' },
            ].map((sdg) => (
              <div key={sdg.num} className="group relative">
                <div className={`${sdg.color} w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg transform transition-all group-hover:scale-110 group-hover:shadow-xl`}>
                  {sdg.num}
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-800 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap z-10 border border-white/10">
                  {sdg.name}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-green-400">
            <FiCheckCircle />
            <span>SDG Impact Report generated automatically</span>
          </div>
        </div>

        {/* Green Bond Eligibility */}
        <div className="glass-card p-8 rounded-2xl animate-slide-up bg-gradient-to-br from-navy-800 to-green-900/20 border border-green-500/20" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🌱 Green Bond Eligibility
          </h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-24 h-24">
              {/* Animated ring gauge */}
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#1e3a5f" strokeWidth="8" fill="none" />
                <circle
                  cx="48" cy="48" r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset="25.12"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-400">90%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-green-400 font-bold text-lg mb-1">ELIGIBLE</p>
              <p className="text-slate-400 text-sm">Meets ICMA Green Bond Principles</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Use of Proceeds', status: true },
              { label: 'Project Selection', status: true },
              { label: 'Management of Proceeds', status: true },
              { label: 'External Review', status: 'pending' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-slate-300">{item.label}</span>
                {item.status === true ? (
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded font-medium flex items-center gap-1">
                    <FiCheckCircle size={12} /> Verified
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-gold-500/20 text-gold-400 rounded font-medium">Pending</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Covenant Benchmarking Section */}
      <div className="glass-card p-8 rounded-2xl animate-slide-up mt-8" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-xl font-bold text-white mb-2">Leverage Covenant Benchmarking</h3>
        <p className="text-slate-400 text-sm mb-6">Your deal vs. 147 comparable manufacturing LBOs (Q4 2025)</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { range: '25th %ile', value: 4.25, color: '#334155' },
                { range: 'Median', value: 5.1, color: '#334155' },
                { range: '75th %ile', value: 5.75, color: '#334155' },
                { range: 'Your Deal', value: 5.0, color: '#cca43b' },
              ]}>
                <XAxis dataKey="range" stroke="#94a3b8" />
                <YAxis domain={[3.5, 6.5]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#112240', border: '1px solid rgba(255,255,255,0.1)' }} itemStyle={{ color: '#fff' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {[
                    { range: '25th %ile', value: 4.25, color: '#334155' },
                    { range: 'Median', value: 5.1, color: '#334155' },
                    { range: '75th %ile', value: 5.75, color: '#334155' },
                    { range: 'Your Deal', value: 5.0, color: '#cca43b' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-navy-800 border border-white/5">
              <p className="text-slate-400 text-sm mb-1">Market Median</p>
              <p className="text-3xl font-bold text-white">5.10x</p>
            </div>
            <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30">
              <p className="text-gold-400 text-sm mb-1">Your Deal Position</p>
              <p className="text-3xl font-bold text-gold-400">5.00x</p>
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1"><FiCheckCircle /> Favorable (Below Median)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

