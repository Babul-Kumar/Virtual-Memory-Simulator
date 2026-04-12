import React, { useEffect, useRef } from 'react';

/**
 * MemoryGrid — visual representation of memory frame states
 *
 * Renders the current page-to-frame mapping as an animated grid.
 * Each cell shows the page number and highlights:
 *   - GREEN border  → page hit in this step
 *   - RED   border  → page fault in this step
 *   - AMBER         → page that was evicted (shown briefly)
 *
 * Props:
 *  steps       {Array}   full simulation steps array
 *  currentStep {number}  index of the currently displayed step (1-based)
 *  frames      {number}  total frame count
 */
export default function MemoryGrid({ steps, currentStep, frames }) {
  const visibleSteps = steps.slice(0, currentStep);
  const containerRef = useRef(null);

  // Auto-scroll to rightmost column as steps progress
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [currentStep]);

  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 text-sm italic">
        Run the simulation to see memory frames
      </div>
    );
  }

  // Build frame rows × step columns matrix
  // frameMatrix[frameIndex][stepIndex] = page number
  const frameMatrix = Array.from({ length: frames }, (_, fi) =>
    visibleSteps.map((s) => s.frames[fi] ?? null)
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Page reference header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-20 shrink-0">
          Step →
        </span>
        <div
          ref={containerRef}
          className="flex gap-1 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'thin' }}
        >
          {visibleSteps.map((s, i) => (
            <div
              key={i}
              className={`shrink-0 w-10 text-center text-xs font-mono font-bold py-1 rounded-md
                ${i === currentStep - 1
                  ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/50'
                  : 'text-slate-400'
                }`}
            >
              {s.page}
            </div>
          ))}
        </div>
      </div>

      {/* Hit/Fault indicator row */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 w-20 shrink-0">Status</span>
        <div className="flex gap-1 overflow-x-hidden">
          {visibleSteps.map((s, i) => (
            <div
              key={i}
              className={`shrink-0 w-10 text-center text-xs font-bold py-1 rounded-md
                ${s.isHit
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-500/15 text-red-400'
                }
                ${i === currentStep - 1 ? 'ring-1 ring-current' : ''}`}
            >
              {s.isHit ? 'H' : 'F'}
            </div>
          ))}
        </div>
      </div>

      {/* Frame rows */}
      {frameMatrix.map((row, fi) => (
        <div key={fi} className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 w-20 shrink-0">
            Frame {fi + 1}
          </span>
          <div className="flex gap-1 overflow-x-hidden">
            {row.map((page, si) => {
              const step = visibleSteps[si];
              const isCurrentStep = si === currentStep - 1;
              const isHit = step.isHit;
              const isEmpty = page === null || page === undefined;

              let cellClass =
                'shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-mono font-bold text-sm transition-all duration-300 ';

              if (isEmpty) {
                cellClass += 'bg-slate-800/40 border border-dashed border-slate-700/50 text-slate-600';
              } else if (isCurrentStep) {
                if (isHit) {
                  cellClass +=
                    'bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 animate-pulse-hit animate-fade-slide';
                } else {
                  cellClass +=
                    'bg-red-500/20 border border-red-500/60 text-red-300 animate-pulse-fault animate-fade-slide';
                }
              } else {
                cellClass +=
                  'bg-slate-800/60 border border-slate-700/50 text-slate-300';
              }

              return (
                <div key={si} className={cellClass}>
                  {isEmpty ? '—' : page}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500/40 border border-emerald-500/70" />
          <span className="text-xs text-slate-400">Page Hit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500/40 border border-red-500/70" />
          <span className="text-xs text-slate-400">Page Fault</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-slate-800/60 border border-dashed border-slate-700/50" />
          <span className="text-xs text-slate-400">Empty Frame</span>
        </div>
      </div>
    </div>
  );
}
