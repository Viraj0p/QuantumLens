
export enum View {
  SOLVER = 'SOLVER',
  VISUALIZER = 'VISUALIZER',
  EXPLORER = 'EXPLORER',
  CHAT = 'CHAT'
}

export interface ProblemSolution {
  problem: string;
  explanation: string;
  steps: {
    title: string;
    content: string;
    latex?: string;
  }[];
  finalAnswer: string;
}

export interface Concept {
  id: string;
  title: string;
  summary: string;
  description: string;
  keyEquations: string[];
}

export interface VisualizationState {
  type: 'square-well' | 'harmonic-oscillator' | 'hydrogen-atom';
  n: number;
  l: number;
  m: number;
}
