
import React, { useState } from 'react';
import { getConceptExplanation } from '../services/geminiService';
import { Icons } from '../constants';
import MathDisplay from './MathDisplay';

const POPULAR_CONCEPTS = [
  "Schrödinger Equation",
  "Heisenberg Uncertainty Principle",
  "Entanglement",
  "Quantum Tunneling",
  "Spin and Statistics",
  "Bell's Theorem"
];

const ConceptExplorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');

  const fetchExplanation = async (concept: string) => {
    setLoading(true);
    setExplanation('');
    try {
      const res = await getConceptExplanation(concept);
      setExplanation(res);
    } catch (e) {
      setExplanation("Could not load explanation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-accent">
          <Icons.Search /> Concept Explorer
        </h2>
        
        <div className="relative mb-8">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchExplanation(query)}
            placeholder="Search for a concept like 'Stern-Gerlach Experiment'..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <Icons.Search />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-slate-500 py-1 mr-2">Suggestions:</span>
          {POPULAR_CONCEPTS.map(c => (
            <button 
              key={c}
              onClick={() => { setQuery(c); fetchExplanation(c); }}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full" />
            <p className="text-slate-400 animate-pulse">Consulting the quantum oracle...</p>
          </div>
        )}

        {explanation && !loading && (
          <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 prose prose-invert prose-sky max-w-none">
             <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
                {explanation.split(/(\$\$.*?\$\$|\$.*?\$)/gs).map((part, i) => {
                  if (part.startsWith('$$')) {
                    return <MathDisplay key={i} math={part.slice(2, -2)} block />;
                  } else if (part.startsWith('$')) {
                    return <MathDisplay key={i} math={part.slice(1, -1)} />;
                  }
                  return part;
                })}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptExplorer;
