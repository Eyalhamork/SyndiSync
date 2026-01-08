// src/components/documents/DocumentPreview.tsx
import { useState } from 'react';
import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ShareIcon,
  XMarkIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import type { Document } from '../../types';
import useAppStore from '../../store/appStore';

interface DocumentPreviewProps {
  document: Document;
  onStartOver: () => void;
}

export default function DocumentPreview({ document, onStartOver }: DocumentPreviewProps) {
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 animate-slide-up">
          <div className="bg-navy-900/90 backdrop-blur-md border border-gold-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-lg">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
              <LightBulbIcon className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-bold text-gold-400 text-sm mb-1">AI Strategic Insight</h4>
              <p className="text-sm text-slate-300">
                Section 7.1 leverage covenant (5.0x) is <strong>0.25x below</strong> the bank's standard risk tolerance. Consider negotiating a step-up.
              </p>
            </div>
            <button
              onClick={() => setShowInsight(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-slate-400 hover:text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Success Animation */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="inline-flex items-center justify-center h-20 w-20 bg-success-100 rounded-full mb-4">
          <CheckCircleIcon className="h-12 w-12 text-success-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Document Generated Successfully!</h2>
        <p className="text-gray-600">
          Your facility agreement has been created and is ready for review
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Card */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                  <div>
                    <h3 className="text-white font-semibold">{document.document_name}</h3>
                    <p className="text-primary-100 text-sm">Version {document.version_number}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-700">
                  <SparklesIcon className="h-4 w-4 mr-1" />
                  AI Generated
                </span>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{document.page_count}</p>
                  <p className="text-xs text-gray-600">Pages</p>
                </div>
                <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{document.word_count.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Words</p>
                </div>
                <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{document.generation_time_seconds}s</p>
                  <p className="text-xs text-gray-600">Generated</p>
                </div>
                <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{Math.round(document.ai_confidence_score! * 100)}%</p>
                  <p className="text-xs text-gray-600">Confidence</p>
                </div>
              </div>

              {/* Document Sections */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Document Structure</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {document.sections?.map((section, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">
                          {section.page_start}-{section.page_end}
                        </span>
                        <span className="text-sm text-gray-900">{section.section_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-success-600 font-medium">
                          {Math.round(section.ai_confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors text-sm md:text-base"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Download Word Document</span>
                  <span className="sm:hidden">Download</span>
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  <ShareIcon className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Sample Content Preview */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Sample Clause Preview</h4>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 space-y-3">
              <p className="font-semibold">Section 7.1 Total Net Leverage Ratio</p>
              <p>
                The Borrower shall not permit the Total Net Leverage Ratio as of the last day of any fiscal quarter to exceed 5.0:1.0, provided that commencing with the fiscal quarter ending December 31, 2027, such ratio shall not exceed 4.75:1.0.
              </p>
              <p>
                For purposes of this Section 7.1, "Total Net Leverage Ratio" means, as of any date of determination, the ratio of (a) Consolidated Total Debt as of such date minus Unrestricted Cash in excess of $30,000,000 to (b) Consolidated EBITDA for the most recently ended Test Period.
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              This is a sample excerpt. The full document contains all articles, schedules, and exhibits.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* LMA Compliance */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">LMA Compliance</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Template Version</span>
                <span className="text-sm font-medium text-gray-900">
                  {document.lma_compliance?.template_version}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Jurisdiction</span>
                <span className="text-sm font-medium text-gray-900">
                  {document.lma_compliance?.jurisdiction}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliance Score</span>
                <span className="text-sm font-semibold text-success-600">
                  {Math.round(document.lma_compliance?.compliance_score! * 100)}%
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-success-600 mb-2">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {document.lma_compliance?.mandatory_provisions_included} Mandatory Provisions
                </span>
              </div>
              <div className="flex items-center gap-2 text-success-600">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {document.lma_compliance?.optional_provisions_included} Optional Provisions
                </span>
              </div>
            </div>
          </div>

          {/* AI Model Info */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-medium p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <SparklesIcon className="h-6 w-6" />
              <h4 className="font-semibold">AI Generation Details</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-100">Model</span>
                <span className="font-medium">Claude Sonnet 4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Confidence</span>
                <span className="font-medium">{Math.round(document.ai_confidence_score! * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Processing Time</span>
                <span className="font-medium">{document.generation_time_seconds}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Precedents Analyzed</span>
                <span className="font-medium">10,000+</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Next Steps</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-semibold text-xs">1</span>
                </div>
                <p className="text-gray-700">Review generated document for accuracy</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-semibold text-xs">2</span>
                </div>
                <p className="text-gray-700">Share with syndicate members for feedback</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-semibold text-xs">3</span>
                </div>
                <p className="text-gray-700">Begin negotiation on key provisions</p>
              </div>
            </div>
          </div>

          {/* Start Over */}
          <button
            onClick={onStartOver}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Generate Another Document
          </button>
        </div>
      </div>
    </div>
  );
}
