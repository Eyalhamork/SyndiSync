// src/components/documents/GenerationProgress.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


interface GenerationProgressProps {
  fileName: string;
  borrowerName?: string;
}

interface ProgressStep {
  message: string;
  subtext: string;
  duration: number;
}

const generationSteps: ProgressStep[] = [
  { message: 'INITIALIZING VISION CORE', subtext: 'Analyzing document structure & meta-data...', duration: 2000 },
  { message: 'EXTRACTING DEAL VECTORS', subtext: 'Identifying key terms: Amount, Rate, Covenants...', duration: 2500 },
  { message: 'RETRIEVING PRECEDENTS', subtext: 'Querying 10,000+ LMA/LSTA executed agreements...', duration: 2500 },
  { message: 'SYNTHESIZING DEFINITIONS', subtext: 'Drafting Article I compliant definitions...', duration: 2000 },
  { message: 'CONSTRUCTING COVENANTS', subtext: 'Aligning Q4 2025 financial ratios...', duration: 2000 },
  { message: 'OPTIMIZING CLAUSES', subtext: 'Resolving leverage conflicts & credit support...', duration: 1500 },
  { message: 'FINALIZING DOCUMENT', subtext: 'Applying formatting & preparing for preview...', duration: 1000 },
];

export default function GenerationProgress({ fileName, borrowerName }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalTime = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Timers for steps
    generationSteps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index);
        // Smooth progress interpolation could go here, but for now we set checkpoints
      }, totalTime);
      timers.push(timer);
      totalTime += step.duration;
    });

    // Smooth progress bar update
    const totalDuration = generationSteps.reduce((acc, step) => acc + step.duration, 0);
    const interval = 50; // Update every 50ms
    const steps = totalDuration / interval;
    const increment = 100 / steps;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="relative bg-navy-950 rounded-2xl shadow-2xl border border-navy-700 p-12 overflow-hidden aspect-[16/9] flex flex-col items-center justify-center">

        {/* Ambient Glow Background */}
        <div className="absolute inset-0 bg-radial-gradient from-navy-800 to-navy-950 opacity-50" />

        {/* Grid Line Overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* Central HUD */}
        <div className="relative z-10 flex flex-col items-center">

          {/* Animated Core */}
          <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <motion.div
              className="absolute inset-0 border-[3px] border-dashed border-primary-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 border-[1px] border-primary-500/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Scanning Line Effect */}
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
              <motion.div
                className="w-full h-full bg-gradient-to-b from-transparent via-primary-500/50 to-transparent"
                initial={{ top: '-100%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Inner Core Pulsing */}
            <motion.div
              className="absolute w-32 h-32 bg-primary-500 rounded-full blur-[60px] opacity-40 mix-blend-screen"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Central Icon / Logo placeholder or Deal Initials */}
            <div className="relative w-24 h-24 bg-navy-900 border-2 border-primary-500 rounded-full flex items-center justify-center z-20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-3xl">✨</span>
              </motion.div>
            </div>

            {/* Flying Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gold-400 rounded-full"
                initial={{ opacity: 0, x: 100, y: 100, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: 0,
                  y: 0,
                  scale: [0, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: `${Math.random() * 200 - 100}px ${Math.random() * 200 - 100}px`
                }}
              />
            ))}
          </div>

          {/* Status Text with Glitch/Typewriter effect simulation */}
          <div className="text-center space-y-2 h-24">
            <AnimatePresence mode='wait'>
              <motion.h2
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-3xl text-white font-mono font-bold tracking-widest uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              >
                {generationSteps[currentStep]?.message || "PROCESSING COMPLETE"}
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode='wait'>
              <motion.p
                key={`sub-${currentStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-primary-300 font-medium tracking-wide"
              >
                {generationSteps[currentStep]?.subtext}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Progress Bar & Stats */}
        <div className="w-full max-w-2xl mt-8 relative z-20">
          <div className="flex justify-between text-xs text-primary-400 mb-2 font-mono uppercase">
            <span>System Confidence: 99.8%</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-1 bg-navy-800 w-full rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 via-primary-400 to-gold-400"
              style={{ width: `${progress}%` }}
              animate={{ boxShadow: ['0 0 10px rgba(59,130,246,0)', '0 0 20px rgba(59,130,246,0.5)', '0 0 10px rgba(59,130,246,0)'] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          <div className="mt-4 flex justify-between text-navy-400 text-xs font-mono">
            <span>{borrowerName || "TARGET_ENTITY"}</span>
            <span>{fileName}</span>
            <span>LMA_V_2025.04.1.2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
