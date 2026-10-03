import React from 'react';
import { MetricCard } from './MetricCard';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { AIChat } from './AIChat';

interface RiskData {
  tokenName: string;
  tokenSymbol: string;
  overallScore: string;
  metrics: {
    liquidityLocked: boolean;
    mintAuthority: boolean;
    freezeAuthority: boolean;
    top10HoldersPercent: number;
    isToken2022: boolean;
    hasDangerousExtensions: boolean;
  };
}

export function RiskDashboard({ data }: { data: RiskData | null }) {
  if (!data) return null;

  const isHighRisk = data.metrics.mintAuthority || data.metrics.freezeAuthority || !data.metrics.liquidityLocked || data.metrics.top10HoldersPercent > 50 || data.metrics.hasDangerousExtensions;

  return (
    <div className="w-full mx-auto space-y-6">
      <div className={`p-6 md:p-10 rounded-3xl backdrop-blur-xl border ${isHighRisk ? 'bg-red-900/10 border-red-500/30 shadow-[0_0_50px_-12px_rgba(239,68,68,0.15)]' : 'bg-green-900/10 border-green-500/30 shadow-[0_0_50px_-12px_rgba(34,197,94,0.15)]'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-gray-800/50">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-4 mb-2">
              {data.tokenName} 
              <span className="text-xl px-3 py-1 bg-gray-800/80 rounded-lg text-gray-300 font-medium border border-gray-700">
                ${data.tokenSymbol}
              </span>
            </h2>
            <p className="text-gray-400">
              Real-time On-chain Security Report
            </p>
          </div>
          
          <div className={`mt-6 md:mt-0 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold text-lg md:text-xl border shadow-lg ${isHighRisk ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
            {isHighRisk ? <ShieldAlert className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
            {isHighRisk ? 'HIGH RISK DETECTED' : 'SECURE / LOW RISK'}
          </div>
        </div>

        {/* Changed to grid-cols-1 md:grid-cols-2 lg:grid-cols-3 to accommodate 5 cards beautifully */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard 
            title="Token-2022 Extensions" 
            value={data.metrics.hasDangerousExtensions ? "Tax/Fee Detected" : (data.metrics.isToken2022 ? "Active (Safe)" : "None (Standard)")} 
            status={data.metrics.hasDangerousExtensions ? 'danger' : (data.metrics.isToken2022 ? 'info' : 'safe')}
            description={data.metrics.isToken2022 ? (data.metrics.hasDangerousExtensions ? "Malicious extensions detected (e.g., hidden transfer fees)." : "Uses Token-2022, but no malicious extensions found.") : "Standard SPL token, no extensions used."}
          />
          <MetricCard 
            title="Liquidity Status" 
            value={data.metrics.liquidityLocked ? "Locked" : "Unlocked"} 
            status={data.metrics.liquidityLocked ? 'safe' : 'danger'}
            description={data.metrics.liquidityLocked ? "Liquidity is locked (Safer)." : "Liquidity is NOT locked (Rug pull risk!)."}
          />
          <MetricCard 
            title="Mint Authority" 
            value={data.metrics.mintAuthority ? "Active" : "Revoked"} 
            status={data.metrics.mintAuthority ? 'danger' : 'safe'}
            description={data.metrics.mintAuthority ? "Creator can mint infinite tokens (Scam risk)." : "No new tokens can be minted."}
          />
          <MetricCard 
            title="Freeze Authority" 
            value={data.metrics.freezeAuthority ? "Active" : "Revoked"} 
            status={data.metrics.freezeAuthority ? 'danger' : 'safe'}
            description={data.metrics.freezeAuthority ? "Creator can freeze your funds (Honeypot risk)." : "Token trading cannot be frozen."}
          />
          <div className="md:col-span-2">
            <MetricCard 
              title="Top 10 Holders" 
              value={`${data.metrics.top10HoldersPercent}%`} 
              status={data.metrics.top10HoldersPercent > 50 ? 'danger' : data.metrics.top10HoldersPercent > 30 ? 'warning' : 'safe'}
              description="Percentage of total supply held by the top 10 wallets. High concentration means a higher risk of price manipulation."
            />
          </div>
        </div>
        
        {/* AI Chat Integration */}
        <AIChat tokenData={data} />
      </div>
    </div>
  );
}
