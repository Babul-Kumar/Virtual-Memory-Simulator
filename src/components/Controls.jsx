import React from 'react';

/**
 * Controls — Start / Reset / Step buttons
 *
 * Props:
 *  onStart    {fn}      run the simulation
 *  onReset    {fn}      clear all state
 *  onStep     {fn}      advance one step
 *  isRunning  {bool}    whether simulation has results
 *  canStep    {bool}    whether there are more steps to show
 *  currentStep {number} index of current visible step
 *  totalSteps  {number} total step count
 */
export default function Controls({
  onStart,
  onReset,
  onStep,
  isRunning,
  canStep,
  currentStep,
  totalSteps,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* ── Start Simulation ─────────────────────────────────────── */}
      <button
        id="btn-start"
        onClick={onStart}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                   bg-gradient-to-r from-blue-600 to-blue-500 text-white
                   hover:from-blue-500 hover:to-blue-400
                   active:scale-95 transition-all duration-200 shadow-lg shadow-blue-900/30"
      >
        {/* Play icon */}
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd" />
        </svg>
        Start Simulation
      </button>

      {/* ── Step Through ─────────────────────────────────────────── */}
      {isRunning && (
        <button
          id="btn-step"
          onClick={onStep}
          disabled={!canStep}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
                     bg-gradient-to-r from-violet-600 to-violet-500 text-white
                     hover:from-violet-500 hover:to-violet-400
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 transition-all duration-200 shadow-lg shadow-violet-900/30"
        >
          {/* Step icon */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Step ({currentStep}/{totalSteps})
        </button>
      )}

      {/* ── Reset ────────────────────────────────────────────────── */}
      <button
        id="btn-reset"
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
                   bg-slate-700/70 text-slate-300 border border-slate-600/50
                   hover:bg-slate-700 hover:text-white hover:border-slate-500
                   active:scale-95 transition-all duration-200"
      >
        {/* Reset icon */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset
      </button>
    </div>
  );
}
