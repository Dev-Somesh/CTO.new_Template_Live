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
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-8 font-medium"
        >
          ← Back to Home
        </button>

        <div className="mb-12">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
            Upload Your n8n Flow
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Paste the JSON of your n8n workflow here. The analyzer will extract nodes, requirements,
            and provide step-by-step configuration guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setError(null);
                }}
                placeholder="Paste your n8n flow JSON here..."
                className="w-full h-96 p-4 bg-white dark:bg-gray-900 text-black dark:text-white resize-none focus:outline-none font-mono text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={loading || !jsonInput.trim()}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                {loading ? 'Analyzing...' : 'Analyze Flow'}
              </button>

              <label className="flex items-center justify-center gap-2 flex-1 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  Or Upload File
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
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-300 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                How to get your flow JSON
              </h3>
              <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-2 list-decimal list-inside">
                <li>Open your workflow in n8n editor</li>
                <li>Click the menu (⋮) button</li>
                <li>Select &quot;Download&quot; option</li>
                <li>Choose JSON format</li>
                <li>Save or copy the file content</li>
              </ol>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3">
                What we analyze
              </h3>
              <ul className="text-sm text-green-800 dark:text-green-400 space-y-2">
                <li>✓ Node types and connections</li>
                <li>✓ Required credentials and APIs</li>
                <li>✓ Configuration parameters</li>
                <li>✓ Data flow and dependencies</li>
                <li>✓ Step-by-step setup guide</li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">
                Example JSON Format
              </h3>
              <code className="text-xs text-purple-800 dark:text-purple-400 block overflow-x-auto">
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
