import Link from 'next/link';
import { Calendar, BarChart3, Clock } from 'lucide-react';

interface Experiment {
  id: string;
  prompt: string;
  createdAt: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  overallScore?: number;
}

interface ExperimentCardProps {
  experiment: Experiment;
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'running': return 'text-blue-400 bg-blue-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  return (
    <Link 
      href={`/experiments/${experiment.id}`}
      className="block bg-black/20 hover:bg-black/30 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
              Experiment {experiment.id.slice(0, 8)}
            </h3>
            <p className="text-sm text-gray-400 truncate max-w-md">
              {experiment.prompt}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {experiment.overallScore && (
            <div className="text-right">
              <div className="text-lg font-bold text-white">{experiment.overallScore}</div>
              <div className="text-xs text-gray-400">Overall Score</div>
            </div>
          )}
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(experiment.status)}`}>
            {experiment.status}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{experiment.createdAt.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{experiment.createdAt.toLocaleTimeString()}</span>
        </div>
      </div>
    </Link>
  );
}
