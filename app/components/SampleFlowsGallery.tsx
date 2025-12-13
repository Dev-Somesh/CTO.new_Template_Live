'use client';

import { useState } from 'react';
import { SAMPLE_FLOWS, SampleFlow } from '../lib/sampleFlows';
import { analyzeN8nFlow, FlowAnalysis } from '../lib/n8nFlowAnalyzer';

interface SampleFlowsGalleryProps {
  onFlowSelected: (analysis: FlowAnalysis) => void;
  onBack: () => void;
}

export default function SampleFlowsGallery({ onFlowSelected, onBack }: SampleFlowsGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredFlows = SAMPLE_FLOWS.filter((flow) => {
    const matchesCategory = !selectedCategory || flow.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || flow.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const categories = Array.from(new Set(SAMPLE_FLOWS.map((f) => f.category)));
  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

  const handleSelectFlow = async (flow: SampleFlow) => {
    setLoading(true);
    try {
      const analysis = analyzeN8nFlow(flow.json);
      onFlowSelected(analysis);
    } catch (err) {
      console.error('Failed to analyze flow:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-8 font-medium"
        >
          ← Back to Home
        </button>

        <div className="mb-12">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
            Sample Workflows
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore pre-built workflows to understand how n8n flows work. Select any workflow to see
            detailed analysis, node information, and configuration requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-3">Category</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedCategory === null
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-black dark:text-white mb-3">Difficulty</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedDifficulty(null)}
                className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedDifficulty === null
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                All
              </button>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition capitalize ${
                    selectedDifficulty === diff
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-black dark:text-white mb-3">Summary</h3>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <strong>{filteredFlows.length}</strong> of <strong>{SAMPLE_FLOWS.length}</strong> flows
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {filteredFlows.length > 0
                  ? 'Click on any flow to analyze it'
                  : 'No flows match your filters'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {filteredFlows.map((flow) => (
            <div
              key={flow.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <button
                onClick={() => setExpandedFlow(expandedFlow === flow.id ? null : flow.id)}
                className="w-full p-6 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                      {flow.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {flow.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(flow.difficulty)}`}>
                        {flow.difficulty.charAt(0).toUpperCase() + flow.difficulty.slice(1)}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium">
                        {flow.category}
                      </span>
                      {flow.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 text-2xl">
                    {expandedFlow === flow.id ? '▼' : '▶'}
                  </div>
                </div>
              </button>

              {expandedFlow === flow.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
                  <div className="mb-4 p-4 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                    <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                      {JSON.stringify(JSON.parse(flow.json), null, 2).substring(0, 500)}...
                    </pre>
                  </div>

                  <button
                    onClick={() => handleSelectFlow(flow)}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
                  >
                    {loading ? 'Analyzing...' : 'Analyze This Flow'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFlows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No workflows match your filters. Try adjusting your selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
