'use client'


import Link from 'next/link';
import { ArrowLeft, BarChart3, Calendar, Clock, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getExperiment } from '../../actions/experiment-actions';

interface Experiment {
  id: string;
  prompt: string;
  createdAt: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  config_1: { temperature: number; top_p: number; max_tokens: number };
  config_2: { temperature: number; top_p: number; max_tokens: number };
  config_3: { temperature: number; top_p: number; max_tokens: number };
  responses?: Array<{
    id: string;
    config: string;
    text: string;
    params: { temperature: number; top_p: number; max_tokens: number };
    metrics: {
      coherence: number;
      completeness: number;
      readability: number;
      structure: number;
      overall: number;
    };
  }>;
}

interface ExperimentHeaderProps {
  experiment: Experiment;
}

export function ExperimentHeader({ experiment:initialExperiment }: ExperimentHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'running': return 'text-blue-400 bg-blue-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [experiment, setExperiment] = useState<Experiment>(initialExperiment);
const configuration_list = Object.keys(experiment).filter(key=>{
  if(key.includes("config_")){
    return experiment[key as "config_1"|"config_2"|"config_3"]
  }
}
)
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



const exportToJSON = () => {

    console.log("export to Json is being called");
  const responses = experiment?.responses || [];
  console.log({responses}, {experiment})
  if (responses.length === 0) {
    console.warn("No responses to export");
    return;
  }
    const allScores = responses?.map(res => res.metrics.overall)
    const[a,b,c] = allScores||[]
    const maxScore = Math.max(a,b,c)
    const exportData = {
      experiment_id: "exp_" + Date.now(),
      timestamp: new Date().toISOString(),
      prompt: experiment.prompt,
      
      configurations: responses?.map((r) => ({
        id: r.id,
        name: r.config,
        parameters: r.params
      })),
      results: responses?.map(r => ({
        configuration_id: r.id,
        configuration_name: r.config,
        response_text: r.text,
        metrics: r.metrics
      })),
      summary: {
        best_configuration: responses?.filter(res=>res.metrics.overall == maxScore)[0].metrics.overall,
        best_overall_score: maxScore
      }
    };
    console.log({exportData}, {responses})
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anc:HTMLAnchorElement = document.createElement('a');
    anc.href = url;
    anc.download = `llm-experiment-${Date.now()}.json`;
    document.body.appendChild(anc);
    anc.click();
    document.body.removeChild(anc);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  

      // console.log(experiment)

  return (
    <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/experiments"
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Experiment {experiment.id.slice(0, 8)}</h1>
                <p className="text-xs text-purple-300">LLM Parameter Analysis</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-300">Created</div>
              <div className="text-xs text-gray-400">
                {experiment.createdAt.toLocaleDateString()} at {experiment.createdAt.toLocaleTimeString()}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-center block ${getStatusColor(experiment.status)}`}>
              {experiment.status}
            </span>
 <div className="relative">

            <button
            onClick={exportToJSON}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer">
            <Download className="w-4 h-4" />
            Export Results
          </button>
          
         
            {showExportMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowExportMenu(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden z-20">
                      <div className="p-2">
                        <button
                          onClick={exportToJSON}
                          className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition-all group "
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                              <span className="text-blue-300 text-xs font-bold">JSON</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">JSON Format</div>
                              <div className="text-xs text-gray-400">Full data structure</div>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          // onClick={exportToCSV}
                          className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-all">
                              <span className="text-green-300 text-xs font-bold">CSV</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">CSV Format</div>
                              <div className="text-xs text-gray-400">For spreadsheet analysis</div>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          // onClick={exportToMarkdown}
                          className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                              <span className="text-purple-300 text-xs font-bold">MD</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">Markdown Report</div>
                              <div className="text-xs text-gray-400">Readable documentation</div>
                            </div>
                          </div>
                        </button>
                      </div>
                      
                      <div className="border-t border-white/10 p-3 bg-black/20">
                        <p className="text-xs text-gray-400 text-center">
                          All formats include complete experiment data
                        </p>
                      </div>
                    </div>
                  </>
                )}
 </div>

          </div>
        </div>
        
        <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/10">
          <h2 className="text-sm font-medium text-white mb-2">Prompt</h2>
          <p className="text-gray-300 leading-relaxed">{experiment.prompt}</p>
        </div>
      </div>
    </header>
  );
}
