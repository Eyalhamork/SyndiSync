import { useNavigate } from 'react-router-dom';
import { FiDownload, FiArrowLeft, FiPlus, FiCheckCircle, FiUploadCloud, FiX, FiLoader } from 'react-icons/fi';
import { useRef, useState, useEffect } from 'react';
import { initializeGemini, analyzeTermSheet, analyzeTermSheetImage, getApiKey } from '../../lib/gemini';

const TOC_SECTIONS = [
  { id: 'definitions', label: '1. Definitions' },
  { id: 'facilities', label: '2. The Facilities' },
  { id: 'purpose', label: '3. Purpose' },
  { id: 'covenants', label: '22. Financial Covenants' },
  { id: 'representations', label: '18. Representations' },
];

export default function DocumentsList() {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showInsight, setShowInsight] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // Real Data State
  const [realData, setRealData] = useState<any>(null);

  const loadAnalysisData = () => {
    const isLive = window.localStorage.getItem('liveMode') === 'true';
    const analysisStr = window.localStorage.getItem('current_deal_analysis');

    if (isLive && analysisStr) {
      try {
        // Attempt to clean JSON if Gemini added backticks
        const cleanJson = analysisStr.replace(/```json/g, '').replace(/```/g, '');
        setRealData(JSON.parse(cleanJson));
        setShowInsight(true); // Show the insight panel with new data
      } catch (e) {
        console.error("Failed to parse analysis", e);
      }
    }
  };

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && mainRef.current) {
      mainRef.current.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  const handleFileUpload = async (file: File) => {
    const isLive = window.localStorage.getItem('liveMode') === 'true';

    if (!isLive) {
      // Demo mode: just close modal and show success
      setShowUploadModal(false);
      alert('Demo mode: Toggle "Live AI Mode" to process real documents.');
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      alert('Please enter your Gemini API key in the sidebar.');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Initializing AI...');

    try {
      initializeGemini(apiKey);

      if (file.type.startsWith('image/')) {
        // Handle image files with vision
        setProcessingStatus('Scanning document with AI Vision...');
        const reader = new FileReader();

        const result = await new Promise<string>((resolve, reject) => {
          reader.onload = async (ev) => {
            try {
              const base64String = ev.target?.result as string;
              const base64Data = base64String.split(',')[1];
              const analysis = await analyzeTermSheetImage(base64Data, file.type);
              resolve(analysis);
            } catch (e) {
              reject(e);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        window.localStorage.setItem('current_deal_analysis', result);
      } else {
        // Handle text files
        setProcessingStatus('Analyzing term sheet...');
        const text = await file.text();
        const analysis = await analyzeTermSheet(text);
        window.localStorage.setItem('current_deal_analysis', analysis);
      }

      setProcessingStatus('Complete!');

      // Reload the analysis data to update the UI
      loadAnalysisData();

      // Close modal after short delay
      setTimeout(() => {
        setIsProcessing(false);
        setShowUploadModal(false);
        setProcessingStatus('');
      }, 1000);

    } catch (error) {
      console.error('File processing error:', error);
      alert('Error processing file: ' + error);
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  return (
    <div className="h-screen bg-navy-900 flex flex-col overflow-hidden text-slate-100">
      {/* Top Bar */}
      <div className="h-16 glass-card flex items-center justify-between px-6 z-10 relative flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              {realData ? `${realData.borrower} - Facility Agreement` : 'Acme Corp LBO - Facility Agreement'}
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">LMA Compliant</span>
            </h1>
            <p className="text-xs text-slate-400">Generated {realData ? 'Just now' : '43s ago'} • v1.0 • 287 pages</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowUploadModal(true)} className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-gold-500/20 hover:border-gold-500/50 transition-all">
            <FiPlus /> Generate New
          </button>
          <button className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium shadow-glow transition-all">
            <FiDownload /> Download Word
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation (TOC) */}
        <div className="w-72 glass-card border-r border-white/5 flex flex-col hidden md:flex flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Document Structure</h3>
            <div className="space-y-1">
              {TOC_SECTIONS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm cursor-pointer text-slate-300 hover:text-white transition-colors"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">AI-Detected Key Terms</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-navy-800 border border-gold-500/30">
                <p className="text-xs text-gold-400 mb-1">Total Leverage Ratio</p>
                <p className="font-mono text-white text-lg">4.50:1.00</p>
              </div>
              <div className="p-3 rounded-lg bg-navy-800 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">Applicable Margin</p>
                <p className="font-mono text-white">SOFR + 3.25%</p>
              </div>
              <div className="p-3 rounded-lg bg-navy-800 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">Facility Amount</p>
                <p className="font-mono text-white">USD 450,000,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Document View */}
        <div ref={mainRef} className="flex-1 bg-navy-950 overflow-y-auto p-8 relative">

          {/* Floating AI Insight */}
          {showInsight && (
            <div className="absolute top-8 right-8 w-80 p-4 rounded-xl border-l-4 border-gold-500 animate-slide-in-right z-20 shadow-2xl bg-gold-400 text-navy-900">
              {/* Close button */}
              <button
                onClick={() => setShowInsight(false)}
                className="absolute top-2 right-2 p-1 hover:bg-navy-900/20 rounded-full transition-colors"
                title="Close insight"
              >
                <FiX size={16} />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-navy-900 animate-pulse"></div>
                <span className="text-xs font-bold text-navy-900 uppercase">AI Insight</span>
              </div>
              <p className="text-sm font-semibold text-navy-900 mb-2">
                {realData?.summary || "Financial Covenants automatically aligned with Q4 2025 mid-market LBO precedents."}
              </p>
              <p className="text-xs text-navy-700">
                {realData ? "Based on real-time analysis of uploaded term sheet." : "Based on analysis of 147 comparable transactions."}
              </p>
            </div>
          )}

          {/* Paper Page */}
          <div className="max-w-4xl mx-auto bg-white min-h-[2000px] shadow-2xl rounded-sm p-16 text-slate-800 font-serif leading-relaxed animate-slide-up">
            {/* Cover */}
            <div className="text-center mb-16 pb-16 border-b-2 border-slate-300">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-6">Dated 2 January 2026</p>
              <h1 className="text-4xl font-bold uppercase mb-2 text-slate-900">Topco Limited</h1>
              <p className="text-lg text-slate-600 mb-6">as Parent</p>
              <h2 className="text-2xl font-bold uppercase mt-8 text-slate-800">Senior Facilities Agreement</h2>
              <p className="mt-4 text-xl font-semibold text-slate-700">USD 450,000,000</p>
              <p className="mt-8 text-sm text-slate-500">Arranged by J.P. Morgan Securities LLC</p>
            </div>

            {/* Section 1: Definitions */}
            <section id="definitions" className="mb-12">
              <h3 className="text-xl font-bold uppercase tracking-widest text-slate-900 mb-6 border-b pb-2">Section 1: Interpretation</h3>
              <p className="font-bold mb-4">1.1 Definitions</p>
              <p className="mb-4">In this Agreement:</p>
              <div className="space-y-4 text-sm">
                <p>"<span className="bg-yellow-100 px-1 font-bold border-b-2 border-gold-400">Acquisition</span>" means the acquisition by the Company of the entire issued share capital of the Target pursuant to the terms of the Acquisition Agreement.</p>
                <p>"<span className="bg-yellow-100 px-1 font-bold border-b-2 border-gold-400">Authorisation</span>" means an authorisation, consent, approval, resolution, licence, exemption, filing, notarisation or registration required under any law or regulation.</p>
                <p>"<span className="bg-yellow-100 px-1 font-bold border-b-2 border-gold-400">Change of Control</span>" means any person or group of persons acting in concert gains direct or indirect control of more than 50% of the voting rights of the Parent.</p>
                <p>"<span className="bg-yellow-100 px-1 font-bold border-b-2 border-gold-400">Consolidated EBITDA</span>" means, for any Relevant Period, the consolidated operating profit of the Group before taxation adjusted for depreciation, amortisation, and exceptional items.</p>
                <p>"<span className="bg-yellow-100 px-1 font-bold border-b-2 border-gold-400">Total Leverage Ratio</span>" means the ratio of Total Net Debt to Consolidated EBITDA for the Relevant Period.</p>
              </div>
            </section>

            {/* Section 2: Facilities */}
            <section id="facilities" className="mb-12">
              <h3 className="text-xl font-bold uppercase tracking-widest text-slate-900 mb-6 border-b pb-2">Section 2: The Facilities</h3>
              <p className="font-bold mb-4">2.1 The Facilities</p>
              <p className="mb-4 text-sm">Subject to the terms hereof, the Lenders agree to make available to the Borrowers:</p>
              <ol className="list-decimal pl-8 space-y-2 text-sm">
                <li>A term loan facility in an aggregate amount of <span className="font-bold">USD 350,000,000</span> (the "Term Facility").</li>
                <li>A revolving credit facility in an aggregate amount of <span className="font-bold">USD 100,000,000</span> (the "Revolving Facility").</li>
              </ol>
            </section>

            {/* Section 3: Purpose */}
            <section id="purpose" className="mb-12">
              <h3 className="text-xl font-bold uppercase tracking-widest text-slate-900 mb-6 border-b pb-2">Section 3: Purpose</h3>
              <p className="font-bold mb-4">3.1 Purpose</p>
              <p className="mb-4 text-sm">The Borrower shall apply all amounts borrowed by it under the Term Facility towards financing the Acquisition and the Refinancing.</p>
              <p className="text-sm">The Borrower shall apply all amounts borrowed by it under the Revolving Facility towards financing its working capital requirements and general corporate purposes.</p>
            </section>

            {/* Section 22: Financial Covenants */}
            <section id="covenants" className="mb-12 p-6 rounded-lg bg-slate-50 border-l-4 border-gold-500">
              <h3 className="text-xl font-bold uppercase tracking-widest text-slate-900 mb-6 border-b pb-2">Section 22: Financial Covenants</h3>
              <p className="font-bold mb-4">22.1 Financial Condition</p>
              <p className="mb-4 text-sm">The Parent shall ensure that:</p>
              <ol className="list-alpha pl-8 space-y-4 text-sm">
                <li>
                  <span className="font-bold">Total Leverage Ratio:</span> The Total Leverage Ratio on each Test Date falling in a period set out below shall not exceed the ratio set out opposite such period:
                  <table className="mt-2 w-full border-collapse text-xs">
                    <thead><tr className="bg-slate-200"><th className="border p-2 text-left">Period</th><th className="border p-2 text-left">Maximum Ratio</th></tr></thead>
                    <tbody>
                      <tr><td className="border p-2">Closing Date to 31 Dec 2026</td><td className="border p-2 font-bold text-gold-600">4.50:1.00</td></tr>
                      <tr><td className="border p-2">1 Jan 2027 to 31 Dec 2027</td><td className="border p-2">4.25:1.00</td></tr>
                      <tr><td className="border p-2">1 Jan 2028 and thereafter</td><td className="border p-2">4.00:1.00</td></tr>
                    </tbody>
                  </table>
                </li>
                <li className="mt-4"><span className="font-bold">Interest Cover Ratio:</span> Interest Cover Ratio on each Test Date shall not be less than 3.00:1.00.</li>
              </ol>
              <p className="mt-6 text-sm font-bold">22.2 Equity Cure</p>
              <p className="text-sm">The Parent may, on no more than <span className="font-bold">two</span> occasions during the life of this Agreement, cure a breach of the Financial Covenants by procuring a Cure Contribution within 20 Business Days of delivery of the relevant Compliance Certificate.</p>
            </section>

            {/* Section 18: Representations */}
            <section id="representations" className="mb-12">
              <h3 className="text-xl font-bold uppercase tracking-widest text-slate-900 mb-6 border-b pb-2">Section 18: Representations</h3>
              <p className="font-bold mb-4">18.1 General</p>
              <p className="mb-4 text-sm">Each Obligor makes the representations and warranties set out in this Clause 18 to each Finance Party on the date of this Agreement.</p>
              <p className="text-sm mb-2"><span className="font-bold">(a) Status:</span> It is a corporation, duly incorporated and validly existing under the law of its jurisdiction of incorporation.</p>
              <p className="text-sm mb-2"><span className="font-bold">(b) Binding obligations:</span> The obligations expressed to be assumed by it in each Transaction Document are legal, valid, binding and enforceable obligations.</p>
              <p className="text-sm"><span className="font-bold">(c) Non-conflict with other obligations:</span> The entry into and performance by it of, and the transactions contemplated by, the Transaction Documents do not conflict with any law or regulation applicable to it.</p>
            </section>

            {/* End of Preview */}
            <div className="text-center text-slate-400 text-sm mt-16 pt-8 border-t border-slate-200">
              <p>... Page 27 of 287 ...</p>
              <p className="mt-2 flex items-center justify-center gap-2"><FiCheckCircle className="text-green-500" /> Document continues with Schedules 1-12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm animate-fade-in" onClick={() => !isProcessing && setShowUploadModal(false)}>
          <div
            className="glass-card p-12 rounded-2xl max-w-2xl w-full text-center border-2 border-dashed border-white/20 hover:border-gold-500/50 transition-colors cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              if (!isProcessing) {
                document.getElementById('doc-file-upload-input')?.click();
              }
            }}
          >
            <input
              type="file"
              id="doc-file-upload-input"
              className="hidden"
              accept=".pdf,image/*,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
            />
            {isProcessing ? (
              <>
                <div className="w-20 h-20 mx-auto rounded-full bg-navy-800 flex items-center justify-center text-gold-500 mb-6">
                  <FiLoader size={40} className="animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{processingStatus}</h3>
                <p className="text-slate-400">Please wait...</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto rounded-full bg-navy-800 flex items-center justify-center text-slate-400 group-hover:text-gold-500 group-hover:scale-110 transition-all mb-6">
                  <FiUploadCloud size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Upload New Term Sheet</h3>
                <p className="text-slate-400">Click to browse local files or drag & drop</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
