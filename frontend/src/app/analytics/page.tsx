"use client";

import React, { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import StatsCard from "@/components/StatsCard";

export default function AnalyticsPage() {
  const { role, users, challenges, userProgress } = useApp();

  const analytics = useMemo(() => {
    const totalUsers = users.length;
    const totalChallenges = challenges.length;
    const totalCompletions = userProgress.length;
    const totalPoints = users.reduce((sum, u) => sum + u.points, 0);

    // Category stats
    const categoryStats: Record<string, { total: number; completions: number }> = {};
    for (const challenge of challenges) {
      if (!categoryStats[challenge.category]) {
        categoryStats[challenge.category] = { total: 0, completions: 0 };
      }
      categoryStats[challenge.category].total++;
    }
    for (const progress of userProgress) {
      const challenge = challenges.find((c) => c.id === progress.challengeId);
      if (challenge && categoryStats[challenge.category]) {
        categoryStats[challenge.category].completions++;
      }
    }

    // Difficulty stats
    const difficultyStats: Record<string, { total: number; completions: number }> = {
      Easy: { total: 0, completions: 0 },
      Medium: { total: 0, completions: 0 },
      Hard: { total: 0, completions: 0 },
    };
    for (const challenge of challenges) {
      difficultyStats[challenge.difficulty].total++;
    }
    for (const progress of userProgress) {
      const challenge = challenges.find((c) => c.id === progress.challengeId);
      if (challenge) {
        difficultyStats[challenge.difficulty].completions++;
      }
    }

    // Skill distribution
    const skillCounts: Record<string, number> = {};
    for (const user of users) {
      for (const skill of user.skills) {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      }
    }
    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    // Top performers
    const topPerformers = [...users].sort((a, b) => b.points - a.points).slice(0, 5);

    // Average stats
    const avgPoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;
    const avgChallenges =
      totalUsers > 0
        ? Math.round(
            users.reduce((sum, u) => sum + u.completedChallenges.length, 0) / totalUsers
          )
        : 0;

    return {
      totalUsers,
      totalChallenges,
      totalCompletions,
      totalPoints,
      categoryStats,
      difficultyStats,
      topSkills,
      topPerformers,
      avgPoints,
      avgChallenges,
    };
  }, [users, challenges, userProgress]);

  if (role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400">
          You need admin privileges to access analytics. Toggle the role selector in the navbar.
        </p>
      </div>
    );
  }

  const maxSkillCount = analytics.topSkills.length > 0 ? analytics.topSkills[0][1] : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Talent Analytics Dashboard</h1>
        <p className="text-gray-400">Overview of platform performance and talent metrics</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Users"
          value={analytics.totalUsers}
          gradient="from-cyan-500 to-blue-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Challenges"
          value={analytics.totalChallenges}
          gradient="from-green-500 to-emerald-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatsCard
          title="Total Completions"
          value={analytics.totalCompletions}
          gradient="from-purple-500 to-pink-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Avg Points/User"
          value={analytics.avgPoints}
          gradient="from-yellow-500 to-orange-500"
          subtitle={`${analytics.avgChallenges} avg challenges`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Performance */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Category Performance</h2>
          <div className="space-y-4">
            {Object.entries(analytics.categoryStats).map(([category, stats]) => {
              const maxCompletions = Math.max(
                ...Object.values(analytics.categoryStats).map((s) => s.completions),
                1
              );
              const percentage = Math.round((stats.completions / maxCompletions) * 100);
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{category}</span>
                    <span className="text-sm text-gray-500">
                      {stats.completions} completions ({stats.total} challenges)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Difficulty Distribution</h2>
          <div className="space-y-6">
            {Object.entries(analytics.difficultyStats).map(([difficulty, stats]) => {
              const colors: Record<string, string> = {
                Easy: "from-green-500 to-emerald-500",
                Medium: "from-yellow-500 to-amber-500",
                Hard: "from-red-500 to-rose-500",
              };
              return (
                <div key={difficulty} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium text-gray-300">{difficulty}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-700/50 rounded-full h-6 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${colors[difficulty]} flex items-center justify-end pr-2 transition-all duration-500`}
                          style={{
                            width: `${stats.total > 0 ? Math.max((stats.completions / (stats.total * users.length || 1)) * 100, 5) : 5}%`,
                          }}
                        >
                          <span className="text-xs font-medium text-white/80">{stats.completions}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 w-24 text-right">
                        {stats.total} challenges
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Skills Among Users</h2>
          {analytics.topSkills.length > 0 ? (
            <div className="space-y-3">
              {analytics.topSkills.map(([skill, count]) => (
                <div key={skill} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{skill}</span>
                      <span className="text-sm text-gray-500">{count} users</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${(count / maxSkillCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No user data available yet.</p>
          )}
        </div>

        {/* Top Performers */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Leaderboard Summary</h2>
          {analytics.topPerformers.length > 0 ? (
            <div className="space-y-3">
              {analytics.topPerformers.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700/30"
                >
                  <span className="text-lg w-8 text-center">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center text-xs font-bold text-gray-900">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.university}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-cyan-400">{user.points}</p>
                    <p className="text-xs text-gray-500">{user.completedChallenges.length} challenges</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No user data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
