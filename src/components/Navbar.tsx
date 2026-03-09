'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const { currentUser, role, setRole, logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center text-gray-900 font-bold text-sm group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
              EC
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent hidden sm:block">
              EthioCyber Radar Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-500/10"
            >
              Home
            </Link>
            {currentUser && (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-500/10"
                >
                  Dashboard
                </Link>
                <Link
                  href="/cyberlab"
                  className="px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-500/10"
                >
                  CyberLab
                </Link>
              </>
            )}
            <Link
              href="/leaderboard"
              className="px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-500/10"
            >
              Leaderboard
            </Link>
            {role === 'admin' && (
              <>
                <Link
                  href="/admin"
                  className="px-3 py-2 text-sm text-gray-300 hover:text-orange-400 transition-colors rounded-lg hover:bg-orange-500/10"
                >
                  Admin
                </Link>
                <Link
                  href="/analytics"
                  className="px-3 py-2 text-sm text-gray-300 hover:text-orange-400 transition-colors rounded-lg hover:bg-orange-500/10"
                >
                  Analytics
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Role Toggle */}
            <div className="hidden sm:flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setRole('user')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  role === 'user'
                    ? 'bg-cyan-500 text-gray-900'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                User
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  role === 'admin'
                    ? 'bg-orange-500 text-gray-900'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Admin
              </button>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center text-xs font-bold text-gray-900">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{currentUser.username}</span>
                </Link>
                <button
                  onClick={logoutUser}
                  className="px-3 py-1.5 text-xs bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-gray-700 hover:border-red-500/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/profile"
                className="px-4 py-1.5 text-sm bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                Get Started
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-800">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 rounded-lg hover:bg-cyan-500/10"
              >
                Home
              </Link>
              {currentUser && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 rounded-lg hover:bg-cyan-500/10"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/cyberlab"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 rounded-lg hover:bg-cyan-500/10"
                  >
                    CyberLab
                  </Link>
                </>
              )}
              <Link
                href="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 rounded-lg hover:bg-cyan-500/10"
              >
                Leaderboard
              </Link>
              {role === 'admin' && (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm text-gray-300 hover:text-orange-400 rounded-lg hover:bg-orange-500/10"
                  >
                    Admin
                  </Link>
                  <Link
                    href="/analytics"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm text-gray-300 hover:text-orange-400 rounded-lg hover:bg-orange-500/10"
                  >
                    Analytics
                  </Link>
                </>
              )}
              {/* Mobile Role Toggle */}
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="text-xs text-gray-500">Role:</span>
                <button
                  onClick={() => setRole(role === 'user' ? 'admin' : 'user')}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    role === 'admin' ? 'bg-orange-500 text-gray-900' : 'bg-cyan-500 text-gray-900'
                  }`}
                >
                  {role === 'admin' ? 'Admin' : 'User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
