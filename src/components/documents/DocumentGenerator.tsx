// src/components/documents/DocumentGenerator.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TermSheetUpload from './TermSheetUpload';
import GenerationProgress from './GenerationProgress';
import DocumentPreview from './DocumentPreview';
import useAppStore from '../../store/appStore';
import { DEMO_NEGOTIATIONS } from '../../data/demo-data';
import { ExtractedDealData, DEMO_DEAL_DATA } from '../../lib/pdf-generator';
import type { Document, Deal, Negotiation } from '../../types';
import {
  CloudArrowUpIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  CheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

type GeneratorState = 'upload' | 'generating' | 'preview';

const STEPS = [
  { id: 'upload', label: '1. Upload Term Sheet', sublabel: 'Initialize Deal', icon: CloudArrowUpIcon },
  { id: 'generating', label: '2. AI Synthesis', sublabel: 'Processing & Logic', icon: CpuChipIcon },
  { id: 'preview', label: '3. Review Agreement', sublabel: 'Final Output', icon: DocumentTextIcon },
];

export default function DocumentGenerator() {
  const navigate = useNavigate();
  const [state, setState] = useState<GeneratorState>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<Document | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedDealData | null>(null);
  const { addDocument, addNegotiation } = useAppStore();

  const handleFileUpload = (file: File, data?: ExtractedDealData) => {
    setUploadedFile(file);
    setExtractedData(data || DEMO_DEAL_DATA);
    setState('generating');
    startGeneration(file, data || DEMO_DEAL_DATA);
  };

  const startGeneration = async (_file: File, data: ExtractedDealData) => {
    // 14.5s simulation duration to match the premium animation in GenerationProgress
    await new Promise(resolve => setTimeout(resolve, 14500));

    // Create a NEW Deal ID for this generation flow
    const timestamp = Date.now();
    const dealId = `deal_${timestamp}`;

    // Create the new Deal object based on extracted data
    const newDeal: Deal = {
      deal_id: dealId,
      deal_name: `${data.borrower.name} Financing`,
      borrower: {
        name: data.borrower.name,
        industry: data.borrower.industry,
        credit_rating: data.borrower.credit_rating,
        annual_revenue: data.borrower.annual_revenue,
        headquarters: data.borrower.headquarters,
        founded: 2010, // Default/Mock
        employees: data.borrower.employees
      },
      deal_type: 'LBO', // Could be inferred from data
      jurisdiction: data.jurisdiction,
      facility_amount: data.facility.amount,
      currency: data.facility.currency,
      tenor_months: data.facility.tenor_months,
      purpose: data.facility.purpose,
      status: 'under_negotiation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'current_user', // Should come from auth/store
      arranger_bank: 'Global Investment Bank',
      // ESG Fields from extracted data
      esg_score: data.esg.margin_adjustment_bps ? 92 : 0, // Mock logic based on data presence
      carbon_offset_tons: data.esg.green_use_of_proceeds ? 450 : 0,
      sustainability_linked: data.esg.sustainability_linked
    };

    // Add the new deal to the store and set it as active
    const { addDeal, setCurrentDeal } = useAppStore.getState(); // Access store actions directly if not destructured above
    addDeal(newDeal);
    setCurrentDeal(newDeal);

    const mockDoc: Document = {
      document_id: `doc_${timestamp}`,
      deal_id: dealId,
      document_type: 'facility_agreement',
      document_name: `${data.borrower.name.replace(/[^a-zA-Z0-9]/g, '_')}_Facility_Agreement_v1.pdf`,
      version_number: 1,
      page_count: 287,
      word_count: 4500,
      generated_by: 'ai',
      ai_model: 'Gemini 2.0 Flash',
      generation_time_seconds: 14,
      ai_confidence_score: 0.99,
      status: 'under_review',
      created_at: new Date().toISOString(),
      sections: [], // Populated in real app
      lma_compliance: {
        template_version: 'LMA Investment Grade 2024',
        jurisdiction: data.jurisdiction,
        mandatory_provisions_included: 47,
        optional_provisions_included: 23,
        compliance_score: 0.98
      },
      extracted_data: data
    };

    addDocument(mockDoc);

    // Generate negotiations for THIS specific deal
    // We clone the demo negotiations but link them to the new deal ID
    DEMO_NEGOTIATIONS.forEach(demoNeg => {
      const negotiation: Negotiation = {
        ...demoNeg,
        negotiation_id: `neg_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
        deal_id: dealId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'pending' // Reset status for new deal
      };
      addNegotiation(negotiation);
    });

    setGeneratedDocument(mockDoc);
    setState('preview');
  };

  const currentStepIndex = STEPS.findIndex(s => s.id === state);

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col font-sans selection:bg-gold-500/30 relative">

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-navy-800 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-[100px] pointer-events-none animate-pulse-glow" />

      {/* Premium Header */}
      <header className="relative px-4 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 bg-navy-950/30 backdrop-blur-xl z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group px-3 md:px-4 py-2 rounded-lg hover:bg-white/5 text-sm md:text-base"
        >
          <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium tracking-wide">Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3 bg-navy-950/50 px-4 py-2 rounded-full border border-white/5 shadow-glass ml-2 sm:ml-0">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)] animate-pulse" />
          <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">AI SYSTEM ACTIVE</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col items-center relative z-10">

        {/* Wizard Progress - Card Style */}
        <div className="w-full max-w-5xl mb-10 md:mb-16 relative">
          <div className="bg-navy-800/40 backdrop-blur-md border border-white/10 rounded-2xl p-1 md:p-2 shadow-2xl flex flex-row items-center justify-between relative overflow-hidden">
            {/* Active Step Indicator Background Slide */}
            <motion.div
              className="absolute top-1 bottom-1 bg-white/5 border border-white/10 rounded-xl z-0 shadow-inner"
              initial={false}
              animate={{
                left: `${(currentStepIndex / STEPS.length) * 100}%`,
                width: `${100 / STEPS.length}%`
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {STEPS.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={step.id} className="relative z-10 flex-1 flex flex-col items-center justify-center py-2 md:py-4 cursor-default">
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 mb-1">
                    <div className={`
                        w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border transition-all duration-300
                        ${isActive ? 'bg-gold-500 text-navy-900 border-gold-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' :
                        isCompleted ? 'bg-primary-500/20 text-primary-400 border-primary-500/50' :
                          'bg-navy-900/50 text-slate-500 border-white/10'}
                      `}>
                      {isCompleted ? <CheckIcon className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} /> : <step.icon className="w-3 h-3 md:w-4 md:h-4" />}
                    </div>
                    <span className={`text-[10px] md:text-sm font-bold tracking-wider uppercase transition-colors duration-300 ${isActive ? 'text-white' : isCompleted ? 'text-primary-400' : 'text-slate-500'} text-center`}>
                      <span className="hidden xs:inline">{step.label}</span>
                      <span className="xs:hidden">{index + 1}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="w-full"
          >
            {state === 'upload' && (
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block"
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-sans tracking-tight text-white mb-4 md:mb-6 drop-shadow-2xl px-4">
                      Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">New Deal</span>
                    </h1>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-slate-400 max-w-2xl mx-auto"
                  >
                    Drag & drop your term sheet to ignite the AI engine. We'll extract entities, covenants, and LMA parameters automatically.
                  </motion.p>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold-400/20 to-primary-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-navy-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-1 overflow-hidden">
                    <TermSheetUpload onFileUpload={handleFileUpload} />
                  </div>
                </div>
              </div>
            )}

            {state === 'generating' && (
              <div className="w-full flex flex-col items-center justify-center min-h-[500px]">
                <GenerationProgress
                  fileName={uploadedFile?.name || 'Term Sheet.pdf'}
                  borrowerName={extractedData?.borrower.name}
                />
              </div>
            )}

            {state === 'preview' && generatedDocument && (
              <div className="w-full">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-success-500/10 text-success-400 border border-success-500/20 mb-4 font-mono text-sm">
                    <CheckIcon className="w-4 h-4" /> GENERATION SUCCESSFUL
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-3">Deal Documentation Ready</h2>
                  <p className="text-slate-400">Review your LMA-compliant Facility Agreement below.</p>
                </div>

                <div className="bg-navy-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="p-8">
                    <DocumentPreview
                      document={generatedDocument}
                      onStartOver={() => setState('upload')}
                      isPremium
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
}
