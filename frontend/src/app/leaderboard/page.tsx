"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import LeaderboardTable from "@/components/LeaderboardTable";

type SortField = "points" | "challenges" | "name";
type SortOrder = "asc" | "desc";

export default function LeaderboardPage() {
  const { getLeaderboard, currentUser } = useApp();
  const [sortField, setSortField] = useState<SortField>("points");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchQuery, setSearchQuery] = useState("");

  const leaderboard = getLeaderboard();

  const filteredAndSorted = useMemo(() => {
    let users = [...leaderboard];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      users = users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(query) ||
          u.username.toLowerCase().includes(query) ||
          u.university.toLowerCase().includes(query)
      );
    }

    users.sort((a, b) => {
      let comparison = 0;
      if (sortField === "points") {
        comparison = a.points - b.points;
      } else if (sortField === "challenges") {
        comparison = a.completedChallenges.length - b.completedChallenges.length;
      } else if (sortField === "name") {
        comparison = a.fullName.localeCompare(b.fullName);
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    return users;
  }, [leaderboard, sortField, sortOrder, searchQuery]);

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Talent Radar Leaderboard
        </h1>
        <p className="text-gray-400">
          Top cybersecurity talents in Ethiopia ranked by performance
        </p>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-12">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-xl font-bold text-gray-900 mb-2">
              {top3[1].fullName.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-medium text-gray-300">{top3[1].fullName}</p>
            <p className="text-xs text-gray-500">@{top3[1].username}</p>
            <div className="mt-2 bg-gray-700/50 rounded-t-lg px-6 py-8 flex flex-col items-center">
              <span className="text-2xl mb-1">🥈</span>
              <span className="text-lg font-bold text-gray-300">{top3[1].points}</span>
              <span className="text-xs text-gray-500">points</span>
            </div>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-gray-900 mb-2 shadow-lg shadow-yellow-500/20">
              {top3[0].fullName.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-medium text-white">{top3[0].fullName}</p>
            <p className="text-xs text-gray-400">@{top3[0].username}</p>
            <div className="mt-2 bg-gradient-to-b from-yellow-500/20 to-gray-700/50 rounded-t-lg px-8 py-12 flex flex-col items-center border border-yellow-500/20">
              <span className="text-3xl mb-1">🥇</span>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {top3[0].points}
              </span>
              <span className="text-xs text-gray-500">points</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-xl font-bold text-gray-900 mb-2">
              {top3[2].fullName.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-medium text-gray-300">{top3[2].fullName}</p>
            <p className="text-xs text-gray-500">@{top3[2].username}</p>
            <div className="mt-2 bg-gray-700/50 rounded-t-lg px-6 py-6 flex flex-col items-center">
              <span className="text-2xl mb-1">🥉</span>
              <span className="text-lg font-bold text-orange-400">{top3[2].points}</span>
              <span className="text-xs text-gray-500">points</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or university..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-3 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="points">Sort by Points</option>
              <option value="challenges">Sort by Challenges</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="px-3 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all text-sm"
              title={sortOrder === "desc" ? "Descending" : "Ascending"}
            >
              {sortOrder === "desc" ? "↓" : "↑"}
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white">
            Full Rankings
            <span className="text-sm text-gray-500 ml-2">
              (Top 10 highlighted)
            </span>
          </h2>
        </div>
        <LeaderboardTable
          users={filteredAndSorted}
          highlightUserId={currentUser?.id}
        />
      </div>
    </div>
  );
}
