'use client';

import React from 'react';
import Link from 'next/link';
import { Challenge } from '@/types';

interface ChallengeCardProps {
  challenge: Challenge;
  isCompleted?: boolean;
}

const difficultyColors = {
  Easy: 'text-green-400 bg-green-500/10 border-green-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/30',
};

const categoryIcons: Record<string, string> = {
  'Web Security': '🌐',
  Cryptography: '🔐',
  Networking: '📡',
  'Phishing Detection': '🎣',
  'Password Security': '🔑',
};

export default function ChallengeCard({ challenge, isCompleted = false }: ChallengeCardProps) {
  return (
    <Link href={`/challenge/${challenge.id}`}>
      <div
        className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border p-6 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden ${
          isCompleted
            ? 'border-green-500/30 hover:border-green-500/50 hover:shadow-green-500/10'
            : 'border-gray-700/50 hover:border-cyan-500/30 hover:shadow-cyan-500/10'
        }`}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">{categoryIcons[challenge.category] || '🛡️'}</span>
            {isCompleted && (
              <span className="px-2 py-1 text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/30 rounded-full">
                Completed
              </span>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-cyan-400 transition-colors">
            {challenge.title}
          </h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{challenge.description}</p>

          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-xs font-medium border rounded-full ${difficultyColors[challenge.difficulty]}`}
              >
                {challenge.difficulty}
              </span>
              <span className="text-xs text-gray-500">{challenge.category}</span>
            </div>
            <span className="text-sm font-semibold text-cyan-400">{challenge.points} pts</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
