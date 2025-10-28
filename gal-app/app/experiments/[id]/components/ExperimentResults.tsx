'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Layout, Maximize2, Eye } from 'lucide-react';
import { ResponseComparison } from './ResponseComparison';
import { ResponseDetails } from './ResponseDetails';
import { MetricsAnalysis } from './MetricsAnalysis';
import { getExperiment } from '../../actions/experiment-actions';

interface Experiment {
  id: string;
  prompt: string;
  createdAt: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  responses?: Array<{
    id: string;
    config: string;
    text: string;
    metrics: {
      coherence: number;
      completeness: number;
      readability: number;
      structure: number;
      overall: number;
    };
  }>;
}

interface ExperimentResultsProps {
  experiment: Experiment;
}

export function ExperimentResults({ experiment: initialExperiment }: ExperimentResultsProps) {
  const [experiment, setExperiment] = useState<Experiment>(initialExperiment);
  const [viewMode, setViewMode] = useState<'comparison' | 'detailed' | 'metrics'>('comparison');
  const [selectedResponse, setSelectedResponse] = useState<number>(0);

  // Poll for updates while experiment is processing
  useEffect(() => {
    if (experiment.status === 'pending' || experiment.status === 'running') {
      const interval = setInterval(async () => {
        try {
          const updated = await getExperiment(experiment.id);
          setExperiment(updated);
        } catch (error) {
          console.error('Error fetching experiment:', error);
        }
      }, 1000); // Poll every 1 second

      return () => clearInterval(interval);
    }
  }, [experiment.id, experiment.status]);

  if (experiment.status === 'pending' || experiment.status === 'running') {
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {experiment.status === 'pending' ? 'Queued for Processing' : 'Generating Responses...'}
          </h2>
          <p className="text-purple-200">
            {experiment.status === 'pending' 
              ? 'Your experiment is in the queue and will start processing shortly.'
              : 'Running 3 configurations and analyzing quality metrics...'
            }
          </p>
        </div>
      </main>
    );
  }

  if (experiment.status === 'failed' || !experiment.responses) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-400/30 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Processing Failed</h2>
          <p className="text-red-200">There was an error processing your experiment. Please try again.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* View Mode Toggle */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'comparison' 
                ? 'bg-purple-600 text-white' 
                : 'text-purple-300 hover:bg-white/10'
            }`}
          >
            <Layout className="w-4 h-4" />
            Compare
          </button>
          <button 
            onClick={() => setViewMode('detailed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'detailed' 
                ? 'bg-purple-600 text-white' 
                : 'text-purple-300 hover:bg-white/10'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
            Detailed
          </button>
          <button 
            onClick={() => setViewMode('metrics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'metrics' 
                ? 'bg-purple-600 text-white' 
                : 'text-purple-300 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Metrics
          </button>
        </div>
      </div>

      {/* Render appropriate view */}
      {viewMode === 'comparison' && (
        <ResponseComparison 
          responses={experiment.responses} 
          onSelectResponse={(index) => {
            setSelectedResponse(index);
            setViewMode('detailed');
          }}
        />
      )}
      
      {viewMode === 'detailed' && (
        <ResponseDetails 
          responses={experiment.responses}
          selectedIndex={selectedResponse}
          onSelectResponse={setSelectedResponse}
        />
      )}
      
      {viewMode === 'metrics' && (
        <MetricsAnalysis responses={experiment.responses} />
      )}
    </main>
  );
}
