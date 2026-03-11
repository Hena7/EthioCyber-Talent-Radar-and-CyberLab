import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  gradient?: string;
}

export default function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  gradient = 'from-cyan-500 to-green-500',
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-300">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {current} / {total} completed
      </p>
    </div>
  );
}
