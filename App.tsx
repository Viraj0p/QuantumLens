
import React, { useState } from 'react';
import { View } from './types';
import { Icons, COLORS } from './constants';
import ProblemSolver from './components/ProblemSolver';
import QuantumVisualizer from './components/QuantumVisualizer';
import ConceptExplorer from './components/ConceptExplorer';
import ChatAssistant from './components/ChatAssistant';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.SOLVER);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400">
              <Icons.Atom />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              QuantumLens
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: View.SOLVER, label: 'Solver', icon: <Icons.Calculate /> },
              { id: View.VISUALIZER, label: 'Visualizer', icon: <Icons.Chart /> },
              { id: View.EXPLORER, label: 'Explorer', icon: <Icons.Search /> },
              { id: View.CHAT, label: 'Expert Chat', icon: <Icons.Bot /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === item.id 
                    ? 'bg-slate-800 text-sky-400 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            {/* Watermark removed */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />

        <div className="relative z-10">
          {activeView === View.SOLVER && <ProblemSolver />}
          {activeView === View.VISUALIZER && <QuantumVisualizer />}
          {activeView === View.EXPLORER && <ConceptExplorer />}
          {activeView === View.CHAT && <ChatAssistant />}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 px-6 py-4 flex justify-between items-center">
        {[
          { id: View.SOLVER, icon: <Icons.Calculate /> },
          { id: View.VISUALIZER, icon: <Icons.Chart /> },
          { id: View.EXPLORER, icon: <Icons.Search /> },
          { id: View.CHAT, icon: <Icons.Bot /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`p-3 rounded-xl transition-all ${
              activeView === item.id 
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-900/40' 
                : 'text-slate-500'
            }`}
          >
            {item.icon}
          </button>
        ))}
      </nav>

      {/* Footer (Desktop) */}
      <footer className="hidden md:block py-6 border-t border-slate-900 px-8 text-center text-slate-600 text-xs">
        <p>© 2024 QuantumLens. Exploring the subatomic frontier with Artificial Intelligence.</p>
      </footer>
    </div>
  );
};

export default App;
