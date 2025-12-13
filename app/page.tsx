'use client';

import { useState } from 'react';
import FlowUploader from './components/FlowUploader';
import FlowAnalyzer from './components/FlowAnalyzer';
import SampleFlowsGallery from './components/SampleFlowsGallery';
import { FlowAnalysis } from './lib/n8nFlowAnalyzer';

type Page = 'home' | 'upload' | 'samples' | 'analyze';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [flowAnalysis, setFlowAnalysis] = useState<FlowAnalysis | null>(null);

  const handleFlowAnalyzed = (analysis: FlowAnalysis) => {
    setFlowAnalysis(analysis);
    setCurrentPage('analyze');
  };

  const goHome = () => {
    setCurrentPage('home');
    setFlowAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {currentPage === 'home' && (
        <HomePage onNavigate={setCurrentPage} />
      )}
      {currentPage === 'upload' && (
        <FlowUploader
          onFlowAnalyzed={handleFlowAnalyzed}
          onBack={goHome}
        />
      )}
      {currentPage === 'samples' && (
        <SampleFlowsGallery
          onFlowSelected={handleFlowAnalyzed}
          onBack={goHome}
        />
      )}
      {currentPage === 'analyze' && flowAnalysis && (
        <FlowAnalyzer
          analysis={flowAnalysis}
          onBack={goHome}
        />
      )}
    </div>
  );
}

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-12 py-20 px-6 bg-white dark:bg-black">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">n8n</span>
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-white">
            n8n Flow Playground
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Analyze and configure n8n workflows without installation. Upload your flow JSON or explore sample workflows to understand nodes, requirements, and setup steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button
            onClick={() => onNavigate('upload')}
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 text-left transition-all hover:border-orange-400 hover:shadow-lg dark:hover:border-orange-400"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Upload Your Flow
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Paste your n8n flow JSON to get instant insights, configuration requirements, and setup guide.
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('samples')}
            className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 text-left transition-all hover:border-orange-400 hover:shadow-lg dark:hover:border-orange-400"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Explore Samples
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start with pre-built workflow examples to learn best practices and understand different node types.
              </p>
            </div>
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 w-full">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            What you can do
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start gap-3">
              <span className="text-orange-500 font-bold">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Analyze n8n flow JSON instantly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 font-bold">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Understand all node types and their roles</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 font-bold">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Identify required credentials and APIs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 font-bold">✓</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Get step-by-step configuration guide</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
