
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Icons } from '../constants';

const QuantumVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [n, setN] = useState(1);
  const [potential, setPotential] = useState<'well' | 'harmonic'>('well');

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html('');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([-2, 2]).range([innerHeight, 0]);

    // X-Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight / 2})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}L`))
      .attr('color', '#475569');

    // Labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('fill', '#94a3b8')
      .attr('text-anchor', 'middle')
      .text('Position (x)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -innerHeight / 2)
      .attr('fill', '#94a3b8')
      .attr('text-anchor', 'middle')
      .text('Amplitude / Probability Density');

    const line = d3.line<{ x: number; y: number }>()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveBasis);

    const generateData = () => {
      const data = [];
      const steps = 200;
      for (let i = 0; i <= steps; i++) {
        const xVal = i / steps;
        let yVal = 0;
        if (potential === 'well') {
          // Psi_n(x) = sqrt(2/L) * sin(n*pi*x/L)
          yVal = Math.sqrt(2) * Math.sin(n * Math.PI * xVal);
        } else {
          // Simple harmonic oscillator approx for visualization
          // Using Hermite polynomial approximation logic
          const normalizedX = (xVal - 0.5) * 10;
          if (n === 1) yVal = Math.exp(-normalizedX * normalizedX / 2);
          else if (n === 2) yVal = normalizedX * Math.exp(-normalizedX * normalizedX / 2);
          else if (n === 3) yVal = (2 * normalizedX * normalizedX - 1) * Math.exp(-normalizedX * normalizedX / 2);
          else yVal = Math.sin(n * Math.PI * xVal) * Math.exp(-normalizedX * normalizedX / 10);
        }
        data.push({ x: xVal, y: yVal });
      }
      return data;
    };

    const plotData = generateData();

    // Wavefunction line
    g.append('path')
      .datum(plotData)
      .attr('fill', 'none')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Probability Density Area
    const area = d3.area<{ x: number; y: number }>()
      .x(d => x(d.x))
      .y0(innerHeight / 2)
      .y1(d => y(d.y * d.y))
      .curve(d3.curveBasis);

    g.append('path')
      .datum(plotData)
      .attr('fill', 'rgba(56, 189, 248, 0.1)')
      .attr('d', area);

    // Probability Density line
    g.append('path')
      .datum(plotData)
      .attr('fill', 'none')
      .attr('stroke', '#a78bfa')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,2')
      .attr('d', line.y(d => y(d.y * d.y)));

  }, [n, potential]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in zoom-in-95 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-indigo-400">
              <Icons.Chart /> Wavefunction Explorer
            </h2>
            <p className="text-slate-400 text-sm">Visualize spatial probability densities.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPotential('well')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${potential === 'well' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              Infinite Well
            </button>
            <button 
              onClick={() => setPotential('harmonic')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${potential === 'harmonic' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              Harmonic Oscillator
            </button>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 mb-8 overflow-hidden">
          <svg ref={svgRef} className="w-full h-auto" />
          <div className="flex justify-center gap-6 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-sky-400" />
              Wavefunction \(\psi(x)\)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 border-t border-dashed border-purple-400" />
              Prob. Density \(|\psi(x)|^2\)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-slate-300 font-medium">
              Quantum Number (n = {n})
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1" 
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-500 px-1">
              <span>Ground State</span>
              <span>High Energy</span>
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h4 className="text-sm font-bold text-slate-200 mb-2 uppercase tracking-wider">Physics Insight</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              As the quantum number \(n\) increases, the number of nodes (zeros) in the wavefunction increases. 
              According to the correspondence principle, at very high \(n\), the quantum probability distribution 
              starts to resemble the classical distribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumVisualizer;
