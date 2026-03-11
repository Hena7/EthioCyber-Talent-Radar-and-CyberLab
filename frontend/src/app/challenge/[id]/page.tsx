"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

const difficultyColors: Record<string, string> = {
  Easy: "text-green-400 bg-green-500/10 border-green-500/30",
  Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  Hard: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const { challenges, currentUser, completeChallenge } = useApp();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "already";
    message: string;
  } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const challenge = challenges.find((c) => c.id === params.id);

  if (!challenge) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Challenge Not Found
        </h1>
        <p className="text-gray-400 mb-6">
          This challenge does not exist or has been removed.
        </p>
        <Link
          href="/cyberlab"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-lg"
        >
          Back to CyberLab
        </Link>
      </div>
    );
  }

  const isCompleted = currentUser?.completedChallenges.includes(challenge.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setFeedback({
        type: "error",
        message: "Please log in to submit answers.",
      });
      return;
    }

    if (isCompleted) {
      setFeedback({
        type: "already",
        message: "You have already completed this challenge!",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await completeChallenge(challenge.id, answer.trim());
      if (result.correct) {
        setFeedback({
          type: "success",
          message: `Correct! You earned ${challenge.points} points!`,
        });
      } else {
        setFeedback({
          type: "error",
          message: result.message || "Incorrect answer. Try again!",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to submit answer. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNextHint = () => {
    if (challenge.hints && hintIndex < challenge.hints.length) {
      setShowHint(true);
      setHintIndex((prev) => Math.min(prev + 1, challenge.hints!.length));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/cyberlab" className="hover:text-cyan-400 transition-colors">
          CyberLab
        </Link>
        <span>/</span>
        <span className="text-gray-300">{challenge.title}</span>
      </div>

      {/* Challenge Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {challenge.title}
            </h1>
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-0.5 text-xs font-medium border rounded-full ${difficultyColors[challenge.difficulty]}`}
              >
                {challenge.difficulty}
              </span>
              <span className="text-sm text-gray-500">{challenge.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-cyan-400">
              {challenge.points}
            </span>
            <span className="text-sm text-gray-500">points</span>
          </div>
        </div>

        <p className="text-gray-400 leading-relaxed">{challenge.description}</p>

        {isCompleted && (
          <div className="mt-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg inline-flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-green-400 font-medium">
              Challenge Completed
            </span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Challenge Question</h2>
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/30">
          <p className="text-gray-200 leading-relaxed">{challenge.question}</p>
        </div>

        {/* Hints */}
        {challenge.hints && challenge.hints.length > 0 && (
          <div className="mt-4">
            {showHint && (
              <div className="space-y-2 mb-3">
                {challenge.hints.slice(0, hintIndex).map((hint, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                  >
                    <p className="text-sm text-yellow-400">
                      <span className="font-medium">Hint {i + 1}:</span> {hint}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {hintIndex < challenge.hints.length && (
              <button
                onClick={showNextHint}
                className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {showHint ? "Show next hint" : "Need a hint?"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Answer Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
        <h2 className="text-lg font-semibold text-white mb-4">Your Answer</h2>

        {!currentUser ? (
          <div className="text-center py-6">
            <p className="text-gray-400 mb-4">
              Please log in to submit your answer.
            </p>
            <Link
              href="/profile"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-lg"
            >
              Log In / Register
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isCompleted}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {feedback && (
              <div
                className={`px-4 py-3 rounded-lg border ${
                  feedback.type === "success"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : feedback.type === "already"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                <p className="text-sm font-medium">{feedback.message}</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isCompleted || isSubmitting || !answer.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isCompleted ? "Completed" : isSubmitting ? "Submitting..." : "Submit Answer"}
              </button>

              {feedback?.type === "success" && (
                <button
                  type="button"
                  onClick={() => router.push("/cyberlab")}
                  className="px-6 py-2.5 bg-gray-700 text-gray-200 font-medium rounded-lg hover:bg-gray-600 transition-all"
                >
                  Next Challenge
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
