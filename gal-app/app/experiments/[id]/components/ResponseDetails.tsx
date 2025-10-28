'use client';

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

interface ResponseDetailsProps {
  responses: Response[];
  selectedIndex: number;
  onSelectResponse: (index: number) => void;
}

export function ResponseDetails({ responses, selectedIndex, onSelectResponse }: ResponseDetailsProps) {
  const selectedResponse = responses[selectedIndex];
  
  const getColorClasses = (index: number) => {
    const colors = [
      { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-400/30', text: 'text-blue-300', button: 'bg-blue-500/30 text-blue-200 border-blue-400/50' },
      { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-400/30', text: 'text-purple-300', button: 'bg-purple-500/30 text-purple-200 border-purple-400/50' },
      { bg: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-400/30', text: 'text-pink-300', button: 'bg-pink-500/30 text-pink-200 border-pink-400/50' }
    ];
    return colors[index] || colors[0];
  };

  return (
    <div className="space-y-6">
      {/* Response Selector */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
        <div className="flex items-center gap-3">
          {responses.map((response, index) => {
            const colors = getColorClasses(index);
            return (
              <button
                key={response.id}
                onClick={() => onSelectResponse(index)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  selectedIndex === index
                    ? `${colors.button} border-2 ${colors.border}`
                    : 'bg-black/20 text-gray-400 hover:bg-black/30 border-2 border-transparent'
                }`}
              >
                Response {response.id} ({response.metrics.overall})
              </button>
            );
          })}
        </div>
      </div>

      {selectedResponse && (
        <div className={`bg-gradient-to-br ${getColorClasses(selectedIndex).bg} backdrop-blur-xl rounded-2xl border ${getColorClasses(selectedIndex).border} p-8`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${getColorClasses(selectedIndex).text} mb-2`}>
                {selectedResponse.config}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span>Overall Score: <strong>{selectedResponse.metrics.overall}</strong></span>
              </div>
            </div>
            <div className={`text-center px-6 py-4 ${getColorClasses(selectedIndex).button} rounded-xl`}>
              <div className="text-xs text-gray-300 mb-1">Overall Score</div>
              <div className={`text-4xl font-bold ${getColorClasses(selectedIndex).text}`}>
                {selectedResponse.metrics.overall}
              </div>
              <div className="text-xs text-gray-400 mt-1">/100</div>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Generated Response</h3>
            <p className="text-base text-gray-200 leading-relaxed whitespace-pre-line">
              {selectedResponse.text}
            </p>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="text-xs text-gray-400 mb-2">Coherence Score</div>
              <div className="text-3xl font-bold text-white mb-2">{selectedResponse.metrics.coherence}</div>
              <div className="text-xs text-gray-300">Measures logical flow and topic consistency</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="text-xs text-gray-400 mb-2">Completeness</div>
              <div className="text-3xl font-bold text-white mb-2">{selectedResponse.metrics.completeness}</div>
              <div className="text-xs text-gray-300">Evaluates how thoroughly the prompt was addressed</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="text-xs text-gray-400 mb-2">Readability</div>
              <div className="text-3xl font-bold text-white mb-2">{selectedResponse.metrics.readability}</div>
              <div className="text-xs text-gray-300">Based on Flesch Reading Ease and sentence structure</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="text-xs text-gray-400 mb-2">Structure Quality</div>
              <div className="text-3xl font-bold text-white mb-2">{selectedResponse.metrics.structure}</div>
              <div className="text-xs text-gray-300">Analyzes formatting, paragraphs, and organization</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
