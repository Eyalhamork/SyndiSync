// src/components/landing/LandingPage.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BoltIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  MicrophoneIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import useAppStore from '../../store/appStore';
import { useState, useEffect } from 'react';
import { staggerContainer, staggerItem } from '../common/PageTransition';

// Animated counter for hero stats
function AnimatedStatNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    const endValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500); // Delay start

    return () => clearTimeout(timer);
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { hasCompletedOnboarding } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleTryDemo = () => {
    setIsLoading(true);
    // Simulate initial load delay
    setTimeout(() => {
      if (hasCompletedOnboarding) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }, 800);
  };

  const heroStats = [
    { value: 2.06, prefix: '$', suffix: 'M', label: 'Saved Per Deal', icon: CurrencyDollarIcon, formatAsDecimal: true, color: 'from-accent-emerald to-accent-cyan', glow: 'shadow-glow-emerald' },
    { value: 87, prefix: '', suffix: '%', label: 'Faster Execution', icon: BoltIcon, color: 'from-accent-purple to-accent-pink', glow: 'shadow-glow-purple' },
    { value: 100, prefix: '', suffix: '%', label: 'LMA Compliant', icon: ShieldCheckIcon, color: 'from-accent-amber to-accent-rose', glow: 'shadow-glow-gold' },
  ];

  const features = [
    {
      title: 'Smart Generation',
      desc: 'Upload a term sheet and get a 300+ page LMA agreement in 43 seconds.',
      icon: BoltIcon,
      highlight: '43 seconds',
      gradient: 'from-accent-purple to-accent-indigo',
      borderColor: 'hover:border-accent-purple/50',
      glowClass: 'hover-glow-purple',
    },
    {
      title: 'Voice Commander',
      desc: 'Navigate complex deals and query documents using natural language voice commands.',
      icon: MicrophoneIcon,
      highlight: 'Hands-free',
      gradient: 'from-accent-cyan to-accent-emerald',
      borderColor: 'hover:border-accent-cyan/50',
      glowClass: 'hover-glow-cyan',
    },
    {
      title: 'Conflict Resolution',
      desc: 'AI analyzes 147+ comparable deals and proposes market-standard compromises.',
      icon: ShieldCheckIcon,
      highlight: '85% acceptance',
      gradient: 'from-accent-rose to-accent-pink',
      borderColor: 'hover:border-accent-rose/50',
      glowClass: 'hover-glow-rose',
    },
    {
      title: 'ESG Intelligence',
      desc: 'Live sustainability scoring and SLLP compliance with UN SDG alignment.',
      icon: CheckCircleIcon,
      highlight: 'Green certified',
      gradient: 'from-accent-emerald to-accent-cyan',
      borderColor: 'hover:border-accent-emerald/50',
      glowClass: 'hover-glow-emerald',
    },
  ];

  const additionalFeatures = [
    { icon: ChatBubbleBottomCenterTextIcon, label: 'AI Chat Assistant', color: 'text-accent-purple' },
    { icon: DocumentTextIcon, label: 'PDF/DOCX Export', color: 'text-accent-cyan' },
    { icon: ChartBarIcon, label: 'Market Benchmarking', color: 'text-accent-rose' },
    { icon: SparklesIcon, label: 'RAG-Powered Context', color: 'text-accent-emerald' },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-hidden selection:bg-gold-500/30">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 z-0 mesh-gradient">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-purple/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-accent-cyan/15 rounded-full blur-[100px]"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[20%] w-[45%] h-[45%] bg-gold-600/10 rounded-full blur-[120px]"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-[30%] left-[-5%] w-[30%] h-[30%] bg-accent-rose/10 rounded-full blur-[80px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3
          }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-navy-950/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-11 w-11 bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-glow-gold">
              <span className="text-navy-900 font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SyndiSync AI</h1>
              <p className="text-[10px] text-gradient-purple-cyan font-semibold tracking-widest uppercase">LMA Edge 2025</p>
            </div>
          </motion.div>
          <motion.button
            onClick={handleTryDemo}
            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent-purple/20 to-accent-cyan/20 hover:from-accent-purple/30 hover:to-accent-cyan/30 border border-white/10 hover:border-white/20 rounded-full transition-all text-sm font-medium backdrop-blur-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Launch Demo App
            <ArrowRightIcon className="h-4 w-4" />
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SparklesIcon className="h-4 w-4 text-accent-purple" />
          <span className="text-sm font-medium tracking-wide text-gradient-purple-cyan">THE AI-NATIVE OS FOR SYNDICATED LENDING</span>
        </motion.div>

        <motion.h1
          className="max-w-5xl text-5xl md:text-7xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          From Term Sheet to <br />
          <motion.span
            className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-[length:200%_100%]"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            Signed Deal in 72 Hours
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl text-slate-300 mb-14 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Stop wrestling with versions. SyndiSync generates LMA-compliant facility agreements in seconds, resolves conflicts with AI, and saves millions in legal fees.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={handleTryDemo}
            disabled={isLoading}
            className="group relative px-10 py-4 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-navy-900 font-bold rounded-xl shadow-glow-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[220px] overflow-hidden"
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(204, 164, 59, 0.5)' }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/30"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Loading Environment...
                </>
              ) : (
                <>
                  Try Interactive Demo
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </motion.button>

          <motion.button
            className="px-10 py-4 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlayCircleIcon className="h-5 w-5 text-accent-cyan" />
            Watch 3-Min Video
          </motion.button>
        </motion.div>

        {/* Hero Stats - Animated with gradient accents */}
        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {heroStats.map((stat, i) => (
            <motion.div
              key={i}
              className={`glass-card-premium p-7 rounded-2xl flex items-center gap-5 transition-all duration-300 group shine-effect ${stat.glow.replace('shadow-', 'hover:shadow-')}`}
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white">
                  {stat.formatAsDecimal ? (
                    <span>{stat.prefix}2.06{stat.suffix}</span>
                  ) : (
                    <AnimatedStatNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  )}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Additional Features Ticker */}
      <section className="relative z-10 py-8 border-y border-white/5 bg-navy-950/50 overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-center gap-14 flex-wrap md:flex-nowrap px-6">
          {additionalFeatures.map((feat, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 text-slate-400 text-sm group cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <feat.icon className={`w-5 h-5 ${feat.color} group-hover:scale-110 transition-transform`} />
              <span className="group-hover:text-white transition-colors">{feat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 bg-navy-950/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-5">Everything You Need to Close</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Built for the modern deal team. Powerful AI tools that work the way you do.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className={`glass-card-premium p-9 rounded-2xl border border-white/5 ${feature.borderColor} group relative overflow-hidden shine-effect ${feature.glowClass} transition-all duration-300`}
                variants={staggerItem}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                {/* Highlight badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${feature.gradient} rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-lg`}>
                  {feature.highlight}
                </div>

                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-7 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 text-sm uppercase tracking-wider mb-6">Built for the LMA Edge Hackathon 2025</p>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            <motion.div
              className="flex items-center gap-2 text-slate-400"
              whileHover={{ scale: 1.05, color: '#fff' }}
            >
              <CheckCircleIcon className="w-5 h-5 text-accent-emerald" />
              <span>LMA Compliant Templates</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-slate-400"
              whileHover={{ scale: 1.05, color: '#fff' }}
            >
              <CheckCircleIcon className="w-5 h-5 text-accent-emerald" />
              <span>147+ Comparable Deals Database</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-slate-400"
              whileHover={{ scale: 1.05, color: '#fff' }}
            >
              <CheckCircleIcon className="w-5 h-5 text-accent-emerald" />
              <span>Gemini 2.0 Flash Powered</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <FloatingParticles />
        <motion.div
          className="max-w-4xl mx-auto text-center glass-card-premium p-14 rounded-3xl border border-gold-500/20 gradient-border relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Gradient orb inside */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-purple/20 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-cyan/20 rounded-full blur-[60px]" />

          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            <SparklesIcon className="w-14 h-14 text-gold-400 mx-auto mb-7" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-5 relative z-10">Ready to Transform Your Deal Workflow?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg relative z-10">Experience the future of syndicated lending. Generate your first facility agreement in under a minute.</p>
          <motion.button
            onClick={handleTryDemo}
            className="px-12 py-4 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-navy-900 font-bold rounded-xl shadow-glow-gold transition-all relative z-10"
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(204, 164, 59, 0.6)' }}
            whileTap={{ scale: 0.98 }}
          >
            Start Free Demo
            <ArrowRightIcon className="h-5 w-5 inline ml-2" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-14 text-center text-slate-500 text-sm border-t border-white/5 bg-navy-950/50">
        <p className="mb-2">SyndiSync AI • LMA Edge Hackathon 2025</p>
        <p>Built with <span className="text-accent-rose">♥</span> by the SyndiSync Team</p>
      </footer>
    </div>
  );
}
