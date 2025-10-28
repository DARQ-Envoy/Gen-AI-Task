import { getExperiments } from '../actions/experiment-actions';
import { ExperimentCard } from './ExperimentCard';

export async function ExperimentList() {
  const experiments = await getExperiments();

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Experiments</h2>
      
      {experiments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-purple-200 mb-4">No experiments yet</p>
          <p className="text-sm text-gray-400">Create your first experiment to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiments.map((experiment) => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      )}
    </div>
  );
}
