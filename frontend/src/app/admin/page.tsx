"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Challenge, ChallengeCategory } from "@/types";

const categoryOptions: ChallengeCategory[] = [
  "Web Security",
  "Cryptography",
  "Networking",
  "Phishing Detection",
  "Password Security",
];

const difficultyOptions = ["Easy", "Medium", "Hard"] as const;

interface ChallengeForm {
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  question: string;
  answer: string;
}

const emptyForm: ChallengeForm = {
  title: "",
  description: "",
  category: "Web Security",
  difficulty: "Easy",
  points: 100,
  question: "",
  answer: "",
};

export default function AdminPage() {
  const {
    role,
    challenges,
    users,
    addChallenge,
    updateChallenge,
    deleteChallenge,
    resetLeaderboard,
  } = useApp();
  const [activeTab, setActiveTab] = useState<"challenges" | "users">("challenges");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ChallengeForm>(emptyForm);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  if (role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You need admin privileges to access this page. Toggle the role selector in the navbar.
        </p>
      </div>
    );
  }

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateChallenge(editingId, form);
        showSuccess("Challenge updated successfully!");
      } else {
        await addChallenge(form);
        showSuccess("Challenge created successfully!");
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed";
      showSuccess(message);
    }
  };

  const handleEdit = (challenge: Challenge) => {
    setForm({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: challenge.difficulty,
      points: challenge.points,
      question: challenge.question,
      answer: challenge.answer || "",
    });
    setEditingId(challenge.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChallenge(id);
      setShowDeleteConfirm(null);
      showSuccess("Challenge deleted successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed";
      showSuccess(message);
    }
  };

  const handleReset = async () => {
    try {
      await resetLeaderboard();
      setShowResetConfirm(false);
      showSuccess("Leaderboard reset successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Reset failed";
      showSuccess(message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-gray-400">Manage challenges, users, and leaderboard</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm"
          >
            + New Challenge
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all text-sm"
          >
            Reset Leaderboard
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("challenges")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "challenges"
              ? "bg-cyan-500 text-gray-900"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Challenges ({challenges.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "users"
              ? "bg-cyan-500 text-gray-900"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Users ({users.length})
        </button>
      </div>

      {/* Challenge Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? "Edit Challenge" : "Create New Challenge"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as ChallengeCategory }))}
                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 text-sm"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value as "Easy" | "Medium" | "Hard" }))}
                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 text-sm"
                  >
                    {difficultyOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Points</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.points}
                    onChange={(e) => setForm((prev) => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Question</label>
                <textarea
                  required
                  rows={3}
                  value={form.question}
                  onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Answer</label>
                <input
                  type="text"
                  required
                  value={form.answer}
                  onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="px-6 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-2">Reset Leaderboard?</h2>
            <p className="text-gray-400 mb-6 text-sm">
              This will reset all user points, completed challenges, and badges. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-6 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-2">Delete Challenge?</h2>
            <p className="text-gray-400 mb-6 text-sm">
              This challenge will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-6 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-6 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === "challenges" ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Title</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Difficulty</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Points</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((challenge) => (
                  <tr key={challenge.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-200">{challenge.title}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-gray-400">{challenge.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium border rounded-full ${
                          challenge.difficulty === "Easy"
                            ? "text-green-400 bg-green-500/10 border-green-500/30"
                            : challenge.difficulty === "Medium"
                            ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
                            : "text-red-400 bg-red-500/10 border-red-500/30"
                        }`}
                      >
                        {challenge.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-cyan-400 font-medium">{challenge.points}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(challenge)}
                          className="px-3 py-1 text-xs text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(challenge.id)}
                          className="px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden sm:table-cell">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">University</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Points</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Challenges</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No users registered yet.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center text-xs font-bold text-gray-900">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm text-gray-200">{user.fullName}</p>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-400">{user.email}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-gray-400">{user.university}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-cyan-400 font-medium">{user.points}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-gray-300">{user.completedChallenges.length}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
