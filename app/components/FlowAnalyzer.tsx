'use client';

import { useState } from 'react';
import { FlowAnalysis, ConfigurationStep } from '../lib/n8nFlowAnalyzer';

interface FlowAnalyzerProps {
  analysis: FlowAnalysis;
  onBack: () => void;
}

type TabType = 'overview' | 'nodes' | 'credentials' | 'guide';

export default function FlowAnalyzer({ analysis, onBack }: FlowAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [confirmedReady, setConfirmedReady] = useState(false);

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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Flow Analysis
            </h1>
            <div className="text-sm font-semibold text-white bg-orange-500 px-4 py-2 rounded-full">
              {analysis.totalNodes} Nodes
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed breakdown of your workflow including nodes, configuration steps, and requirements
          </p>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex gap-4 overflow-x-auto">
            {(['overview', 'nodes', 'credentials', 'guide'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <OverviewTab analysis={analysis} />
        )}

        {activeTab === 'nodes' && (
          <NodesTab
            nodes={analysis.nodes}
            connections={analysis.connections}
            expandedNode={expandedNode}
            setExpandedNode={setExpandedNode}
          />
        )}

        {activeTab === 'credentials' && (
          <CredentialsTab
            analysis={analysis}
            confirmedReady={confirmedReady}
            setConfirmedReady={setConfirmedReady}
          />
        )}

        {activeTab === 'guide' && (
          <ConfigurationGuideTab
            steps={analysis.configuration}
            expandedStep={expandedStep}
            setExpandedStep={setExpandedStep}
          />
        )}
      </div>
    </div>
  );
}

interface OverviewTabProps {
  analysis: FlowAnalysis;
}

function OverviewTab({ analysis }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="col-span-1 lg:col-span-2 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-4">
            Flow Insights
          </h3>
          <div className="space-y-3">
            {analysis.insights.map((insight, idx) => (
              <p key={idx} className="text-sm text-blue-800 dark:text-blue-400">
                {insight}
              </p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {analysis.totalNodes}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Nodes
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {analysis.connections.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connections
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {analysis.credentialTypes.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Credential Types
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {analysis.requiredTools.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Required Services
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">
            Node Types
          </h3>
          <div className="space-y-2">
            {analysis.nodeTypes.map((type) => (
              <div
                key={type}
                className="text-xs bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-700 rounded px-3 py-2 text-purple-800 dark:text-purple-300"
              >
                {type}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3">
            Tools & Services
          </h3>
          <div className="space-y-2">
            {analysis.requiredTools.map((tool) => (
              <div
                key={tool}
                className="text-xs bg-white dark:bg-gray-900 border border-green-200 dark:border-green-700 rounded px-3 py-2 text-green-800 dark:text-green-300"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NodesTabProps {
  nodes: N8nNode[];
  connections: N8nConnection[];
  expandedNode: string | null;
  setExpandedNode: (id: string | null) => void;
}

interface N8nNode {
  id: string;
  name: string;
  type: string;
  parameters?: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}

interface N8nConnection {
  source: string;
  target: string;
  type: string;
}

function NodesTab({ nodes, connections, expandedNode, setExpandedNode }: NodesTabProps) {
  return (
    <div className="space-y-4 mb-8">
      {nodes.map((node) => {
        const incomingConnections = connections.filter((c) => c.target === node.id);
        const outgoingConnections = connections.filter((c) => c.source === node.id);

        return (
          <div
            key={node.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
              className="w-full p-6 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-black dark:text-white">
                  {node.name || node.id}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {node.type}
                </p>
              </div>
              <div className="text-2xl">
                {expandedNode === node.id ? '▼' : '▶'}
              </div>
            </button>

            {expandedNode === node.id && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
                {incomingConnections.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Incoming from:
                    </h4>
                    <div className="space-y-1">
                      {incomingConnections.map((conn) => (
                        <p
                          key={`${conn.source}-${node.id}`}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          {conn.source}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {outgoingConnections.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Sends to:
                    </h4>
                    <div className="space-y-1">
                      {outgoingConnections.map((conn) => (
                        <p
                          key={`${node.id}-${conn.target}`}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          {conn.target}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {node.parameters && Object.keys(node.parameters).length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Parameters:
                    </h4>
                    <div className="bg-white dark:bg-gray-900 rounded p-3 overflow-x-auto">
                      <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                        {JSON.stringify(node.parameters, null, 2).substring(0, 500)}
                      </pre>
                    </div>
                  </div>
                )}

                {node.credentials && Object.keys(node.credentials).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Credentials:
                    </h4>
                    <div className="space-y-1">
                      {Object.entries(node.credentials).map(([key, value]) => (
                        <p
                          key={key}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          <strong>{key}:</strong> {String(value)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface CredentialsTabProps {
  analysis: FlowAnalysis;
  confirmedReady: boolean;
  setConfirmedReady: (value: boolean) => void;
}

function CredentialsTab({ analysis, confirmedReady, setConfirmedReady }: CredentialsTabProps) {
  const hasCredentials = analysis.credentialTypes.length > 0 || analysis.requiredTools.length > 0;

  return (
    <div className="space-y-6 mb-8">
      {!hasCredentials && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <p className="text-green-800 dark:text-green-300">
            ✓ This workflow doesn&apos;t require any external credentials or API keys.
          </p>
        </div>
      )}

      {analysis.credentialTypes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Required Credentials
          </h2>
          {analysis.credentialTypes.map((credType) => (
            <div
              key={credType}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900"
            >
              <h3 className="font-semibold text-black dark:text-white mb-2">
                {credType}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This credential type is required by one or more nodes in your workflow.
              </p>
            </div>
          ))}
        </div>
      )}

      {analysis.requiredTools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            External Services & Prerequisites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.requiredTools.map((tool) => (
              <div
                key={tool}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900"
              >
                <p className="font-semibold text-black dark:text-white">
                  {tool}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Required for this workflow
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-3">
          Before You Configure
        </h3>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmedReady}
              onChange={(e) => setConfirmedReady(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-yellow-800 dark:text-yellow-300">
              I have prepared all required credentials, API keys, and external services mentioned above
            </span>
          </label>
          {confirmedReady && (
            <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
              ✓ Great! You&apos;re ready to proceed with the configuration guide.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface ConfigurationGuideTabProps {
  steps: ConfigurationStep[];
  expandedStep: number | null;
  setExpandedStep: (index: number | null) => void;
}

function ConfigurationGuideTab({
  steps,
  expandedStep,
  setExpandedStep,
}: ConfigurationGuideTabProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          Step-by-Step Configuration Guide
        </h2>
        <p className="text-sm text-blue-800 dark:text-blue-400">
          Follow these steps in order to configure your n8n workflow. Each step corresponds to a
          node in your flow.
        </p>
      </div>

      {steps.map((step, idx) => (
        <div
          key={step.nodeId}
          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
            className="w-full p-6 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold text-center">
                    {idx + 1}
                  </span>
                  <h3 className="font-semibold text-black dark:text-white">
                    {step.nodeName}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.nodeType}
                </p>
              </div>
              <div className="text-2xl">
                {expandedStep === idx ? '▼' : '▶'}
              </div>
            </div>
          </button>

          {expandedStep === idx && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
              <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono mb-6 bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                {step.instructions}
              </div>

              {step.requiredParameters.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Required Parameters
                  </h4>
                  <div className="space-y-3">
                    {step.requiredParameters.map((param) => (
                      <div
                        key={param.name}
                        className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded p-3"
                      >
                        <p className="font-semibold text-red-800 dark:text-red-300 text-sm">
                          {param.name} *
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {param.description}
                        </p>
                        {param.example && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                            Example: {param.example}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step.optionalParameters.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Optional Parameters
                  </h4>
                  <div className="space-y-3">
                    {step.optionalParameters.map((param) => (
                      <div
                        key={param.name}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-3"
                      >
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                          {param.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {param.description}
                        </p>
                        {param.example && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                            Example: {param.example}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step.credentials && step.credentials.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Credentials to Configure
                  </h4>
                  <div className="space-y-3">
                    {step.credentials.map((cred) => (
                      <div
                        key={cred.type}
                        className="bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded p-3"
                      >
                        <p className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
                          {cred.type}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {cred.description}
                        </p>
                        {cred.setupInstructions && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <p className="font-semibold mb-1">Setup Instructions:</p>
                            <p className="whitespace-pre-line">{cred.setupInstructions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
