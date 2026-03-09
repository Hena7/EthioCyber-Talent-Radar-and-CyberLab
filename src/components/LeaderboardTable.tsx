'use client';

import React from 'react';
import { User } from '@/types';

interface LeaderboardTableProps {
  users: User[];
  highlightUserId?: string;
  limit?: number;
}

export default function LeaderboardTable({ users, highlightUserId, limit }: LeaderboardTableProps) {
  const displayUsers = limit ? users.slice(0, limit) : users;

  if (displayUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🏆</div>
        <p className="text-gray-400">No users on the leaderboard yet.</p>
        <p className="text-sm text-gray-500">Complete challenges to appear here!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Rank
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              User
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
              University
            </th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Challenges
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {displayUsers.map((user, index) => {
            const rank = index + 1;
            const isHighlighted = user.id === highlightUserId;
            const isTop3 = rank <= 3;

            return (
              <tr
                key={user.id}
                className={`border-b border-gray-800/50 transition-colors ${
                  isHighlighted
                    ? 'bg-cyan-500/10 border-cyan-500/20'
                    : 'hover:bg-gray-800/30'
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    {rank === 1 && <span className="text-xl">🥇</span>}
                    {rank === 2 && <span className="text-xl">🥈</span>}
                    {rank === 3 && <span className="text-xl">🥉</span>}
                    {rank > 3 && (
                      <span className={`text-sm font-bold ${isTop3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                        #{rank}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isTop3
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-900'
                          : 'bg-gradient-to-br from-cyan-500 to-green-500 text-gray-900'
                      }`}
                    >
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isHighlighted ? 'text-cyan-400' : 'text-gray-200'}`}>
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 hidden sm:table-cell">
                  <span className="text-sm text-gray-400">{user.university}</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-sm text-gray-300">{user.completedChallenges.length}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span
                    className={`text-sm font-bold ${
                      isTop3
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'
                        : 'text-cyan-400'
                    }`}
                  >
                    {user.points.toLocaleString()}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
