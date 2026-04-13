import React, { useState, useCallback, useRef, useEffect } from 'react';
import InputForm from '../components/InputForm';
import MemoryGrid from '../components/MemoryGrid';
import Controls from '../components/Controls';
import StatsPanel from '../components/StatsPanel';
import ComparisonChart from '../components/ComparisonChart';
import { runLRU } from '../algorithms/lru';
import { runOptimal } from '../algorithms/optimal';
import { runFIFO } from '../algorithms/fifo';

/**
 * Simulator — the main simulation page
 */
export default function Simulator() {
  // ── Inputs ────────────────────────────────────────────────────────────
  const [frames, setFrames] = useState(3);
  const [pageInput, setPageInput] = useState('7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1');
  const [algorithm, setAlgorithm] = useState('fifo');

  // ── Simulation state ──────────────────────────────────────────────────
  const [result, setResult] = useState(null);
  const [fifoResult, setFifoResult] = useState(null);
  const [lruResult, setLruResult] = useState(null);
  const [optimalResult, setOptimalResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('grid');
  const [isAnimating, setIsAnimating] = useState(false);

  // Interval ref so we can cancel at any time
  const animIntervalRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (animIntervalRef.current) clearInterval(animIntervalRef.current); };
  }, []);

  // ── Parse and validate the page string ───────────────────────────────
  const parsePages = useCallback((input) => {
    const parts = input.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length === 0) return null;
    const nums = parts.map(Number);
    if (nums.some(isNaN)) return null;
    return nums;
  }, []);

  // ── Start simulation — animates each step one by one ─────────────────
  const handleStart = useCallback(() => {
    setError('');
    const pages = parsePages(pageInput);

    if (!pages || pages.length === 0) {
      setError('Please enter a valid page reference string (comma-separated numbers).');
      return;
    }
    if (frames < 1 || frames > 10) {
      setError('Number of frames must be between 1 and 10.');
      return;
    }

    // Cancel any running animation
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);

    const runFn = algorithm === 'fifo' ? runFIFO : algorithm === 'lru' ? runLRU : runOptimal;
    const res = runFn(pages, frames);
    const fifo = runFIFO(pages, frames);
    const lru  = runLRU(pages, frames);
    const opt  = runOptimal(pages, frames);

    setResult(res);
    setFifoResult(fifo);
    setLruResult(lru);
    setOptimalResult(opt);
    setCurrentStep(0);    // Reset to 0 — animation fills it in
    setIsAnimating(true);

    // Adaptive speed: target ~10 s total, clamp 400–1200 ms per step
    const total = res.steps.length;
    const delay = Math.max(400, Math.min(1200, Math.floor(10000 / total)));

    let step = 0;
    animIntervalRef.current = setInterval(() => {
      step += 1;
      setCurrentStep(step);
      if (step >= total) {
        clearInterval(animIntervalRef.current);
        animIntervalRef.current = null;
        setIsAnimating(false);
      }
    }, delay);
  }, [pageInput, frames, algorithm, parsePages]);

  // ── Skip — jump to last step immediately ─────────────────────────────
  const handleSkip = useCallback(() => {
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    animIntervalRef.current = null;
    setIsAnimating(false);
    setCurrentStep((prev) => {
      // Use the result we already have
      if (result) return result.steps.length;
      return prev;
    });
  }, [result]);

  // ── Manual step (stops auto-animation) ───────────────────────────────
  const handleStep = useCallback(() => {
    setError('');
    const pages = parsePages(pageInput);
    if (!pages) return;

    // Stop auto-animation
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    animIntervalRef.current = null;
    setIsAnimating(false);

    if (!result) {
      const runFn = algorithm === 'fifo' ? runFIFO : algorithm === 'lru' ? runLRU : runOptimal;
      const res = runFn(pages, frames);
      setResult(res);
      setCurrentStep(1);
      setFifoResult(runFIFO(pages, frames));
      setLruResult(runLRU(pages, frames));
      setOptimalResult(runOptimal(pages, frames));
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, result.steps.length));
    }
  }, [result, pageInput, frames, algorithm, parsePages]);

  // ── Reset ─────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    animIntervalRef.current = null;
    setIsAnimating(false);
    setResult(null);
    setFifoResult(null);
    setLruResult(null);
    setOptimalResult(null);
    setCurrentStep(0);
    setError('');
  }, []);

  // ── Derived values ────────────────────────────────────────────────────
  const isRunning = Boolean(result);
  const canStep = isRunning ? currentStep < result.steps.length : true;
  const visibleSteps = result ? result.steps.slice(0, currentStep) : [];
  const visibleFaults = visibleSteps.filter((s) => !s.isHit).length;
  const visibleHits   = visibleSteps.filter((s) =>  s.isHit).length;
  const visibleRatio  = visibleSteps.length > 0
    ? ((visibleHits / visibleSteps.length) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-200 p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ── */}
        <header className="text-center space-y-4 py-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold
                          uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Operating Systems Concept
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-text leading-tight">
            Virtual Memory Simulator
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Visualize page replacement algorithms step-by-step. Compare&nbsp;
            <span className="text-orange-400 font-semibold">FIFO</span>,&nbsp;
            <span className="text-blue-400 font-semibold">LRU</span> and&nbsp;
            <span className="text-violet-400 font-semibold">Optimal</span>&nbsp;
            to understand page fault behavior and memory efficiency.
          </p>
        </header>

        {/* ── Configuration Card ── */}
        <div className="glass-card rounded-2xl p-8 space-y-7 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-100">Configuration</h2>
          </div>

          <InputForm
            frames={frames}
            pages={pageInput}
            algorithm={algorithm}
            onFrames={setFrames}
            onPages={setPageInput}
            onAlgorithm={setAlgorithm}
          />

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <Controls
            onStart={handleStart}
            onReset={handleReset}
            onStep={handleStep}
            onSkip={handleSkip}
            isRunning={isRunning}
            isAnimating={isAnimating}
            canStep={canStep && !isAnimating}
            currentStep={isRunning ? currentStep : 0}
            totalSteps={result ? result.steps.length : 0}
          />

          {/* ── Progress bar (visible during animation) ── */}
          {isAnimating && result && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  Simulating step by step…
                </span>
                <span className="font-mono text-blue-400">
                  {currentStep}&nbsp;/&nbsp;{result.steps.length}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-violet-500 rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${(currentStep / result.steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Stats Panel ── */}
        {isRunning && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <StatsPanel
              totalFaults={visibleFaults}
              totalHits={visibleHits}
              hitRatio={visibleRatio}
              totalSteps={visibleSteps.length}
              algorithm={algorithm}
            />
          </div>
        )}

        {/* ── Visualization Tabs ── */}
        {isRunning && (
          <div className="glass-card rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex border-b border-slate-700/60">
              {[
                { id: 'grid',    label: 'Memory Grid',    icon: '▦' },
                { id: 'steps',   label: 'Step-by-Step',   icon: '≡' },
                { id: 'compare', label: 'Compare All',     icon: '⊿' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                    }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Grid tab */}
              {activeTab === 'grid' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-200 text-base">Memory Frame Visualization</h2>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      algorithm === 'fifo'
                        ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                        : algorithm === 'lru'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                    }`}>
                      {algorithm.toUpperCase()} • {frames} frame{frames !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <MemoryGrid steps={result.steps} currentStep={currentStep} frames={frames} />
                  </div>
                </div>
              )}

              {/* Steps tab */}
              {activeTab === 'steps' && (
                <div>
                  <h2 className="font-bold text-slate-200 text-base mb-4">Step-by-Step Execution Log</h2>
                  <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700/60 bg-slate-800/40">
                          <th className="text-left   px-4 py-3 text-slate-400 font-semibold w-12">#</th>
                          <th className="text-center px-4 py-3 text-slate-400 font-semibold">Page</th>
                          <th className="text-center px-4 py-3 text-slate-400 font-semibold">Status</th>
                          <th className="text-center px-4 py-3 text-slate-400 font-semibold">Evicted</th>
                          <th className="text-left   px-4 py-3 text-slate-400 font-semibold">Frames After</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.steps.slice(0, currentStep).map((s, i) => {
                          const isNewest = i === currentStep - 1;
                          return (
                            <tr
                              key={i}
                              className={`step-row border-b border-slate-700/30
                                ${isNewest ? 'step-row-enter bg-blue-500/5 ring-1 ring-inset ring-blue-500/20' : ''}`}
                            >
                              <td className="px-4 py-3 text-slate-500 font-mono text-xs">{s.step}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-mono font-bold
                                  ${isNewest
                                    ? 'bg-blue-500/25 text-blue-200 ring-1 ring-blue-400/60'
                                    : 'bg-slate-700/60 text-slate-200'}`}>
                                  {s.page}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                  ${s.isHit
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${s.isHit ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                  {s.isHit ? 'HIT' : 'FAULT'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center font-mono text-sm">
                                {s.evicted !== null
                                  ? <span className="text-amber-400">{s.evicted}</span>
                                  : <span className="text-slate-600">—</span>}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1.5">
                                  {s.frames.map((p, fi) => (
                                    <span
                                      key={fi}
                                      className={`inline-flex items-center justify-center w-8 h-7 rounded-md font-mono text-xs font-bold
                                        ${isNewest && p !== null
                                          ? 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/40'
                                          : 'bg-slate-700/60 text-slate-300'}`}
                                    >
                                      {p ?? '—'}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Compare tab */}
              {activeTab === 'compare' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-200 text-base">FIFO vs LRU vs Optimal — Performance Comparison</h2>
                    <span className="text-xs text-slate-400 italic">Optimal is theoretically the best possible result</span>
                  </div>
                  <ComparisonChart
                    fifoResult={fifoResult}
                    lruResult={lruResult}
                    optimalResult={optimalResult}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    {[
                      { label: 'FIFO',    res: fifoResult,    color: 'orange' },
                      { label: 'LRU',     res: lruResult,     color: 'blue'   },
                      { label: 'Optimal', res: optimalResult, color: 'violet' },
                    ].map(({ label, res, color }) => (
                      <div key={label}
                        className={`p-4 rounded-xl border ${
                          color === 'orange'
                            ? 'bg-orange-500/5 border-orange-500/20'
                            : color === 'blue'
                            ? 'bg-blue-500/5 border-blue-500/20'
                            : 'bg-violet-500/5 border-violet-500/20'
                        }`}>
                        <div className={`text-sm font-bold mb-2 ${
                          color === 'orange' ? 'text-orange-400'
                          : color === 'blue' ? 'text-blue-400'
                          : 'text-violet-400'
                        }`}>
                          {label}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-lg font-bold font-mono text-red-400">{res?.totalFaults ?? '-'}</div>
                            <div className="text-xs text-slate-500">Faults</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold font-mono text-emerald-400">{res?.totalHits ?? '-'}</div>
                            <div className="text-xs text-slate-500">Hits</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold font-mono text-blue-400">{res?.hitRatio ?? '-'}%</div>
                            <div className="text-xs text-slate-500">Ratio</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {fifoResult && lruResult && optimalResult && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                      <p className="text-sm text-slate-300">
                        <span className="text-amber-400 font-semibold">💡 Insight: </span>
                        {(() => {
                          const minFaults = Math.min(fifoResult.totalFaults, lruResult.totalFaults, optimalResult.totalFaults);
                          const best = fifoResult.totalFaults === minFaults && lruResult.totalFaults === minFaults
                            ? 'FIFO and LRU both tied with Optimal'
                            : fifoResult.totalFaults === minFaults
                            ? 'FIFO tied with Optimal'
                            : lruResult.totalFaults === minFaults
                            ? 'LRU tied with Optimal'
                            : null;
                          if (best) return `${best} on this reference string — great result!`;
                          return `Optimal achieved the fewest faults (${optimalResult.totalFaults}). LRU had ${lruResult.totalFaults - optimalResult.totalFaults} more, FIFO had ${fifoResult.totalFaults - optimalResult.totalFaults} more. FIFO's simplicity costs it future-use awareness.`;
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="text-center text-xs text-slate-600 py-6 border-t border-slate-800/60">
          Virtual Memory Optimization Simulator • Built with React + Vite + Tailwind CSS + Chart.js
        </footer>
      </div>
    </div>
  );
}
