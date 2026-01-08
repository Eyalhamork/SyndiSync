// src/components/documents/TermSheetUpload.tsx
import { useState, useCallback } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface TermSheetUploadProps {
  onFileUpload: (file: File) => void;
}

export default function TermSheetUpload({ onFileUpload }: TermSheetUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleGenerate = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-8">
        {/* Upload Area */}
        <div
          className={clsx(
            'border-2 border-dashed rounded-lg p-12 text-center transition-all',
            isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50',
            !selectedFile && 'hover:border-primary-400 hover:bg-primary-50/50'
          )}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <>
              <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Term Sheet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Drag and drop your term sheet PDF here, or click to browse
              </p>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 cursor-pointer transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileSelect}
                />
                Select File
              </label>
              <p className="text-sm text-gray-500 mt-4">
                Supported format: PDF • Max size: 10MB
              </p>
            </>
          ) : (
            <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Deal Configuration */}
        {selectedFile && (
          <div className="mt-8 space-y-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900">Deal Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Borrower Name
                </label>
                <input
                  type="text"
                  defaultValue="TechCorp Industries Inc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Leveraged Buyout (LBO)</option>
                  <option>Acquisition Financing</option>
                  <option>Refinancing</option>
                  <option>Growth Capital</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility Amount (USD)
                </label>
                <input
                  type="text"
                  defaultValue="$450,000,000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurisdiction
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>New York Law</option>
                  <option>English Law</option>
                  <option>Delaware Law</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 shadow-medium transition-all hover:shadow-large"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Facility Agreement
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!selectedFile && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Lightning Fast</h4>
              <p className="text-sm text-gray-600">Generate 287-page documents in under 60 seconds</p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">LMA Compliant</h4>
              <p className="text-sm text-gray-600">98% compliance with LMA standards and precedents</p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Cost Effective</h4>
              <p className="text-sm text-gray-600">Save $2M+ per deal on legal fees and time</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
