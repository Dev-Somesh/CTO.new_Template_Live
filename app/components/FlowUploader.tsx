'use client';

import { useState } from 'react';
import { analyzeN8nFlow, FlowAnalysis } from '../lib/n8nFlowAnalyzer';

interface FlowUploaderProps {
  onFlowAnalyzed: (analysis: FlowAnalysis) => void;
  onBack: () => void;
}

export default function FlowUploader({ onFlowAnalyzed, onBack }: FlowUploaderProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!jsonInput.trim()) {
        throw new Error('Please paste your n8n flow JSON');
      }

      const analysis = analyzeN8nFlow(jsonInput);
      onFlowAnalyzed(analysis);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze flow';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonInput(content);
        setError(null);
      } catch {
        setError('Failed to read file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-8 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7 7l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Upload Your n8n Flow
          </h1>
          <p className="text-slate-300">
            Paste the JSON of your n8n workflow here. The analyzer will extract nodes, requirements,
            and provide step-by-step configuration guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setError(null);
                }}
                placeholder="Paste your n8n flow JSON here..."
                className="w-full h-96 p-4 bg-transparent text-white resize-none focus:outline-none font-mono text-sm placeholder-slate-400"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={loading || !jsonInput.trim()}
                className="flex-1 group relative px-6 py-3 rounded-lg font-semibold text-white overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">
                  {loading ? 'Analyzing...' : 'Analyze Flow'}
                </span>
              </button>

              <label className="flex items-center justify-center gap-2 flex-1 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all bg-white/5">
                <span className="text-white font-semibold">
                  Upload File
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 animate-in">
                <p className="text-red-400 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <span>📋</span> How to get your flow JSON
              </h3>
              <ol className="text-sm text-blue-200 space-y-2 list-decimal list-inside">
                <li>Open your workflow in n8n editor</li>
                <li>Click the menu (⋮) button</li>
                <li>Select &quot;Download&quot; option</li>
                <li>Choose JSON format</li>
                <li>Save or copy the file content</li>
              </ol>
            </div>

            <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                <span>✨</span> What we analyze
              </h3>
              <ul className="text-sm text-green-200 space-y-2">
                <li>✓ Node types and connections</li>
                <li>✓ Required credentials and APIs</li>
                <li>✓ Configuration parameters</li>
                <li>✓ Data flow and dependencies</li>
                <li>✓ Step-by-step setup guide</li>
              </ul>
            </div>

            <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <span>{ }</span> Example JSON Format
              </h3>
              <code className="text-xs text-purple-300 block overflow-x-auto">
{`{
  &quot;name&quot;: &quot;My Workflow&quot;,
  &quot;nodes&quot;: [...],
  &quot;connections&quot;: {...}
}`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
