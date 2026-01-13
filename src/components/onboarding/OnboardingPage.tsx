import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FiBriefcase, FiUser, FiArrowRight, FiUpload, FiPlay } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store/appStore';
import { SparklesIcon } from '@heroicons/react/24/solid';

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Floating particles component
function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(25)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#22d3ee' : '#f6d365',
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.2, 0.7, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: Math.random() * 4 + 4,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                    }}
                />
            ))}
        </div>
    );
}

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { updateUser, loadDemoData, completeOnboarding } = useAppStore();
    const [step, setStep] = useState<'intro' | 'identification' | 'context' | 'selection' | 'processing'>('intro');

    // Form State
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    // Intro Sequence
    useEffect(() => {
        if (step === 'intro') {
            const timer = setTimeout(() => setStep('identification'), 3500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Context Sequence (after identification)
    useEffect(() => {
        if (step === 'context') {
            const timer = setTimeout(() => setStep('selection'), 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleIdentitySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && role) {
            updateUser({ name, role });
            setStep('context');
        }
    };

    const handleLaunchDemo = async () => {
        setStep('processing');
        // Simulate processing delay for effect
        await new Promise(resolve => setTimeout(resolve, 2000));
        loadDemoData(); // also sets hasCompletedOnboarding
        navigate('/dashboard');
    };

    const handleNewDeal = async () => {
        setStep('processing');
        await new Promise(resolve => setTimeout(resolve, 1500));
        completeOnboarding();
        navigate('/generate');
    };

    return (
        <div className="fixed inset-0 bg-navy-950 text-white overflow-hidden flex items-center justify-center">
            {/* Enhanced Dynamic Background with mesh gradient */}
            <div className="absolute inset-0 z-0 mesh-gradient">
                {/* Animated gradient orbs */}
                <motion.div
                    className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, -30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-accent-cyan/15 rounded-full blur-[100px]"
                    animate={{
                        scale: [1.1, 1, 1.1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
                <motion.div
                    className="absolute bottom-[-10%] right-[20%] w-[450px] h-[450px] bg-gold-500/15 rounded-full blur-[100px]"
                    animate={{
                        scale: [1.1, 1, 1.1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                <motion.div
                    className="absolute bottom-[30%] left-[30%] w-[300px] h-[300px] bg-accent-rose/10 rounded-full blur-[80px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.15, 0.3, 0.15],
                    }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                />
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            {/* Floating Particles */}
            <FloatingParticles />

            <div className="relative z-10 w-full max-w-2xl px-6">
                <AnimatePresence mode="wait">

                    {/* STEP 1: INTRO SEQUENCE */}
                    {step === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            transition={{ duration: 1 }}
                            className="text-center"
                        >
                            {/* Animated glow rings behind logo */}
                            <div className="relative w-24 h-24 mx-auto mb-10">
                                <motion.div
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-cyan opacity-40"
                                    animate={{
                                        scale: [1, 1.4, 1],
                                        opacity: [0.4, 0.1, 0.4],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                <motion.div
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold-600 to-gold-800 opacity-30"
                                    animate={{
                                        scale: [1.2, 1.6, 1.2],
                                        opacity: [0.3, 0.05, 0.3],
                                    }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                                />
                                <div className="relative w-full h-full bg-gradient-to-br from-gold-500 via-gold-600 to-gold-800 rounded-2xl flex items-center justify-center shadow-glow-gold">
                                    <img src="/logo.png" alt="SyndiSync" className="h-16 w-16 object-contain" />
                                </div>
                            </div>
                            <motion.h1
                                className="text-5xl md:text-6xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                SyndiSync AI
                            </motion.h1>
                            <motion.p
                                className="text-xl text-gradient-purple-cyan font-mono font-semibold"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                            >
                                INITIALIZING CORE SYSTEMS...
                            </motion.p>
                        </motion.div>
                    )}

                    {/* STEP 2: IDENTIFICATION */}
                    {step === 'identification' && (
                        <motion.div
                            key="identification"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="glass-card-premium p-10 rounded-3xl border border-white/10 gradient-border"
                        >
                            <motion.div className="text-center mb-10" variants={itemVariants}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/20 mb-6">
                                    <SparklesIcon className="h-4 w-4 text-accent-purple" />
                                    <span className="text-sm font-medium text-gradient-purple-cyan">SECURE ACCESS</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-3">Identify Yourself</h2>
                                <p className="text-slate-400">Security clearance required for access.</p>
                            </motion.div>

                            <form onSubmit={handleIdentitySubmit}>
                                <motion.div className="space-y-6" variants={itemVariants}>
                                    <div className="group">
                                        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold group-focus-within:text-accent-cyan transition-colors">Agent Name</label>
                                        <div className="relative">
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-cyan transition-colors" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-navy-900/60 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50 transition-all placeholder:text-slate-600"
                                                placeholder="e.g. John Morrison"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold group-focus-within:text-accent-purple transition-colors">Role / Title</label>
                                        <div className="relative">
                                            <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-purple transition-colors" />
                                            <input
                                                type="text"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full bg-navy-900/60 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 transition-all placeholder:text-slate-600"
                                                placeholder="e.g. Managing Director"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-accent-purple via-accent-indigo to-accent-cyan text-white font-bold py-4 rounded-xl shadow-glow-purple flex items-center justify-center gap-2 transition-all transform hover:shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={!name || !role}
                                    >
                                        Authenticate Access <FiArrowRight />
                                    </motion.button>
                                </motion.div>
                            </form>
                        </motion.div>
                    )}

                    {/* STEP 3: CONTEXT LOADING */}
                    {step === 'context' && (
                        <motion.div
                            key="context"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="w-28 h-28 mx-auto mb-10 relative">
                                {/* Animated rings */}
                                <motion.div
                                    className="absolute inset-0 rounded-full border-4 border-accent-purple/30"
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute inset-0 rounded-full border-4 border-accent-cyan/30"
                                    animate={{ scale: [1.1, 1.4, 1.1], opacity: [0.4, 0.1, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                />
                                <div className="absolute inset-0 border-4 border-navy-800 rounded-full"></div>
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        border: '4px solid transparent',
                                        borderTopColor: '#a855f7',
                                        borderRightColor: '#22d3ee',
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                />
                            </div>
                            <h2 className="text-3xl font-bold mb-3">Welcome, <span className="text-gradient-purple-cyan">{name.split(' ')[0]}</span></h2>
                            <p className="text-slate-400 font-mono text-lg">
                                CONFIGURING SECURE WORKSPACE FOR <span className="text-accent-cyan">{role.toUpperCase()}</span>...
                            </p>
                        </motion.div>
                    )}

                    {/* STEP 4: SELECTION */}
                    {step === 'selection' && (
                        <motion.div
                            key="selection"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-4xl"
                        >
                            <motion.div className="text-center mb-14" variants={itemVariants}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-emerald/10 to-accent-cyan/10 border border-accent-emerald/20 mb-6">
                                    <SparklesIcon className="h-4 w-4 text-accent-emerald" />
                                    <span className="text-sm font-medium text-accent-emerald">READY TO LAUNCH</span>
                                </div>
                                <h2 className="text-4xl font-bold mb-4">Initialize Workspace</h2>
                                <p className="text-slate-400 text-lg">Select an initialization protocol to begin.</p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Option 1: New Deal */}
                                <motion.button
                                    variants={itemVariants}
                                    onClick={handleNewDeal}
                                    className="group relative h-full"
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan to-accent-emerald rounded-3xl opacity-0 group-hover:opacity-30 transition-all duration-500 blur-xl"></div>
                                    <div className="relative h-full glass-card-premium p-8 rounded-3xl border border-white/10 group-hover:border-accent-cyan/50 transition-all duration-300 flex flex-col text-left shine-effect hover-glow-cyan">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-emerald flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                                            <FiUpload />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">Upload Term Sheet</h3>
                                        <p className="text-slate-400 mb-6 flex-1">
                                            Parse a PDF term sheet using Gemini AI to instantly generate deal structures and documents.
                                        </p>
                                        <div className="flex items-center text-accent-cyan font-semibold group-hover:translate-x-2 transition-transform">
                                            Begin Protocol <FiArrowRight className="ml-2" />
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Option 2: Demo Deal */}
                                <motion.button
                                    variants={itemVariants}
                                    onClick={handleLaunchDemo}
                                    className="group relative h-full"
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-accent-amber rounded-3xl opacity-0 group-hover:opacity-30 transition-all duration-500 blur-xl"></div>
                                    <div className="relative h-full glass-card-premium p-8 rounded-3xl border border-white/10 group-hover:border-gold-400/50 transition-all duration-300 flex flex-col text-left shine-effect hover-glow-gold">
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-3xl shadow-lg">
                                            RECOMMENDED
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 text-2xl mb-6 shadow-lg">
                                            <FiPlay />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">Load "Project Astra"</h3>
                                        <p className="text-slate-400 mb-6 flex-1">
                                            Initialize a comprehensive manufacturing LBO demo environment with populated market data.
                                        </p>
                                        <div className="flex items-center text-gold-400 font-semibold group-hover:translate-x-2 transition-transform">
                                            Launch Demo <FiArrowRight className="ml-2" />
                                        </div>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: PROCESSSING */}
                    {step === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="w-28 h-28 mx-auto mb-10 relative">
                                {/* Multiple spinning rings */}
                                <motion.div
                                    className="absolute inset-0 rounded-full border-4 border-accent-purple/20"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                />
                                <motion.div
                                    className="absolute inset-2 rounded-full border-4 border-accent-cyan/20"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />
                                <div className="absolute inset-4 border-4 border-navy-800 rounded-full flex items-center justify-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan"
                                    />
                                </div>
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        border: '4px solid transparent',
                                        borderTopColor: '#f6d365',
                                        borderRightColor: '#cca43b',
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />
                            </div>
                            <h2 className="text-3xl font-bold mb-3">Processing Request</h2>
                            <p className="text-slate-400 font-mono text-lg">
                                <span className="text-accent-purple">HYDRATING</span> ENVIRONMENT <span className="text-accent-cyan">VARIABLES</span>...
                            </p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
