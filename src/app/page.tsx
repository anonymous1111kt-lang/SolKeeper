'use client';

import { useState } from 'react';
import { RiskDashboard } from '@/components/RiskDashboard';
import { Search, Loader2, ShieldAlert } from 'lucide-react';

export default function Home() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [riskData, setRiskData] = useState(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    setError('');
    setRiskData(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze token');
      }

      const data = await response.json();
      setRiskData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto pt-16 md:pt-24 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-xl">
              <ShieldAlert className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Solana <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Risk Analyzer</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Instantly audit any Solana smart contract. Detect honeypots, unlocked liquidity, and malicious code before you invest.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex flex-col md:flex-row items-center bg-gray-900/80 border border-gray-700 backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
              <div className="hidden md:block pl-4 pr-2 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Solana token address (e.g. DezX...)"
                className="w-full md:flex-1 bg-transparent border-none p-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                disabled={loading || !address}
                className="w-full md:w-auto mt-2 md:mt-0 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning
                  </>
                ) : (
                  'Analyze Token'
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-xl flex items-center justify-center backdrop-blur-sm animate-pulse">
            {error}
          </div>
        )}

        <div className="transition-all duration-500 ease-in-out">
          <RiskDashboard data={riskData} />
        </div>
      </div>
    </main>
  );
}
