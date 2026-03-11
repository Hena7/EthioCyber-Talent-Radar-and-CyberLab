"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import ChallengeCard from "@/components/ChallengeCard";
import { ChallengeCategory } from "@/types";

const categories: (ChallengeCategory | "All")[] = [
  "All",
  "Web Security",
  "Cryptography",
  "Networking",
  "Phishing Detection",
  "Password Security",
];

const difficulties = ["All", "Easy", "Medium", "Hard"] as const;

export default function CyberLabPage() {
  const { challenges, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "points-asc" | "points-desc" | "difficulty">("default");

  const filteredChallenges = useMemo(() => {
    let filtered = challenges;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (selectedDifficulty !== "All") {
      filtered = filtered.filter((c) => c.difficulty === selectedDifficulty);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      );
    }

    if (sortBy === "points-asc") {
      filtered = [...filtered].sort((a, b) => a.points - b.points);
    } else if (sortBy === "points-desc") {
      filtered = [...filtered].sort((a, b) => b.points - a.points);
    } else if (sortBy === "difficulty") {
      const order = { Easy: 1, Medium: 2, Hard: 3 };
      filtered = [...filtered].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }

    return filtered;
  }, [challenges, selectedCategory, selectedDifficulty, searchQuery, sortBy]);

  const completedCount = currentUser
    ? challenges.filter((c) => currentUser.completedChallenges.includes(c.id)).length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">CyberLab Ethiopia</h1>
        <p className="text-gray-400">
          Interactive cybersecurity challenges to build your skills.
          {currentUser && (
            <span className="text-cyan-400 ml-2">
              {completedCount}/{challenges.length} completed
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
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
            placeholder="Search challenges..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                    : "bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty & Sort */}
          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All Levels" : d}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="default">Default Order</option>
              <option value="points-asc">Points: Low to High</option>
              <option value="points-desc">Points: High to Low</option>
              <option value="difficulty">By Difficulty</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredChallenges.length} of {challenges.length} challenges
      </p>

      {/* Challenge Grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isCompleted={currentUser?.completedChallenges.includes(challenge.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No challenges match your filters.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedDifficulty("All");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
