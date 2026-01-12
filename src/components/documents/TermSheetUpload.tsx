// src/components/documents/TermSheetUpload.tsx
import { useState, useCallback } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon, PhotoIcon, ExclamationTriangleIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ExtractedDealData, DEMO_DEAL_DATA } from '../../lib/pdf-generator';

interface TermSheetUploadProps {
  onFileUpload: (file: File, extractedData?: ExtractedDealData, useDemoData?: boolean) => void;
}

type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid';

export default function TermSheetUpload({ onFileUpload }: TermSheetUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ExtractedDealData | null>(null);
  const [showDemoOption, setShowDemoOption] = useState(false);

  // Editable fields for deal configuration
  const [borrowerName, setBorrowerName] = useState('');
  const [dealType, setDealType] = useState('Leveraged Buyout (LBO)');
  const [facilityAmount, setFacilityAmount] = useState('');
  const [jurisdiction, setJurisdiction] = useState('New York Law');

  const acceptedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif'
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndProcessFile = async (file: File) => {
    setSelectedFile(file);
    setValidationState('validating');
    setValidationMessage('Analyzing document with AI...');
    setShowDemoOption(false);

    try {
      // Check if Gemini is available
      const geminiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;

      if (!geminiKey) {
        // No API key - skip validation and go straight to use demo data
        setValidationState('valid');
        setValidationMessage('AI validation skipped (no API key). Using demo data extraction.');
        setExtractedData(DEMO_DEAL_DATA);
        setBorrowerName(DEMO_DEAL_DATA.borrower.name);
        setFacilityAmount(`$${(DEMO_DEAL_DATA.facility.amount / 1000000).toFixed(0)}M`);
        setShowDemoOption(false);
        return;
      }

      // Import Gemini functions dynamically to avoid circular deps
      const { initializeGemini, isGeminiInitialized, validateTermSheetImage, extractTermSheetDataFromImage } = await import('../../lib/gemini');

      if (!isGeminiInitialized()) {
        initializeGemini(geminiKey);
      }

      // Convert file to base64
      const base64 = await fileToBase64(file);
      const mimeType = file.type || 'image/jpeg';

      // Step 1: Validate if it's a term sheet
      setValidationMessage('Validating document type...');
      const validation = await validateTermSheetImage(base64, mimeType);

      if (!validation.is_valid_term_sheet) {
        setValidationState('invalid');
        setValidationMessage(validation.rejection_reason || 'This does not appear to be a valid term sheet.');
        setShowDemoOption(true);
        return;
      }

      // Step 2: Extract data
      setValidationMessage('Extracting deal information...');
      const data = await extractTermSheetDataFromImage(base64, mimeType);

      setExtractedData(data);
      setValidationState('valid');
      setValidationMessage(`Successfully extracted data! Confidence: ${(validation.confidence * 100).toFixed(0)}%`);

      // Populate editable fields
      setBorrowerName(data.borrower.name);
      setFacilityAmount(`$${(data.facility.amount / 1000000).toFixed(0)}M`);
      if (data.jurisdiction) {
        setJurisdiction(data.jurisdiction);
      }

    } catch (error) {
      console.error('Validation error:', error);
      setValidationState('invalid');
      setValidationMessage('Failed to analyze document. Please try again or use demo data.');
      setShowDemoOption(true);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (acceptedTypes.includes(file.type) || file.name.endsWith('.pdf')) {
        validateAndProcessFile(file);
      } else {
        alert('Please upload a PDF or image file (PNG, JPG, WebP)');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleGenerate = () => {
    if (selectedFile && extractedData) {
      // Apply user edits to extracted data
      const finalData = {
        ...extractedData,
        borrower: {
          ...extractedData.borrower,
          name: borrowerName || extractedData.borrower.name
        },
        facility: {
          ...extractedData.facility,
          amount: parseFacilityAmount(facilityAmount) || extractedData.facility.amount
        },
        jurisdiction: jurisdiction
      };
      onFileUpload(selectedFile, finalData, false);
    }
  };

  const handleUseDemoData = () => {
    if (selectedFile) {
      setExtractedData(DEMO_DEAL_DATA);
      setBorrowerName(DEMO_DEAL_DATA.borrower.name);
      setFacilityAmount(`$${(DEMO_DEAL_DATA.facility.amount / 1000000).toFixed(0)}M`);
      setValidationState('valid');
      setValidationMessage('Using demo data for document generation.');
      setShowDemoOption(false);
    } else {
      // Create a dummy file for demo mode
      const dummyFile = new File(['demo'], 'demo_term_sheet.pdf', { type: 'application/pdf' });
      setSelectedFile(dummyFile);
      setExtractedData(DEMO_DEAL_DATA);
      setBorrowerName(DEMO_DEAL_DATA.borrower.name);
      setFacilityAmount(`$${(DEMO_DEAL_DATA.facility.amount / 1000000).toFixed(0)}M`);
      setValidationState('valid');
      setValidationMessage('Using demo data for document generation.');
      setShowDemoOption(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationState('idle');
    setValidationMessage('');
    setExtractedData(null);
    setShowDemoOption(false);
    setBorrowerName('');
    setFacilityAmount('');
  };

  const parseFacilityAmount = (value: string): number => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    if (value.toLowerCase().includes('b')) {
      return num * 1000000000;
    }
    if (value.toLowerCase().includes('m') || num < 1000) {
      return num * 1000000;
    }
    return num;
  };

  const isReadyToGenerate = validationState === 'valid' && extractedData !== null;

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-transparent rounded-xl p-8 w-full">
        {/* Upload Area */}
        <div
          className={clsx(
            'border-2 border-dashed rounded-xl p-16 text-center transition-all duration-300 relative overflow-hidden group',
            isDragging ? 'border-gold-400 bg-gold-400/10' : 'border-white/10 hover:border-gold-400/50 hover:bg-white/5',
            validationState === 'validating' && 'border-yellow-400/50 bg-yellow-400/5',
            validationState === 'valid' && 'border-green-400/50 bg-green-400/5',
            validationState === 'invalid' && 'border-red-400/50 bg-red-400/5'
          )}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* Background Highlight for interaction */}
          <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {!selectedFile ? (
            <div className="relative z-10">
              <div className="flex justify-center gap-4 mb-6">
                <div className="p-4 rounded-full bg-navy-800 border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CloudArrowUpIcon className="h-10 w-10 text-gold-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Upload Term Sheet
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                Drag and drop your PDF or image here.
                <br />
                <span className="text-sm text-primary-400 font-medium">
                  Our AI Vision engine will extract deal parameters instantly.
                </span>
              </p>
              <label className="inline-flex items-center gap-2 px-8 py-3 bg-white text-navy-900 font-bold rounded-full hover:bg-gray-100 cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.gif"
                  onChange={handleFileSelect}
                />
                <PhotoIcon className="w-5 h-5" />
                Select File
              </label>
              <p className="text-xs text-slate-500 mt-6 uppercase tracking-wider">
                Supported: PDF, PNG, JPG • Max size: 25MB
              </p>

              {/* Demo Data Option */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-sm text-slate-500 mb-3">No document available?</p>
                <button
                  onClick={handleUseDemoData}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800/50 text-slate-300 font-medium rounded-lg hover:bg-navy-700 hover:text-white transition-colors border border-white/5"
                >
                  <SparklesIcon className="h-4 w-4 text-gold-400" />
                  Load Demo Data
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              {/* File Info */}
              <div className="flex items-center justify-between bg-navy-800/80 rounded-xl p-4 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    'h-14 w-14 rounded-xl flex items-center justify-center border',
                    validationState === 'valid' ? 'bg-green-400/10 border-green-400/30' :
                      validationState === 'invalid' ? 'bg-red-400/10 border-red-400/30' :
                        validationState === 'validating' ? 'bg-yellow-400/10 border-yellow-400/30' : 'bg-blue-400/10 border-blue-400/30'
                  )}>
                    {selectedFile.type.startsWith('image/') ? (
                      <PhotoIcon className={clsx(
                        'h-7 w-7',
                        validationState === 'valid' ? 'text-green-400' :
                          validationState === 'invalid' ? 'text-red-400' :
                            validationState === 'validating' ? 'text-yellow-400' : 'text-blue-400'
                      )} />
                    ) : (
                      <DocumentTextIcon className={clsx(
                        'h-7 w-7',
                        validationState === 'valid' ? 'text-green-400' :
                          validationState === 'invalid' ? 'text-red-400' :
                            validationState === 'validating' ? 'text-yellow-400' : 'text-blue-400'
                      )} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">{selectedFile.name}</p>
                    <p className="text-sm text-slate-400 font-mono">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Validation Status */}
              <div className={clsx(
                'flex items-center justify-center gap-3 p-4 rounded-xl border backdrop-blur-sm',
                validationState === 'validating' && 'bg-yellow-400/10 border-yellow-400/20',
                validationState === 'valid' && 'bg-green-400/10 border-green-400/20',
                validationState === 'invalid' && 'bg-red-400/10 border-red-400/20'
              )}>
                {validationState === 'validating' && (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                    <span className="text-yellow-300 font-medium tracking-wide">{validationMessage}</span>
                  </>
                )}
                {validationState === 'valid' && (
                  <>
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    <span className="text-green-300 font-medium tracking-wide">{validationMessage}</span>
                  </>
                )}
                {validationState === 'invalid' && (
                  <>
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    <span className="text-red-300 font-medium tracking-wide">{validationMessage}</span>
                  </>
                )}
              </div>

              {/* Use Demo Data Button (when validation fails) */}
              {showDemoOption && (
                <div className="flex justify-center animate-fade-in">
                  <button
                    onClick={handleUseDemoData}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/10"
                  >
                    <SparklesIcon className="h-5 w-5 text-gold-400" />
                    Continue with Demo Data
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Deal Configuration (only show when valid) */}
        {isReadyToGenerate && (
          <div className="mt-8 space-y-8 animate-slide-up">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">Deal Configuration</h3>
              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full font-mono">
                AI_EXTRACTED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-gold-400 transition-colors">
                  Borrower Name
                </label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full px-4 py-3 bg-navy-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-white placeholder-slate-500 transition-all font-medium"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-gold-400 transition-colors">
                  Deal Type
                </label>
                <select
                  value={dealType}
                  onChange={(e) => setDealType(e.target.value)}
                  className="w-full px-4 py-3 bg-navy-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-white transition-all font-medium"
                >
                  <option>Leveraged Buyout (LBO)</option>
                  <option>Acquisition Financing</option>
                  <option>Refinancing</option>
                  <option>Growth Capital</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-gold-400 transition-colors">
                  Facility Amount
                </label>
                <input
                  type="text"
                  value={facilityAmount}
                  onChange={(e) => setFacilityAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-navy-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-white font-mono transition-all"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-gold-400 transition-colors">
                  Jurisdiction
                </label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full px-4 py-3 bg-navy-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-white transition-all font-medium"
                >
                  <option>New York Law</option>
                  <option>English Law</option>
                  <option>Delaware Law</option>
                </select>
              </div>
            </div>

            {/* Extracted Details Summary */}
            {extractedData && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                <h4 className="text-sm font-bold text-gold-400 mb-4 uppercase tracking-widest">Extracted Terms</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div className="bg-navy-900/50 p-3 rounded-lg border border-white/5">
                    <span className="block text-slate-500 mb-1 text-xs uppercase">Leverage Ratio</span>
                    <span className="text-white font-mono text-lg">{extractedData.covenants.leverage_ratio}x</span>
                  </div>
                  <div className="bg-navy-900/50 p-3 rounded-lg border border-white/5">
                    <span className="block text-slate-500 mb-1 text-xs uppercase">Interest Cov</span>
                    <span className="text-white font-mono text-lg">{extractedData.covenants.interest_coverage}x</span>
                  </div>
                  <div className="bg-navy-900/50 p-3 rounded-lg border border-white/5">
                    <span className="block text-slate-500 mb-1 text-xs uppercase">Pricing</span>
                    <span className="text-white font-mono text-lg">{extractedData.pricing.base_rate} + {extractedData.pricing.margin_bps}</span>
                  </div>
                  <div className="bg-navy-900/50 p-3 rounded-lg border border-white/5">
                    <span className="block text-slate-500 mb-1 text-xs uppercase">ESG Linked</span>
                    <span className="text-white font-mono text-lg">{extractedData.esg.sustainability_linked ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                {extractedData.parties.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-3">
                    <span className="text-slate-500 text-sm whitespace-nowrap pt-1">Syndicate Members:</span>
                    <div className="flex flex-wrap gap-2">
                      {extractedData.parties.map((p, i) => (
                        <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-white border border-white/10">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Generate Button */}
            <div className="flex justify-end pt-8 border-t border-white/10">
              <button
                onClick={handleGenerate}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-bold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <SparklesIcon className="h-6 w-6" />
                <span>Initialize Generation</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}
