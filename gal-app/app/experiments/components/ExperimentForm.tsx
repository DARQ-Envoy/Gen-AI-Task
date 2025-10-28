'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Play, Settings } from 'lucide-react';
import { createExperiment } from '../actions/experiment-actions';

interface ExperimentFormData {
  prompt: string;
  config_1: { temperature: number; top_p: number; max_tokens: number };
  config_2: { temperature: number; top_p: number; max_tokens: number };
  config_3: { temperature: number; top_p: number; max_tokens: number };
}

export function ExperimentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ExperimentFormData>({
    prompt: '',
    config_1: { temperature: 0.7, top_p: 0.9, max_tokens: 500 },
    config_2: { temperature: 1.0, top_p: 0.95, max_tokens: 500 },
    config_3: { temperature: 0.3, top_p: 0.85, max_tokens: 500 },
  });

  const createExperimentMutation = useMutation({
    mutationFn: createExperiment,
    onSuccess: (experimentId) => {
      router.push(`/experiments/${experimentId}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExperimentMutation.mutate(formData);
  };

  const updateConfig = (configKey: keyof Pick<ExperimentFormData, 'config_1' | 'config_2' | 'config_3'>, field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [configKey]: {
        ...prev[configKey],
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">New Experiment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-3">Prompt</label>
          <textarea
            value={formData.prompt}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            rows={4}
            placeholder="Enter your prompt here..."
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Parameter Configurations</h3>
          
          {/* Config A */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-400/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-300 mb-3">Configuration A</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-blue-200 mb-1">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.config_1.temperature}
                  onChange={(e) => updateConfig('config_1', 'temperature', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-black/40 border border-blue-400/30 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-blue-200 mb-1">Top P</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.config_1.top_p}
                  onChange={(e) => updateConfig('config_1', 'top_p', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-black/40 border border-blue-400/30 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-blue-200 mb-1">Max Tokens</label>
                <input
                  type="number"
                  value={formData.config_1.max_tokens}
                  onChange={(e) => updateConfig('config_1', 'max_tokens', parseInt(e.target.value))}
                  className="w-full px-2 py-1 bg-black/40 border border-blue-400/30 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Config B */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-400/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-purple-300 mb-3">Configuration B</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-purple-200 mb-1">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.config_2.temperature}
                  onChange={(e) => updateConfig('config_2', 'temperature', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-black/40 border border-purple-400/30 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-purple-200 mb-1">Top P</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.config_2.top_p}
                  onChange={(e) => updateConfig('config_2', 'top_p', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-black/40 border border-purple-400/30 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-purple-200 mb-1">Max Tokens</label>
                <input
                  type="number"
                  value={formData.config_2.max_tokens}
                  onChange={(e) => updateConfig('config_2', 'max_tokens', parseInt(e.target.value))}
                  className="w-full px-2 py-1 bg-black/40 border border-purple-400/30 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Config C */}
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-400/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-pink-300 mb-3">Configuration C</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-pink-200 mb-1">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.config_3.temperature}
                  onChange={(e) => updateConfig('config_3', 'temperature', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-black/40 border border-pink-400/30 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs text-pink-200 mb-1">Top P</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.config_3.top_p}
                  onChange={(e) => updateConfig('config_3', 'top_p', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-black/40 border border-pink-400/30 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs text-pink-200 mb-1">Max Tokens</label>
                <input
                  type="number"
                  value={formData.config_3.max_tokens}
                  onChange={(e) => updateConfig('config_3', 'max_tokens', parseInt(e.target.value))}
                  className="w-full px-2 py-1 bg-black/40 border border-pink-400/30 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={createExperimentMutation.isPending}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          {createExperimentMutation.isPending ? 'Creating...' : 'Create Experiment'}
        </button>
      </form>
    </div>
  );
}
