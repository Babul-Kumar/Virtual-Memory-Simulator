import React, { useRef, useState, useCallback } from 'react';

/**
 * Controls — Start / Reset / Step / Skip buttons
 *
 * Props:
 *  onStart     {fn}
 *  onReset     {fn}
 *  onStep      {fn}
 *  onSkip      {fn}      jump to last step during animation
 *  isRunning   {bool}
 *  isAnimating {bool}    true while auto-play is running
 *  canStep     {bool}
 *  currentStep {number}
 *  totalSteps  {number}
 */
export default function Controls({
  onStart,
  onReset,
  onStep,
  onSkip,
  isRunning,
  isAnimating,
  canStep,
  currentStep,
  totalSteps,
}) {
  const btnRef  = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [launching, setLaunching] = useState(false);

  const handleStart = useCallback((e) => {
    if (isAnimating) return; // prevent double-click while running

    /* Ripple at click position */
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);

    /* Spring bounce */
    setLaunching(true);
    setTimeout(() => setLaunching(false), 500);

    onStart();
  }, [isAnimating, onStart]);

  return (
    <div className="flex flex-wrap items-center gap-4">

      {/* ── Start / Simulating button ─────────────────────────── */}
      <button
        ref={btnRef}
        id="btn-start"
        onClick={handleStart}
        disabled={isAnimating}
        style={{ position: 'relative', overflow: 'hidden' }}
        className={[
          'flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base',
          'transition-all duration-200 shadow-lg',
          isAnimating
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-violet-900/30 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-blue-900/30',
          launching ? 'btn-start-launching' : '',
        ].join(' ')}
      >
        {isAnimating ? (
          /* Spinner + pulsing dots while simulating */
          <>
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="flex items-center gap-0.5">
              Simulating
              <span className="inline-flex gap-0.5 ml-0.5">
                <span className="w-1 h-1 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: '0ms'   }} />
                <span className="w-1 h-1 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </span>
          </>
        ) : (
          /* Normal play icon */
          <>
            <svg className="btn-icon w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd" />
            </svg>
            Start Simulation
          </>
        )}

        {/* Ripple circles */}
        {ripples.map(({ id, x, y }) => (
          <span
            key={id}
            className="btn-ripple-circle"
            style={{ left: x - 30, top: y - 30 }}
          />
        ))}
      </button>

      {/* ── Skip button (only while animating) ───────────────── */}
      {isAnimating && (
        <button
          id="btn-skip"
          onClick={onSkip}
          className="flex items-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-sm
                     bg-slate-700/70 text-slate-300 border border-slate-600/50
                     hover:bg-slate-700 hover:text-white hover:border-slate-500
                     active:scale-95 transition-all duration-200"
        >
          {/* Fast-forward icon */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
          </svg>
          Skip
        </button>
      )}

      {/* ── Step Through (manual, disabled while animating) ──── */}
      {isRunning && (
        <button
          id="btn-step"
          onClick={onStep}
          disabled={!canStep || isAnimating}
          className="flex items-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-sm
                     bg-gradient-to-r from-violet-600 to-violet-500 text-white
                     hover:from-violet-500 hover:to-violet-400
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 transition-all duration-200 shadow-lg shadow-violet-900/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Step ({currentStep}/{totalSteps})
        </button>
      )}

      {/* ── Reset ────────────────────────────────────────────── */}
      <button
        id="btn-reset"
        onClick={onReset}
        className="flex items-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-sm
                   bg-slate-700/70 text-slate-300 border border-slate-600/50
                   hover:bg-slate-700 hover:text-white hover:border-slate-500
                   active:scale-95 transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset
      </button>
    </div>
  );
}
