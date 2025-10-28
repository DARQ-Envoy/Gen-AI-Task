import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getExperiment, getExperiments } from '../actions/experiment-actions';
import { ExperimentResults } from './components/ExperimentResults';
import { ExperimentHeader } from './components/ExperimentHeader';

interface ExperimentPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for known experiments
export async function generateStaticParams() {
  try {
    const experiments = await getExperiments();
    return experiments.map((experiment) => ({
      id: experiment.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ExperimentPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const experiment = await getExperiment(id);
    return {
      title: `Experiment ${id.slice(0, 8)} - LLM Lab`,
      description: `Results for experiment: ${experiment.prompt}`,
    };
  } catch {
    return {
      title: 'Experiment Not Found - LLM Lab',
    };
  }
}

export default async function ExperimentPage({ params }: ExperimentPageProps) {
  try {
    const { id } = await params;
    const experiment = await getExperiment(id);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <ExperimentHeader experiment={experiment} />
        <ExperimentResults experiment={experiment} />
      </div>
    );
  } catch (error) {
    console.error('Error loading experiment:', error);
    notFound();
  }
}
