// src/components/landing/LandingPage.tsx
import { useNavigate } from 'react-router-dom';
import {
  BoltIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import useAppStore from '../../store/appStore';
import { useState } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { loadDemoData } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleTryDemo = () => {
    setIsLoading(true);
    loadDemoData();
    setTimeout(() => {
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white overflow-hidden selection:bg-gold-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-900/40 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-navy-900/80 backdrop-blur-md border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-navy-900 font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SyndiSync AI</h1>
              <p className="text-[10px] text-gold-500 font-medium tracking-widest uppercase">LMA Edge 2025</p>
            </div>
          </div>
          <button
            onClick={handleTryDemo}
            className="hidden md:flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all text-sm font-medium backdrop-blur-sm"
          >
            Launch Demo App
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 mb-8 animate-fade-in">
          <SparklesIcon className="h-4 w-4" />
          <span className="text-sm font-medium tracking-wide">THE AI-NATIVE OS FOR SYNDICATED LENDING</span>
        </div>

        <h1 className="max-w-5xl text-5xl md:text-7xl font-bold mb-8 leading-tight animate-slide-up">
          From Term Sheet to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 animate-gradient-x">
            Signed Deal in 72 Hours
          </span>
        </h1>

        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Stop wrestling with versions. SyndiSync generates LMA-compliant facility agreements in seconds, resolves conflicts with AI, and saves millions in legal fees.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={handleTryDemo}
            disabled={isLoading}
            className="group relative px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold rounded-xl shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                  Loading Environment...
                </>
              ) : (
                <>
                  Try Interactive Demo
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>

          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl backdrop-blur-sm transition-all flex items-center gap-2">
            <PlayCircleIcon className="h-5 w-5" />
            Watch 3-Min Video
          </button>
        </div>

        {/* Hero Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {[
            { val: "$2.06M", label: "Saved Per Deal", icon: CurrencyDollarIcon },
            { val: "87%", label: "Faster Execution", icon: BoltIcon },
            { val: "100%", label: "LMA Compliant", icon: ShieldCheckIcon },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center border border-white/5">
                <stat.icon className="w-6 h-6 text-gold-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">{stat.val}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-navy-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Close</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Built for the modern deal team. Powerful AI tools that work the way you do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Smart Generation", desc: "Upload a term sheet and get a 300+ page LMA agreement in 43 seconds.", icon: BoltIcon },
              { title: "Voice Commander", desc: "Navigate complex deals and query documents using natural language.", icon: ChartBarIcon },
              { title: "Conflict Resolution", desc: "AI analyzes positioning across bank syndicates and proposes market-standard compromises.", icon: ShieldCheckIcon },
              { title: "ESG Intelligence", desc: "Live sustainability scoring and SLLP compliance tracking embedded in every deal.", icon: CheckCircleIcon },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-gold-500/30 group">
                <div className="w-14 h-14 rounded-2xl bg-navy-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-gold-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-slate-500 text-sm border-t border-white/5">
        <p className="mb-2">SyndiSync AI • LMA Edge Hackathon 2025</p>
        <p>Built with <span className="text-red-500">♥</span> by the SyndiSync Team</p>
      </footer>
    </div>
  );
}
