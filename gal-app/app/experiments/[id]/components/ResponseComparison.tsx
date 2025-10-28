import { Eye } from 'lucide-react';

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

interface ResponseComparisonProps {
  responses: Response[];
  onSelectResponse: (index: number) => void;
}

export function ResponseComparison({ responses, onSelectResponse }: ResponseComparisonProps) {
  const getColorClasses = (index: number) => {
    const colors = [
      { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-400/30', text: 'text-blue-300', button: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-200' },
      { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-400/30', text: 'text-purple-300', button: 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-200' },
      { bg: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-400/30', text: 'text-pink-300', button: 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-200' }
    ];
    return colors[index] || colors[0];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-white mb-2">Response Comparison</h2>
        <p className="text-sm text-purple-200 mb-6">All responses side-by-side for easy comparison</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {responses.map((response, index) => {
            const colors = getColorClasses(index);
            return (
              <div key={response.id} className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-semibold ${colors.text}`}>Response {response.id}</h3>
                  <span className={`text-xs px-2 py-1 ${colors.button} rounded-full`}>
                    Score: {response.metrics.overall}
                  </span>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                    {response.text}
                  </p>
                </div>
                
                <div className={`space-y-2 p-3 bg-black/20 rounded-lg border ${colors.border}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${colors.text}`}>Overall Score</span>
                    <span className="text-lg font-bold text-white">{response.metrics.overall}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-xs text-gray-400 block">Coherence</span>
                      <span className="text-sm font-semibold text-white">{response.metrics.coherence}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Complete</span>
                      <span className="text-sm font-semibold text-white">{response.metrics.completeness}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Readable</span>
                      <span className="text-sm font-semibold text-white">{response.metrics.readability}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Structure</span>
                      <span className="text-sm font-semibold text-white">{response.metrics.structure}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => onSelectResponse(index)}
                  className={`w-full mt-3 py-2 ${colors.button} rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2`}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
