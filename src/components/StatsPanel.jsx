import React from 'react';

/**
 * StatsPanel — displays simulation statistics
 *
 * Props:
 *  totalFaults  {number}  total page faults
 *  totalHits    {number}  total page hits
 *  hitRatio     {string}  hit percentage (e.g. "60.0")
 *  totalSteps   {number}  total page references
 *  algorithm    {string}  'lru' | 'optimal'
 */
export default function StatsPanel({
  totalFaults,
  totalHits,
  hitRatio,
  totalSteps,
  algorithm,
}) {
  const stats = [
    {
      id: 'stat-hits',
      label: 'Page Hits',
      value: totalHits,
      suffix: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'emerald',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
    },
    {
      id: 'stat-faults',
      label: 'Page Faults',
      value: totalFaults,
      suffix: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'red',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      iconBg: 'bg-red-500/20',
    },
    {
      id: 'stat-ratio',
      label: 'Hit Ratio',
      value: hitRatio,
      suffix: '%',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'blue',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
    },
    {
      id: 'stat-total',
      label: 'Total References',
      value: totalSteps,
      suffix: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'violet',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
      text: 'text-violet-400',
      iconBg: 'bg-violet-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.id}
          id={s.id}
          className={`flex flex-col gap-3 p-4 rounded-2xl border ${s.bg} ${s.border} 
                      glass-card transition-all duration-300 hover:scale-[1.02]`}
        >
          {/* Icon + label */}
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${s.iconBg} ${s.text}`}>
              {s.icon}
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {s.label}
            </span>
          </div>

          {/* Value */}
          <div className={`text-3xl font-bold ${s.text} font-mono`}>
            {s.value}
            <span className="text-xl">{s.suffix}</span>
          </div>

          {/* Progress bar for hit ratio */}
          {s.id === 'stat-ratio' && (
            <div className="w-full h-1.5 rounded-full bg-slate-700/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700"
                style={{ width: `${hitRatio}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
