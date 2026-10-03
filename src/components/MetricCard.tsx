import React from 'react';
import { AlertTriangle, ShieldCheck, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  status: 'safe' | 'warning' | 'danger' | 'info';
  description: string;
}

export function MetricCard({ title, value, status, description }: MetricCardProps) {
  const statusConfig = {
    safe: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: ShieldCheck,
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.15)]'
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      icon: AlertTriangle,
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.15)]'
    },
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      icon: AlertTriangle,
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.15)]'
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: Info,
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`group p-6 rounded-2xl border bg-gray-900/40 backdrop-blur-sm transition-all duration-300 ${config.border} ${config.glow}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-300">{title}</h3>
        <div className={`p-2 rounded-xl ${config.bg} ${config.text}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className={`text-4xl font-bold mb-3 ${config.text}`}>{value}</p>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
