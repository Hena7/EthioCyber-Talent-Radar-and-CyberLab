import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient?: string;
  subtitle?: string;
}

export default function StatsCard({ title, value, icon, gradient = 'from-cyan-500 to-blue-500', subtitle }: StatsCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-cyan-500/30 transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20 flex items-center justify-center text-white opacity-80 group-hover:opacity-100 transition-opacity`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
