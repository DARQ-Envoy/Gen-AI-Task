'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface Response {
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
}

interface MetricsAnalysisProps {
  responses: Response[];
}

export function MetricsAnalysis({ responses }: MetricsAnalysisProps) {
  // Transform data for charts
  const chartData = [
    { name: 'Coherence', A: responses[0]?.metrics.coherence || 0, B: responses[1]?.metrics.coherence || 0, C: responses[2]?.metrics.coherence || 0 },
    { name: 'Completeness', A: responses[0]?.metrics.completeness || 0, B: responses[1]?.metrics.completeness || 0, C: responses[2]?.metrics.completeness || 0 },
    { name: 'Readability', A: responses[0]?.metrics.readability || 0, B: responses[1]?.metrics.readability || 0, C: responses[2]?.metrics.readability || 0 },
    { name: 'Structure', A: responses[0]?.metrics.structure || 0, B: responses[1]?.metrics.structure || 0, C: responses[2]?.metrics.structure || 0 }
  ];

  const bestOverall = responses.reduce((best, current) => 
    current.metrics.overall > best.metrics.overall ? current : best
  );

  const mostReadable = responses.reduce((best, current) => 
    current.metrics.readability > best.metrics.readability ? current : best
  );

  const mostCoherent = responses.reduce((best, current) => 
    current.metrics.coherence > best.metrics.coherence ? current : best
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Quality Metrics Analysis
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-purple-200 mb-4">Metric Comparison (Bar Chart)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff80" style={{ fontSize: '12px' }} />
                <YAxis stroke="#ffffff80" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #ffffff30', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="A" fill="#3b82f6" name="Config A" radius={[8, 8, 0, 0]} />
                <Bar dataKey="B" fill="#a855f7" name="Config B" radius={[8, 8, 0, 0]} />
                <Bar dataKey="C" fill="#ec4899" name="Config C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium text-purple-200 mb-4">Overall Performance (Radar)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={chartData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="name" stroke="#ffffff80" style={{ fontSize: '11px' }} />
                <PolarRadiusAxis stroke="#ffffff40" style={{ fontSize: '10px' }} />
                <Radar name="Config A" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} strokeWidth={2} />
                <Radar name="Config B" dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} strokeWidth={2} />
                <Radar name="Config C" dataKey="C" stroke="#ec4899" fill="#ec4899" fillOpacity={0.4} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-400/30 rounded-xl p-5">
            <div className="text-sm text-green-300 mb-2">Best Overall</div>
            <div className="text-2xl font-bold text-white mb-1">Config {bestOverall.id}</div>
            <div className="text-xs text-gray-300">Score: {bestOverall.metrics.overall} - Most balanced performance</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-400/30 rounded-xl p-5">
            <div className="text-sm text-amber-300 mb-2">Most Readable</div>
            <div className="text-2xl font-bold text-white mb-1">Config {mostReadable.id}</div>
            <div className="text-xs text-gray-300">Score: {mostReadable.metrics.readability} - Optimal sentence structure</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-400/30 rounded-xl p-5">
            <div className="text-sm text-cyan-300 mb-2">Most Coherent</div>
            <div className="text-2xl font-bold text-white mb-1">Config {mostCoherent.id}</div>
            <div className="text-xs text-gray-300">Score: {mostCoherent.metrics.coherence} - Best logical flow</div>
          </div>
        </div>
      </div>
    </div>
  );
}
