// src/components/documents/DocumentGenerator.tsx
import { useState } from 'react';
import TermSheetUpload from './TermSheetUpload';
import GenerationProgress from './GenerationProgress';
import DocumentPreview from './DocumentPreview';
import useAppStore from '../../store/appStore';
import { DEMO_NEGOTIATIONS } from '../../data/demo-data';
import type { Document } from '../../types';

type GeneratorState = 'upload' | 'generating' | 'preview';

export default function DocumentGenerator() {
  const [state, setState] = useState<GeneratorState>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<Document | null>(null);
  const { addDocument, addNegotiation, currentDeal, negotiations } = useAppStore();

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setState('generating');
    
    // Fake AI generation
    startGeneration(file);
  };

  const startGeneration = async (_file: File) => {
    // Simulate AI processing - this will be handled by GenerationProgress
    await new Promise(resolve => setTimeout(resolve, 18000)); // 18 seconds

    const dealId = currentDeal?.deal_id || 'deal_20250112_001';

    // Create mock document
    const mockDoc: Document = {
      document_id: `doc_${Date.now()}`,
      deal_id: dealId,
      document_type: 'facility_agreement',
      document_name: 'TechCorp_Facility_Agreement_v1.docx',
      version_number: 1,
      page_count: 287,
      word_count: 78456,
      generated_by: 'ai',
      ai_model: 'claude-sonnet-4-20250514',
      generation_time_seconds: 43,
      ai_confidence_score: 0.96,
      status: 'under_review',
      created_at: new Date().toISOString(),
      sections: [
        {
          section_name: 'Article I - Definitions and Accounting Terms',
          page_start: 1,
          page_end: 42,
          ai_confidence: 0.98,
          review_notes: []
        },
        {
          section_name: 'Article II - The Credits',
          page_start: 43,
          page_end: 68,
          ai_confidence: 0.97,
          review_notes: []
        },
        {
          section_name: 'Article VII - Financial Covenants',
          page_start: 183,
          page_end: 195,
          ai_confidence: 0.97,
          review_notes: []
        }
      ],
      lma_compliance: {
        template_version: 'LMA Investment Grade 2024',
        jurisdiction: 'New York Law',
        mandatory_provisions_included: 47,
        optional_provisions_included: 23,
        compliance_score: 0.98
      }
    };

    // Add document to store
    addDocument(mockDoc);

    // Create negotiations for this deal (only if they don't already exist)
    const dealNegotiationsExist = negotiations.some(n => n.deal_id === dealId);
    if (!dealNegotiationsExist) {
      DEMO_NEGOTIATIONS.forEach(negotiation => {
        addNegotiation({
          ...negotiation,
          deal_id: dealId
        });
      });
    }

    setGeneratedDocument(mockDoc);
    setState('preview');
  };

  const handleStartOver = () => {
    setState('upload');
    setUploadedFile(null);
    setGeneratedDocument(null);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generate Facility Agreement</h1>
        <p className="text-gray-600 mt-2">
          Upload your term sheet and let AI generate a complete, LMA-compliant facility agreement in seconds.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
              state === 'upload' ? 'bg-primary-600 text-white' : 'bg-success-500 text-white'
            }`}>
              {state === 'upload' ? '1' : '✓'}
            </div>
            <span className={`font-medium ${state === 'upload' ? 'text-gray-900' : 'text-gray-600'}`}>
              Upload Term Sheet
            </span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 ${state !== 'upload' ? 'bg-success-500' : 'bg-gray-200'}`} />
          
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
              state === 'generating' ? 'bg-primary-600 text-white' : 
              state === 'preview' ? 'bg-success-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {state === 'preview' ? '✓' : '2'}
            </div>
            <span className={`font-medium ${state === 'generating' ? 'text-gray-900' : 'text-gray-600'}`}>
              Generate Document
            </span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 ${state === 'preview' ? 'bg-success-500' : 'bg-gray-200'}`} />
          
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
              state === 'preview' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className={`font-medium ${state === 'preview' ? 'text-gray-900' : 'text-gray-600'}`}>
              Review & Download
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {state === 'upload' && (
        <TermSheetUpload onFileUpload={handleFileUpload} />
      )}

      {state === 'generating' && (
        <GenerationProgress fileName={uploadedFile?.name || 'term-sheet.pdf'} />
      )}

      {state === 'preview' && generatedDocument && (
        <DocumentPreview document={generatedDocument} onStartOver={handleStartOver} />
      )}
    </div>
  );
}
