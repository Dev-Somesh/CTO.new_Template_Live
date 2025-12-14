'use client';

import { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black">
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Animated background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-orange-500/20 rounded-full blur-3xl transition-opacity duration-300"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            opacity: 0.5,
          }}
        />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">n</span>
              </div>
              <span className="text-xl font-bold text-white">Flow Playground</span>
            </div>
            <div className="text-sm text-slate-400">v0.2.0</div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="w-full max-w-5xl mx-auto">
            {/* Main Content */}
            <div className="text-center mb-16 space-y-8">
              {/* Logo Animation */}
              <div className="flex justify-center">
                <div className="relative w-24 h-24 animate-float">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl blur-lg opacity-75" />
                  <div className="relative w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">n8n</span>
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  Analyze n8n<br />
                  <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">Workflows</span>
                  <br />
                  Instantly
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Understand your n8n workflows without installation. Upload, analyze, and get step-by-step configuration guidance in seconds.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 md:gap-12 py-8 max-w-2xl mx-auto">
                <div className="group">
                  <div className="text-3xl md:text-4xl font-bold text-orange-400">3</div>
                  <div className="text-sm text-slate-400 mt-2">Flow Formats</div>
                </div>
                <div className="group">
                  <div className="text-3xl md:text-4xl font-bold text-orange-400">4+</div>
                  <div className="text-sm text-slate-400 mt-2">Sample Flows</div>
                </div>
                <div className="group">
                  <div className="text-3xl md:text-4xl font-bold text-orange-400">∞</div>
                  <div className="text-sm text-slate-400 mt-2">Possibilities</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-20">
              {/* Upload Card */}
              <button
                onClick={() => onNavigate('upload')}
                className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-400/10 border border-blue-400/30" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10 space-y-3">
                  <div className="text-5xl">📤</div>
                  <h3 className="text-xl font-bold text-white">
                    Upload Your Flow
                  </h3>
                  <p className="text-sm text-slate-300">
                    Paste or upload your n8n JSON to get instant insights
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-orange-400 text-sm font-semibold">
                    Get Started
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Samples Card */}
              <button
                onClick={() => onNavigate('samples')}
                className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-400/10 border border-purple-400/30" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10 space-y-3">
                  <div className="text-5xl">📚</div>
                  <h3 className="text-xl font-bold text-white">
                    Explore Samples
                  </h3>
                  <p className="text-sm text-slate-300">
                    Learn from pre-built workflow examples
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-purple-400 text-sm font-semibold">
                    Browse Flows
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            {/* Features Grid */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12 space-y-8">
              <h2 className="text-2xl font-bold text-white text-center">Why Choose n8n Flow Playground?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: '⚡',
                    title: 'Instant Analysis',
                    description: 'Analyze flows in seconds'
                  },
                  {
                    icon: '🔍',
                    title: 'Deep Insights',
                    description: 'Understand every node and connection'
                  },
                  {
                    icon: '📋',
                    title: 'Step by Step',
                    description: 'Configuration guides included'
                  },
                  {
                    icon: '🎓',
                    title: 'Learn & Grow',
                    description: 'Sample workflows to learn from'
                  }
                ].map((feature, i) => (
                  <div key={i} className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="text-center mt-20">
              <p className="text-slate-400 mb-6">Ready to analyze your first flow?</p>
              <button
                onClick={() => onNavigate('upload')}
                className="group relative px-8 py-3 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-110"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2 justify-center">
                  Start Now
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        :global(.animate-float) {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
