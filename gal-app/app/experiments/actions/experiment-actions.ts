'use server';

import { revalidatePath } from 'next/cache';
import { calculateMetrics } from '../utils/metrics';

// Create a persistent store that survives hot reloads
const experimentStore = (() => {
  if (typeof global !== 'undefined' && !(global as any).experimentStore) {
    (global as any).experimentStore = [];
  }
  return (global as any).experimentStore;
})();

interface Experiment {
  id: string;
  prompt: string;
  config_1: { temperature: number; top_p: number; max_tokens: number };
  config_2: { temperature: number; top_p: number; max_tokens: number };
  config_3: { temperature: number; top_p: number; max_tokens: number };
  createdAt: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
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

export async function getExperiments(): Promise<Experiment[]> {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return experimentStore
    .sort((a: Experiment, b: Experiment) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);
}

export async function getExperiment(id: string): Promise<Experiment> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const experiment = experimentStore.find((exp: Experiment) => exp.id === id);
  if (!experiment) {
    throw new Error('Experiment not found');
  }
  
  return experiment;
}

export async function createExperiment(data: {
  prompt: string;
  config_1: { temperature: number; top_p: number; max_tokens: number };
  config_2: { temperature: number; top_p: number; max_tokens: number };
  config_3: { temperature: number; top_p: number; max_tokens: number };
}): Promise<string> {
  const id = Math.random().toString(36).substring(2, 15);
  
  const newExperiment: Experiment = {
    id,
    ...data,
    createdAt: new Date(),
    status: 'pending',
  };
  
  experimentStore.unshift(newExperiment);
  revalidatePath('/experiments');
  
  // Process experiment in background by calling backend API
  (async () => {
    try {
      // Wait 500ms before starting "running" state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const experiment = experimentStore.find((exp: Experiment) => exp.id === id);
      if (experiment) {
        experiment.status = 'running';
        
        // Call backend API to get real responses
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const params = [data.config_1, data.config_2, data.config_3];
        
        const response = await fetch(`${backendUrl}/prompt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: data.prompt,
            params: params
          }),
          // Explicitly configure fetch for server-side calls
          cache: 'no-store',
        });
        
        console.log('[Server] Response status:', response.status, 'OK:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[Server] Backend API error:', response.status, errorText);
          throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Print the backend response
        console.log('[Server] Backend Response:', JSON.stringify(result, null, 2));
        
        // Validate response structure
        if (!result.responses || !Array.isArray(result.responses)) {
          throw new Error('Invalid response structure from backend');
        }
        
        // Process the responses and calculate mock metrics
        experiment.status = 'completed';
        experiment.responses = result.responses.map((res: any, index: number) => {
          const configs = ['A', 'B', 'C'];
          const configNames = ['Configuration A', 'Configuration B', 'Configuration C'];
          
          // Check if this response has an error
          if (res.error) {
            console.warn(`[Server] Response ${index + 1} has error:`, res.error);
          }
          
          const responseText = res.response || res.error || 'No response received';
          
          // Calculate real metrics based on text analysis
          const metrics = calculateMetrics(responseText, data.prompt);
          const paramkey = `config_${index+1}` 
          return {
            id: configs[index],
            config: configNames[index],
            params: experiment[paramkey],
            text: responseText,
            metrics
          };
        });
        
        // Note: revalidatePath cannot be called here - it's in a background async function
        // The frontend polling will pick up the changes automatically
        console.log('[Server] Experiment completed successfully:', id);
      }
    } catch (error) {
      console.error('[Server] Error processing experiment:', error);
      const experiment = experimentStore.find((exp: Experiment) => exp.id === id);
      if (experiment) {
        experiment.status = 'failed';
        // Store error message for debugging
        console.error('[Server] Failed experiment details:', {
          id: experiment.id,
          prompt: experiment.prompt,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  })();
  
  return id;
}

export async function deleteExperiment(id: string): Promise<void> {
  const index = experimentStore.findIndex((exp: Experiment) => exp.id === id);
  if (index > -1) {
    experimentStore.splice(index, 1);
  }
  revalidatePath('/experiments');
}
