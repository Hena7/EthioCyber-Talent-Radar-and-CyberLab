"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function LandingPage() {
  const { users, challenges, currentUser } = useApp();

  return (
    <div className="relative">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-8">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              Discovering Ethiopia&apos;s Cyber Talent
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              EthioCyber{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Radar Lab
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              A platform that identifies and ranks Ethiopian youth with
              cybersecurity talent, while providing interactive challenges to
              build practical cyber defense skills.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {currentUser ? (
                <>
                  <Link
                    href="/cyberlab"
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all text-center"
                  >
                    Start Challenges
                  </Link>
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto px-8 py-3.5 bg-gray-800 text-gray-200 font-semibold rounded-xl border border-gray-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-center"
                  >
                    My Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-semibold rounded-xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all text-center"
                  >
                    Join Now
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="w-full sm:w-auto px-8 py-3.5 bg-gray-800 text-gray-200 font-semibold rounded-xl border border-gray-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-center"
                  >
                    View Leaderboard
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {users.length}
                </p>
                <p className="text-sm text-gray-500">Registered Talents</p>
              </div>
              <div className="w-px h-12 bg-gray-700" />
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {challenges.length}
                </p>
                <p className="text-sm text-gray-500">Challenges</p>
              </div>
              <div className="w-px h-12 bg-gray-700" />
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">5</p>
                <p className="text-sm text-gray-500">Skill Categories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Two Powerful Platforms,{" "}
              <span className="text-gradient-cyber">One Mission</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Combining talent discovery with hands-on cybersecurity training
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-cyan-500/30 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-shadow">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                EthioCyber Talent Radar
              </h3>
              <p className="text-gray-400 mb-4">
                Identifies and ranks Ethiopian youth (ages 20-30) with
                cybersecurity and programming talent through a competitive
                leaderboard system.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  Talent ranking leaderboard
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  Skill-based scoring
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  Achievement badges
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-green-500/30 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-green-500/20 transition-shadow">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                CyberLab Ethiopia
              </h3>
              <p className="text-gray-400 mb-4">
                Interactive cybersecurity learning platform with hands-on
                challenges covering phishing, cryptography, web security, and
                more.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Interactive challenges
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Multiple difficulty levels
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Points & rewards system
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Skill Categories
            </h2>
            <p className="text-gray-400">
              Master diverse cybersecurity domains
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "Web Security", icon: "\u{1F310}" },
              { name: "Cryptography", icon: "\u{1F510}" },
              { name: "Networking", icon: "\u{1F4E1}" },
              { name: "Phishing Detection", icon: "\u{1F3A3}" },
              { name: "Password Security", icon: "\u{1F511}" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href="/cyberlab"
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 text-center hover:border-cyan-500/30 transition-all group"
              >
                <span className="text-3xl block mb-3">{cat.icon}</span>
                <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Prove Your Skills?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join Ethiopian youth who are building the future of cybersecurity.
            Register now and start your journey to becoming a top cyber talent.
          </p>
          <Link
            href={currentUser ? "/cyberlab" : "/profile"}
            className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all"
          >
            {currentUser ? "Go to CyberLab" : "Get Started Now"}
          </Link>
        </div>
      </section>
    </div>
  );
}
