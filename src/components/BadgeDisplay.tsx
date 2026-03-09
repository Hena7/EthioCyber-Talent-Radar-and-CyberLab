import React from 'react';
import { Badge } from '@/types';

interface BadgeDisplayProps {
  badges: Badge[];
  compact?: boolean;
}

export default function BadgeDisplay({ badges, compact = false }: BadgeDisplayProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No badges earned yet. Complete challenges to earn badges!</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap ${compact ? 'gap-2' : 'gap-3'}`}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`group relative ${
            compact ? 'w-10 h-10' : 'w-16 h-16'
          } bg-gray-800/80 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 flex items-center justify-center cursor-default transition-all hover:shadow-lg hover:shadow-cyan-500/10`}
          title={`${badge.name}: ${badge.description}`}
        >
          <span className={compact ? 'text-lg' : 'text-2xl'}>{badge.icon}</span>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
              <p className="text-xs font-semibold text-cyan-400">{badge.name}</p>
              <p className="text-xs text-gray-400">{badge.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
