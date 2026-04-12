import React from 'react';

/**
 * InputForm — collects user inputs:
 *  - Number of memory frames
 *  - Page reference string (comma-separated)
 *  - Algorithm selection (LRU / Optimal)
 *
 * Props:
 *  frames       {number}   current frame count
 *  pages        {string}   raw user input for page string
 *  algorithm    {string}   'lru' | 'optimal'
 *  onFrames     {fn}       update frame count
 *  onPages      {fn}       update page string
 *  onAlgorithm  {fn}       update algorithm selection
 */
export default function InputForm({
  frames,
  pages,
  algorithm,
  onFrames,
  onPages,
  onAlgorithm,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* ── Number of Frames ─────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="frame-count"
          className="text-sm font-semibold text-slate-300 uppercase tracking-wider"
        >
          Memory Frames
        </label>
        <input
          id="frame-count"
          type="number"
          min="1"
          max="10"
          value={frames}
          onChange={(e) => onFrames(Number(e.target.value))}
          className="input-glow w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/70
                     text-white font-mono text-lg text-center transition-all duration-200
                     hover:border-blue-500/50 focus:border-blue-500"
          placeholder="e.g. 3"
        />
        <p className="text-xs text-slate-500">Range: 1–10</p>
      </div>

      {/* ── Page Reference String ─────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="page-string"
          className="text-sm font-semibold text-slate-300 uppercase tracking-wider"
        >
          Page Reference String
        </label>
        <input
          id="page-string"
          type="text"
          value={pages}
          onChange={(e) => onPages(e.target.value)}
          className="input-glow w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/70
                     text-white font-mono text-sm transition-all duration-200
                     hover:border-blue-500/50 focus:border-blue-500"
          placeholder="e.g. 1,2,3,4,1,2,5,1,2,3,4,5"
        />
        <p className="text-xs text-slate-500">Comma-separated page numbers</p>
      </div>

      {/* ── Algorithm Select ──────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="algorithm-select"
          className="text-sm font-semibold text-slate-300 uppercase tracking-wider"
        >
          Algorithm
        </label>
        <select
          id="algorithm-select"
          value={algorithm}
          onChange={(e) => onAlgorithm(e.target.value)}
          className="input-glow w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/70
                     text-white font-medium transition-all duration-200 cursor-pointer
                     hover:border-violet-500/50 focus:border-violet-500 appearance-none"
        >
          <option value="lru">LRU — Least Recently Used</option>
          <option value="optimal">Optimal — Bélády's Algorithm</option>
        </select>
        <p className="text-xs text-slate-500">
          {algorithm === 'lru'
            ? 'Evicts the page used furthest in the past'
            : 'Evicts the page used furthest in the future'}
        </p>
      </div>
    </div>
  );
}
