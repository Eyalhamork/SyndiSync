import { useState, useEffect } from 'react';
import { FiPlus, FiFileText, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { initializeGemini, analyzeTermSheet, analyzeTermSheetImage, getApiKey } from '../../lib/gemini';
import { CurrencyCounter, AnimatedCounter } from '../common/AnimatedCounter';
import { ScanningOverlay } from '../common/ScanningOverlay';
import { useLiveNotifications } from '../../hooks/useLiveNotifications';

const FAKE_DEALS = [
  { id: 1, client: "Acme Corp LBO", amount: "$450M", status: "Documentation", bank: "JPM Lead", date: "2m ago", path: "/documents" },
  { id: 2, client: "Stark Ind. Revolver", amount: "$1.2B", status: "Negotiation", bank: "BofA Lead", date: "4h ago", path: "/negotiations" },
  { id: 3, client: "Wayne Ent. Bridge", amount: "$850M", status: "Closed", bank: "Citi Lead", date: "1d ago", path: "/documents" },
];

const PROCESSING_STEPS = [
  "Analyzing deal structure...",
  "Retrieving market precedents...",
  "Generating 287 pages...",
  "Cross-checking LMA compliance..."
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isVisionMode, setIsVisionMode] = useState(false); // Track if processing an image

  // Enable live activity notifications for wow factor
  useLiveNotifications(true);

  // Processing Logic (Fake vs Real)
  useEffect(() => {
    if (!isUploading) return;

    const isLive = window.localStorage.getItem('liveMode') === 'true';
    const apiKey = getApiKey();

    if (isLive && apiKey) {
      // We handle real logic in the upload handler, but we can update steps here if needed
      // For now, let's keep the stepping animation for visual feedback while waiting
      if (processingStep < PROCESSING_STEPS.length) {
        const timeout = setTimeout(() => {
          setProcessingStep(prev => prev + 1);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      // Fake Mode
      if (processingStep < PROCESSING_STEPS.length) {
        const timeout = setTimeout(() => {
          setProcessingStep(prev => prev + 1);
        }, 1500);
        return () => clearTimeout(timeout);
      } else if (processingStep === PROCESSING_STEPS.length) {
        setTimeout(() => {
          setShowSuccess(true);
          setTimeout(() => navigate('/documents'), 2000);
        }, 1000);
      }
    }
  }, [isUploading, processingStep, navigate]);

  const handleStartUpload = () => {
    setShowUploadModal(true);
  };

  const processFileReal = async (text: string) => {
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        alert("Please enter API Key in Sidebar or .env file");
        setIsUploading(false);
        return;
      }
      initializeGemini(apiKey);

      // Step 1: Analyze
      setProcessingStep(1);
      const analysis = await analyzeTermSheet(text);

      // Save to local storage for other pages to use
      window.localStorage.setItem('current_deal_analysis', analysis);

      // Skip to success
      setProcessingStep(PROCESSING_STEPS.length);
      setShowSuccess(true);
      setTimeout(() => navigate('/documents'), 2000);
    } catch (e) {
      console.error(e);
      alert("AI Processing Failed: " + e);
      setIsUploading(false);
    }
  };

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setProcessingStep(0);

    const isLive = window.localStorage.getItem('liveMode') === 'true';
    if (isLive) {
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();

        // Handle Images (Vision)
        if (file.type.startsWith('image/')) {
          setIsVisionMode(true); // Enable scanning overlay for images
          reader.onload = async (ev) => {
            const base64String = ev.target?.result as string;
            // Strip prefix for API
            const base64Data = base64String.split(',')[1];

            try {
              const apiKey = getApiKey();
              if (!apiKey) throw new Error("No API Key");
              initializeGemini(apiKey);

              // Vision Analysis
              setProcessingStep(1); // "Retrieving..." matches "Scanning..." visually
              const analysis = await analyzeTermSheetImage(base64Data, file.type);

              window.localStorage.setItem('current_deal_analysis', analysis);

              // Success
              setProcessingStep(PROCESSING_STEPS.length);
              setShowSuccess(true);
              setIsVisionMode(false);
              setTimeout(() => navigate('/documents'), 2000);
            } catch (e) {
              console.error(e);
              alert("Vision Scan Failed: " + e);
              setIsUploading(false);
              setIsVisionMode(false);
            }
          };
          reader.readAsDataURL(file);
        }
        // Handle Text Files (Legacy)
        else {
          reader.onload = (ev) => {
            const text = ev.target?.result as string;
            processFileReal(text);
          };
          reader.readAsText(file);
        }
      }
    }
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-navy-900 text-slate-100 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-up">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Good morning, <span className="text-gradient-gold">Layee</span>
          </h1>
          <p className="text-slate-400">Your deal pipeline requires attention.</p>
        </div>
        <button
          onClick={handleStartUpload}
          className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 font-medium hover:bg-gold-500/20 hover:border-gold-500/50 transition-all group"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform" />
          <span>New Deal</span>
        </button>
      </div>

      {/* ESG Intelligence Card Link */}
      <div
        onClick={() => navigate('/analytics')}
        className="glass-card p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all border-l-4 border-green-500 animate-slide-up"
        style={{ animationDelay: '0.15s' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xl">
            🌿
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">ESG Intelligence</h3>
            <p className="text-slate-400 text-sm">Portfolio Sustainability Score</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-400">92/100</p>
          <p className="text-xs text-green-500 font-medium flex items-center justify-end gap-1">
            <FiCheckCircle /> SLLP Certified
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-slate-400 text-sm">Active Volume</p>
          <p className="text-3xl font-bold mt-2 text-primary-400">
            $<AnimatedCounter value={15.2} decimals={1} duration={2000} />B
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-slate-400 text-sm">Deals in Progress</p>
          <p className="text-3xl font-bold mt-2 text-white">
            <AnimatedCounter value={7} decimals={0} duration={1500} />
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-slate-400 text-sm">Avg. Close Time</p>
          <p className="text-3xl font-bold mt-2 text-gold-400">
            <AnimatedCounter value={12} decimals={0} duration={1800} /> Days
          </p>
        </div>
      </div>

      {/* ROI Savings Card */}
      <div className="glass-card p-6 rounded-2xl border-l-4 border-gold-500 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Deal ROI Calculator</h3>
            <p className="text-slate-400 text-sm">Total Savings for "Acme Corp LBO"</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-gold-400">
              <CurrencyCounter value={2060000} duration={2500} />
            </p>
            <p className="text-xs text-green-400 font-medium">
              <AnimatedCounter value={87} decimals={0} duration={1500} />% cost reduction
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Legal Fees</p>
            <p className="text-lg font-semibold text-white">
              <CurrencyCounter value={1200000} duration={2200} /> saved
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time Value</p>
            <p className="text-lg font-semibold text-white">
              <CurrencyCounter value={650000} duration={2000} />
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Opportunity</p>
            <p className="text-lg font-semibold text-white">
              <CurrencyCounter value={210000} duration={1800} />
            </p>
          </div>
        </div>
      </div>

      {/* Upload Modal with Drag & Drop */}
      {(showUploadModal && !isUploading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowUploadModal(false)}>
          <div
            className="glass-card p-12 rounded-2xl max-w-2xl w-full text-center border-2 border-dashed border-white/20 hover:border-gold-500/50 transition-colors cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('file-upload-input')?.click(); // Trigger hidden input
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragDrop}
          >
            <input
              type="file"
              id="file-upload-input"
              className="hidden"
              accept=".pdf,image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setIsUploading(true);
                  setProcessingStep(0);
                  // Reuse the existing drag logic by creating a synthetic event or just calling the logic directly
                  // For simplicity, we'll duplicate the reader logic briefly or extract it.
                  // Ideally we extract "handleFile(file)" but for now let's inline-adapt.

                  const isLive = window.localStorage.getItem('liveMode') === 'true';
                  if (isLive) {
                    const reader = new FileReader();
                    if (file.type.startsWith('image/')) {
                      setIsVisionMode(true); // Enable scanning overlay for images
                      reader.onload = async (ev) => {
                        const base64String = ev.target?.result as string;
                        const base64Data = base64String.split(',')[1];
                        try {
                          const apiKey = getApiKey();
                          if (!apiKey) throw new Error("No API Key");
                          initializeGemini(apiKey);
                          setProcessingStep(1);
                          const analysis = await analyzeTermSheetImage(base64Data, file.type);
                          window.localStorage.setItem('current_deal_analysis', analysis);
                          setProcessingStep(PROCESSING_STEPS.length);
                          setShowSuccess(true);
                          setIsVisionMode(false);
                          setTimeout(() => navigate('/documents'), 2000);
                        } catch (err) {
                          console.error(err);
                          alert("Vision Scan Failed: " + err);
                          setIsUploading(false);
                          setIsVisionMode(false);
                        }
                      };
                      reader.readAsDataURL(file);
                    } else {
                      reader.onload = (ev) => {
                        const text = ev.target?.result as string;
                        processFileReal(text);
                      };
                      reader.readAsText(file);
                    }
                  } else {
                    // Non-live mode just proceeds
                    setIsUploading(true);
                  }
                }
              }}
            />
            <div className="w-20 h-20 mx-auto rounded-full bg-navy-800 flex items-center justify-center text-slate-400 group-hover:text-gold-500 group-hover:scale-110 transition-all mb-6">
              <FiUploadCloud size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Drop Term Sheet PDF</h3>
            <p className="text-slate-400">or click to browse local files</p>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-900/95 backdrop-blur-xl animate-fade-in">
          {!showSuccess ? (
            <div className="w-full max-w-2xl text-center space-y-8 relative">
              {/* Scanning Overlay ONLY for Vision/Image processing in Live mode */}
              {isVisionMode && (
                <div className="absolute inset-0 -m-8 pointer-events-none">
                  <ScanningOverlay isScanning={true} />
                </div>
              )}

              <div className="relative w-32 h-32 mx-auto z-10">
                <div className="absolute inset-0 border-4 border-navy-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">{isVisionMode ? '🔍' : '✨'}</div>
              </div>

              {/* Step-based text ONLY when NOT in vision mode */}
              {!isVisionMode && (
                <div className="space-y-2 relative z-10">
                  <h2 className="text-3xl font-bold text-white animate-pulse">
                    {PROCESSING_STEPS[Math.min(processingStep, PROCESSING_STEPS.length - 1)]}
                  </h2>
                  <div className="h-2 w-64 mx-auto bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-gold-400 transition-all duration-3000 ease-linear"
                      style={{ width: `${((processingStep + 1) / PROCESSING_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Vision mode shows its own centered text */}
              {isVisionMode && (
                <div className="space-y-2 relative z-10">
                  <h2 className="text-3xl font-bold text-gold-400 animate-pulse">
                    AI Vision Scanning Document...
                  </h2>
                  <p className="text-slate-400">Extracting key terms and structure</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6 animate-slide-up">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 text-green-400 text-6xl mb-4">
                <FiCheckCircle />
              </div>
              <h2 className="text-4xl font-bold text-white">Deal Generated Successfully</h2>
              <p className="text-xl text-slate-300">43 seconds • 287 pages created</p>
            </div>
          )}
        </div>
      )}

      {/* Active Deals List */}
      <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-xl font-bold text-white mb-6">Recent Deals</h3>
        <div className="space-y-4">
          {FAKE_DEALS.map((deal) => (
            <div
              key={deal.id}
              onClick={() => navigate(deal.path)}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-gold-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-navy-800 flex items-center justify-center text-gold-500 group-hover:scale-110 transition-transform">
                  <FiFileText size={24} />
                </div>
                <div>
                  <h4 className="text-white font-medium text-lg group-hover:text-gold-400 transition-colors">{deal.client}</h4>
                  <p className="text-sm text-slate-400">{deal.bank} • {deal.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{deal.amount}</p>
                <div className={`text-xs px-3 py-1 rounded-full inline-block mt-1 ${deal.status === 'Documentation' ? 'bg-primary-500/20 text-primary-400' :
                  deal.status === 'Negotiation' ? 'bg-gold-500/20 text-gold-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                  {deal.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
