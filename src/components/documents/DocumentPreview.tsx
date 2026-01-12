// src/components/documents/DocumentPreview.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ShareIcon,
  XMarkIcon,
  LightBulbIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import type { Document } from '../../types';
import useAppStore from '../../store/appStore';
import { motion } from 'framer-motion';

interface DocumentPreviewProps {
  document: Document;
  onStartOver: () => void;
  isPremium?: boolean;
}

export default function DocumentPreview({ document, onStartOver }: DocumentPreviewProps) {
  const navigate = useNavigate();
  const { showToast } = useAppStore();
  const handleDownload = async () => {
    try {
      // Import the document generator
      const { generateFacilityAgreement } = await import('../../lib/document-generator');

      // Generate and download the document
      await generateFacilityAgreement({
        borrowerName: 'TechCorp Industries Inc.',
        facilityAmount: '$450,000,000',
        dealType: 'Leveraged Buyout (LBO)',
        jurisdiction: 'New York Law'
      });
      showToast('success', 'Document Downloaded!', 'Your facility agreement has been downloaded successfully.');
    } catch (error) {
      console.error('Download error:', error);
      showToast('error', 'Download Failed', 'Error generating document. Please try again.');
    }
  };

  const handleShare = () => {
    showToast('info', 'Share Feature Coming Soon', 'Share functionality will be available in the full release. For now, you can download and share manually.');
  };

  const [showInsight, setShowInsight] = useState(true);

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* AI Insight Overlay */}
      {showInsight && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-navy-900/90 backdrop-blur-xl border border-gold-500/50 text-white px-8 py-4 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center gap-6 max-w-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent opacity-50" />

            <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/50 flex items-center justify-center flex-shrink-0 animate-pulse">
              <LightBulbIcon className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-bold text-gold-400 text-sm mb-1 uppercase tracking-wider">AI Strategic Insight</h4>
              <p className="text-sm text-slate-200">
                Section 7.1 leverage covenant (5.0x) is <strong>0.25x below</strong> market standard. Consider negotiating a step-up.
              </p>
            </div>
            <button
              onClick={() => setShowInsight(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
            >
              <XMarkIcon className="w-5 h-5 text-slate-400 hover:text-white" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Success Animation */}
      <div className="text-center mb-12 animate-slide-up">
        <div className="inline-flex items-center justify-center h-24 w-24 bg-green-500/10 rounded-full mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CheckCircleIcon className="h-12 w-12 text-green-400" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-3">Facility Agreement Generated</h2>
        <p className="text-slate-400 text-lg">
          LMA-compliant draft ready for review and execution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Preview - Document Surface */}
        <div className="lg:col-span-2 space-y-8">
          {/* Document Card */}
          <div className="bg-navy-800/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-8 py-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                  <DocumentTextIcon className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{document.document_name}</h3>
                  <p className="text-slate-400 text-sm font-mono">Ver {document.version_number}.0 • {document.created_at.split('T')[0]}</p>
                </div>
              </div>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                <SparklesIcon className="h-4 w-4 mr-2" />
                AI Generated
              </span>
            </div>

            <div className="p-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Pages', value: document.page_count },
                  { label: 'Words', value: document.word_count.toLocaleString() },
                  { label: 'Time', value: `${document.generation_time_seconds}s` },
                  { label: 'Confidence', value: `${Math.round(document.ai_confidence_score! * 100)}%` }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-navy-900/50 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Document Sections */}
              <div className="mb-8">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gold-400 rounded-full" />
                  Structure Analysis
                </h4>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {document.sections?.map((section, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-slate-500 bg-navy-900 px-2 py-1 rounded">
                          {section.page_start}-{section.page_end}
                        </span>
                        <span className="text-sm font-medium text-slate-200">{section.section_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-navy-900 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400" style={{ width: `${section.ai_confidence * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!document.sections || document.sections.length === 0) && (
                    <div className="text-center text-slate-500 py-4 italic">Sections generated dynamically...</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span>Download PDF Bundle</span>
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                >
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sample Content Preview */}
          <div className="bg-navy-900/50 backdrop-blur-md rounded-xl border border-white/10 p-8 shadow-lg">
            <h4 className="font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary-400 rounded-full" />
              Clause Preview: Financial Covenants
            </h4>
            <div className="bg-black/40 rounded-lg p-6 font-mono text-sm text-slate-300 space-y-4 border border-white/5 leading-relaxed">
              <p>
                <span className="text-gold-400 font-bold block mb-2">Section 7.1 Total Net Leverage Ratio</span>
                The Borrower shall not permit the Total Net Leverage Ratio as of the last day of any fiscal quarter to exceed <span className="bg-yellow-500/20 text-yellow-200 px-1 rounded">5.00:1.00</span>, provided that commencing with the fiscal quarter ending December 31, 2027, such ratio shall not exceed 4.75:1.00.
              </p>
              <p>
                For purposes of this Section 7.1, "Total Net Leverage Ratio" means, as of any date of determination, the ratio of (a) Consolidated Total Debt as of such date minus Unrestricted Cash in excess of $30,000,000 to (b) Consolidated EBITDA for the most recently ended Test Period.
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Watermarked Preview • Official LMA Template v2025.1
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* LMA Compliance */}
          <div className="bg-navy-800/50 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg">
            <h4 className="font-bold text-white mb-6">LMA Compliance Check</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-sm text-slate-400">Template</span>
                <span className="text-sm font-medium text-white text-right">
                  {document.lma_compliance?.template_version}
                </span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-sm text-slate-400">Jurisdiction</span>
                <span className="text-sm font-medium text-white">
                  {document.lma_compliance?.jurisdiction}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Score</span>
                <span className="text-lg font-bold text-green-400">
                  {Math.round(document.lma_compliance?.compliance_score! * 100)}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-green-400" style={{ width: '98%' }} />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-3 text-green-400/90 text-sm bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span>{document.lma_compliance?.mandatory_provisions_included} Mandatory Provisions</span>
              </div>
              <div className="flex items-center gap-3 text-green-400/90 text-sm bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span>{document.lma_compliance?.optional_provisions_included} Optional Provisions</span>
              </div>
            </div>
          </div>

          {/* AI Model Info */}
          <div className="relative overflow-hidden rounded-xl p-6 text-white shadow-lg group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="h-6 w-6 text-yellow-300" />
                <h4 className="font-bold">Gemini 2.0 Flash</h4>
              </div>
              <div className="space-y-3 text-sm border-t border-white/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Reasoning</span>
                  <span className="font-bold">Chain-of-Thought</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Context Window</span>
                  <span className="font-bold">2M Tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Latency</span>
                  <span className="font-bold">{document.generation_time_seconds}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps - Clickable CTAs */}
          <div className="bg-navy-800/50 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg">
            <h4 className="font-bold text-white mb-4">Next Actions</h4>
            <div className="space-y-3">
              <motion.button
                onClick={() => navigate('/negotiations')}
                className="w-full flex items-center justify-between gap-4 group p-3 rounded-lg bg-gold-500/10 border border-gold-500/20 hover:border-gold-500/50 transition-all"
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-500/30">
                    <span className="text-gold-400 font-bold text-xs">1</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">Resolve Covenant Conflicts</p>
                    <p className="text-slate-400 text-xs">AI-powered negotiation insights</p>
                  </div>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/analytics')}
                className="w-full flex items-center justify-between gap-4 group p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:border-green-500/50 transition-all"
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                    <span className="text-green-400 font-bold text-xs">2</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">View ESG Analytics</p>
                    <p className="text-slate-400 text-xs">Sustainability metrics & scores</p>
                  </div>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-green-400 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/documents')}
                className="w-full flex items-center justify-between gap-4 group p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/50 transition-all"
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <span className="text-blue-400 font-bold text-xs">3</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">View All Documents</p>
                    <p className="text-slate-400 text-xs">Document library & versions</p>
                  </div>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>

          {/* Start Over */}
          <button
            onClick={onStartOver}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 border border-white/10 text-slate-300 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Start New Deal
          </button>
        </div>
      </div>
    </div>
  );
}
