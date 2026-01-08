// src/components/documents/GenerationProgress.tsx
import { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface GenerationProgressProps {
  fileName: string;
}

interface ProgressStep {
  message: string;
  duration: number;
}

const generationSteps: ProgressStep[] = [
  { message: 'Analyzing term sheet structure...', duration: 2000 },
  { message: 'Extracting key deal terms...', duration: 2000 },
  { message: 'Retrieving LMA precedent documents...', duration: 3000 },
  { message: 'Searching 10,000+ transaction database...', duration: 2000 },
  { message: 'Generating Article I - Definitions...', duration: 2000 },
  { message: 'Drafting Article II - The Credits...', duration: 1500 },
  { message: 'Creating financial covenants...', duration: 2000 },
  { message: 'Building negative covenants structure...', duration: 1500 },
  { message: 'Cross-referencing provisions...', duration: 1500 },
  { message: 'Formatting execution pages...', duration: 1000 },
];

export default function GenerationProgress({ fileName }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalTime = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    generationSteps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
        if (index < generationSteps.length - 1) {
          setCurrentStep(index + 1);
        }
        setProgress(((index + 1) / generationSteps.length) * 100);
      }, totalTime);

      timers.push(timer);
      totalTime += step.duration;
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-primary-100 rounded-full mb-4 animate-pulse">
            <svg className="h-8 w-8 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Facility Agreement</h2>
          <p className="text-gray-600">Processing {fileName}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Generation Progress</span>
            <span className="text-sm font-semibold text-primary-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {generationSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index && !isCompleted;

            return (
              <div
                key={index}
                className={clsx(
                  'flex items-center gap-3 p-3 rounded-lg transition-all',
                  isCompleted && 'bg-success-50',
                  isCurrent && 'bg-primary-50 animate-pulse',
                  !isCompleted && !isCurrent && 'bg-gray-50 opacity-40'
                )}
              >
                <div className={clsx(
                  'flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center',
                  isCompleted && 'bg-success-500',
                  isCurrent && 'bg-primary-500',
                  !isCompleted && !isCurrent && 'bg-gray-300'
                )}>
                  {isCompleted ? (
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  ) : (
                    <span className="text-white text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                <span className={clsx(
                  'text-sm font-medium',
                  isCompleted && 'text-success-700',
                  isCurrent && 'text-primary-700',
                  !isCompleted && !isCurrent && 'text-gray-500'
                )}>
                  {step.message}
                </span>
                {isCurrent && (
                  <div className="ml-auto flex gap-1">
                    <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">287</p>
              <p className="text-sm text-gray-600">Pages Generated</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">~45s</p>
              <p className="text-sm text-gray-600">Estimated Time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">96%</p>
              <p className="text-sm text-gray-600">AI Confidence</p>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-900">AI-Powered Generation in Progress</p>
              <p className="text-xs text-blue-700 mt-1">
                Our AI is analyzing 10,000+ precedent transactions and LMA templates to create your facility agreement. This typically completes in 30-60 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
