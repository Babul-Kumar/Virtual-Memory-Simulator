import React from 'react';
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
 * ComparisonChart — Bar chart comparing FIFO vs LRU vs Optimal performance
 *
 * Props:
 *  fifoResult    {Object|null}  FIFO simulation results
 *  lruResult     {Object|null}  LRU simulation results
 *  optimalResult {Object|null}  Optimal simulation results
 */
export default function ComparisonChart({ fifoResult, lruResult, optimalResult }) {
  if (!fifoResult && !lruResult && !optimalResult) {
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
        label: 'FIFO',
        data: fifoResult
          ? [fifoResult.totalFaults, fifoResult.totalHits, parseFloat(fifoResult.hitRatio)]
          : [0, 0, 0],
        backgroundColor: [
          'rgba(239, 68, 68, 0.55)',   // faults → red
          'rgba(34, 197, 94, 0.55)',   // hits → green
          'rgba(251, 146, 60, 0.55)',  // ratio → orange
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 146, 60, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'LRU',
        data: lruResult
          ? [lruResult.totalFaults, lruResult.totalHits, parseFloat(lruResult.hitRatio)]
          : [0, 0, 0],
        backgroundColor: [
          'rgba(239, 68, 68, 0.75)',
          'rgba(34, 197, 94, 0.75)',
          'rgba(59, 130, 246, 0.75)',
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
          'rgba(167, 139, 250, 0.45)',
          'rgba(52, 211, 153, 0.45)',
          'rgba(139, 92, 246, 0.45)',
        ],
        borderColor: [
          'rgba(167, 139, 250, 0.8)',
          'rgba(52, 211, 153, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
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
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
