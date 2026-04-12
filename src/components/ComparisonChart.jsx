import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * ComparisonChart — Bar chart comparing LRU vs Optimal algorithm performance
 *
 * Props:
 *  lruResult     {Object|null}  LRU simulation results
 *  optimalResult {Object|null}  Optimal simulation results
 */
export default function ComparisonChart({ lruResult, optimalResult }) {
  if (!lruResult && !optimalResult) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm italic">
        Run the simulation to see comparison
      </div>
    );
  }

  const data = {
    labels: ['Page Faults', 'Page Hits', 'Hit Ratio (%)'],
    datasets: [
      {
        label: 'LRU',
        data: lruResult
          ? [lruResult.totalFaults, lruResult.totalHits, parseFloat(lruResult.hitRatio)]
          : [0, 0, 0],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',   // faults → red
          'rgba(34, 197, 94, 0.7)',   // hits → green
          'rgba(59, 130, 246, 0.7)',  // ratio → blue
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Optimal',
        data: optimalResult
          ? [optimalResult.totalFaults, optimalResult.totalHits, parseFloat(optimalResult.hitRatio)]
          : [0, 0, 0],
        backgroundColor: [
          'rgba(239, 68, 68, 0.3)',
          'rgba(34, 197, 94, 0.3)',
          'rgba(59, 130, 246, 0.3)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(59, 130, 246, 0.6)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        borderDash: [4, 4],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: "'Inter', sans-serif", size: 12, weight: '500' },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(51, 65, 85, 0.8)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            const suffix = ctx.label === 'Hit Ratio (%)' ? '%' : '';
            return ` ${ctx.dataset.label}: ${ctx.parsed.y}${suffix}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)', drawBorder: false },
        ticks: {
          color: '#64748b',
          font: { family: "'Inter', sans-serif", size: 11 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(51, 65, 85, 0.3)', drawBorder: false },
        ticks: {
          color: '#64748b',
          font: { family: "'Inter', sans-serif", size: 11 },
        },
      },
    },
  };

  return (
    <div style={{ height: '280px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
