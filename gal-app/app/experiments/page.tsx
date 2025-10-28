import { Metadata } from 'next';
import { ExperimentForm } from './components/ExperimentForm';
import { ExperimentList } from './components/ExperimentList';

export const metadata: Metadata = {
  title: 'Experiments - LLM Lab',
  description: 'Manage and view your LLM experiments',
};

export default function ExperimentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">LLM Experiments</h1>
          <p className="text-purple-200">Create and manage your LLM parameter experiments</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ExperimentForm />
          </div>
          <div className="lg:col-span-2">
            <ExperimentList />
          </div>
        </div>
      </div>
    </div>
  );
}
