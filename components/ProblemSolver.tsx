
import React, { useState } from 'react';
import { solveQuantumProblem } from '../services/geminiService';
import { ProblemSolution } from '../types';
import { Icons } from '../constants';
import MathDisplay from './MathDisplay';

const ProblemSolver: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<ProblemSolution | null>(null);

  const handleSolve = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await solveQuantumProblem(input);
      setSolution(res);
    } catch (error) {
      console.error(error);
      alert("Failed to solve the problem. Please check your internet or try a different query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-sky-400">
          <Icons.Calculate /> Quantum Problem Solver
        </h2>
        <p className="text-slate-400 mb-6">
          Input your quantum mechanics problem below. From simple wave-particle duality to complex perturbation theory, our AI can handle it.
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Find the normalized wave function for the first excited state of a particle in an infinite square well of width L..."
          className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none mb-4"
        />
        <button
          onClick={handleSolve}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            loading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-900/20'
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-slate-400 border-t-transparent rounded-full" />
              Solving Equation...
            </div>
          ) : (
            <>
              <Icons.Sparkles /> Compute Solution
            </>
          )}
        </button>
      </div>

      {solution && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
            <h3 className="text-xl font-semibold text-sky-300 mb-3 border-b border-slate-800 pb-2">Analysis</h3>
            <p className="text-slate-300 leading-relaxed mb-6">{solution.explanation}</p>
            
            <div className="space-y-8">
              {solution.steps.map((step, idx) => (
                <div key={idx} className="relative pl-8 border-l-2 border-sky-900/50">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-sky-600 border-2 border-slate-950" />
                  <h4 className="font-bold text-slate-100 mb-2">{step.title}</h4>
                  <p className="text-slate-400 mb-3">{step.content}</p>
                  {step.latex && (
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 overflow-x-auto">
                      <MathDisplay math={step.latex} block />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-sky-900/10 border border-sky-800/50 rounded-xl">
              <h3 className="text-lg font-bold text-sky-400 mb-2">Final Result</h3>
              <div className="text-slate-100 font-medium">
                <MathDisplay math={solution.finalAnswer} block />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemSolver;
