import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900/80 border-t border-cyan-500/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center text-gray-900 font-bold text-sm">
                EC
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                EthioCyber Radar Lab
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Discovering and nurturing cybersecurity talent in Ethiopia. Building the next generation of cyber defenders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/cyberlab" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                CyberLab Challenges
              </Link>
              <Link href="/leaderboard" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                Talent Radar
              </Link>
              <Link href="/profile" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                Join Now
              </Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3">About</h3>
            <p className="text-sm text-gray-400">
              EthioCyber Radar Lab is a platform dedicated to identifying and developing cybersecurity talent among Ethiopian youth aged 20-30.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} EthioCyber Radar Lab. Built for Ethiopian cybersecurity talent.
          </p>
        </div>
      </div>
    </footer>
  );
}
