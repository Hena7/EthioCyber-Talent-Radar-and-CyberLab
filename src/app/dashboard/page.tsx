"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import StatsCard from "@/components/StatsCard";
import BadgeDisplay from "@/components/BadgeDisplay";
import ProgressBar from "@/components/ProgressBar";

export default function DashboardPage() {
  const { currentUser, challenges, getUserRank } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Please Log In
        </h1>
        <p className="text-gray-400 mb-6">
          You need to create a profile or log in to view your dashboard.
        </p>
        <Link
          href="/profile"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          Go to Profile
        </Link>
      </div>
    );
  }

  const rank = getUserRank(currentUser.id);
  const totalChallenges = challenges.length;
  const completedCount = currentUser.completedChallenges.length;
  const totalPossiblePoints = challenges.reduce((sum, c) => sum + c.points, 0);

  const categoryCounts: Record<string, { total: number; completed: number }> = {};
  for (const challenge of challenges) {
    if (!categoryCounts[challenge.category]) {
      categoryCounts[challenge.category] = { total: 0, completed: 0 };
    }
    categoryCounts[challenge.category].total++;
    if (currentUser.completedChallenges.includes(challenge.id)) {
      categoryCounts[challenge.category].completed++;
    }
  }

  const recentChallenges = challenges
    .filter((c) => currentUser.completedChallenges.includes(c.id))
    .slice(-5)
    .reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center text-2xl font-bold text-gray-900">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {currentUser.fullName}
            </h1>
            <p className="text-gray-400">@{currentUser.username}</p>
          </div>
        </div>
        <Link
          href="/cyberlab"
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          Start Challenges
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Points"
          value={currentUser.points.toLocaleString()}
          gradient="from-cyan-500 to-blue-500"
          subtitle={`of ${totalPossiblePoints.toLocaleString()} possible`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <StatsCard
          title="Rank"
          value={rank > 0 ? `#${rank}` : "N/A"}
          gradient="from-yellow-500 to-orange-500"
          subtitle="on leaderboard"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
        <StatsCard
          title="Challenges"
          value={`${completedCount}/${totalChallenges}`}
          gradient="from-green-500 to-emerald-500"
          subtitle="completed"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <StatsCard
          title="Badges"
          value={currentUser.badges.length}
          gradient="from-purple-500 to-pink-500"
          subtitle="earned"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overall Progress */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Overall Progress
            </h2>
            <ProgressBar
              current={completedCount}
              total={totalChallenges}
              label="Challenges Completed"
            />
          </div>

          {/* Category Progress */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Category Progress
            </h2>
            <div className="space-y-4">
              {Object.entries(categoryCounts).map(([category, counts]) => (
                <ProgressBar
                  key={category}
                  current={counts.completed}
                  total={counts.total}
                  label={category}
                  gradient={
                    category === "Web Security"
                      ? "from-blue-500 to-cyan-500"
                      : category === "Cryptography"
                      ? "from-purple-500 to-pink-500"
                      : category === "Networking"
                      ? "from-green-500 to-emerald-500"
                      : category === "Phishing Detection"
                      ? "from-orange-500 to-red-500"
                      : "from-yellow-500 to-amber-500"
                  }
                />
              ))}
            </div>
          </div>

          {/* Recent Completions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recently Completed
            </h2>
            {recentChallenges.length > 0 ? (
              <div className="space-y-3">
                {recentChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {challenge.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {challenge.category}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-cyan-400">
                      +{challenge.points} pts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No challenges completed yet. Head to the{" "}
                <Link href="/cyberlab" className="text-cyan-400 hover:underline">
                  CyberLab
                </Link>{" "}
                to get started!
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Profile Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-300">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Age</p>
                <p className="text-sm text-gray-300">{currentUser.age}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">University</p>
                <p className="text-sm text-gray-300">
                  {currentUser.university}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Skills</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {currentUser.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm text-gray-300">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Badges
            </h2>
            <BadgeDisplay badges={currentUser.badges} />
          </div>
        </div>
      </div>
    </div>
  );
}
