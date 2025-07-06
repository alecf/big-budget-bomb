import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Big Budget Bomb
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore how this bill really affects you&mdash;and everyone else. 
            Discover the hidden wealth transfers from the poor to the rich, 
            and from the young to the old.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/salt" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try the SALT Calculator
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🧮</div>
            <h3 className="text-xl font-semibold text-white mb-3">SALT Calculator</h3>
            <p className="text-gray-300">
              See exactly who benefits from the higher SALT deduction cap and how much it costs everyone else.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-3">Impact Analysis</h3>
            <p className="text-gray-300">
              Understand the real-world consequences of policy changes on different income groups and age demographics.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-3">Privacy First</h3>
            <p className="text-gray-300">
              No data collection, no tracking, no logs. Your privacy is completely protected.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-8 border border-red-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to see the real impact?
          </h2>
          <p className="text-gray-300 mb-6">
            Start with our SALT deduction calculator to understand how this bill creates winners and losers.
          </p>
          <Link 
            href="/salt"
            className="inline-block bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Launch Calculator →
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400 text-sm">
          <p>
            This site stores no data about you and doesn&apos;t track you in any way. 
            Not even logs are retained.
          </p>
        </div>
      </div>
    </div>
  );
}
