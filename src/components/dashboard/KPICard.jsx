import React from 'react';

export default function KPICard({ title, value, subtext, icon: Icon, trend, status, accentColor, onClick, isActive, isClickable = true }) {
  const getBorderColor = () => {
    if (isActive) {
      if (status === 'critical') return 'border-rose-500 shadow-glow-rose ring-2 ring-rose-500/50 bg-rose-950/40 dark:bg-rose-950/40 light:bg-rose-50/90';
      if (status === 'degrading') return 'border-amber-500 shadow-glow-amber ring-2 ring-amber-500/50 bg-amber-950/40 dark:bg-amber-950/40 light:bg-amber-50/90';
      if (status === 'healthy') return 'border-emerald-500 shadow-glow-emerald ring-2 ring-emerald-500/50 bg-emerald-950/40 dark:bg-emerald-950/40 light:bg-emerald-50/90';
      return 'border-cyan-400 shadow-glow-cyan ring-2 ring-cyan-500/50 bg-cyan-950/40 dark:bg-cyan-950/40 light:bg-cyan-50/90';
    }
    if (status === 'critical') return 'border-rose-500/40 dark:border-rose-500/40 light:border-rose-300 shadow-glow-rose hover:border-rose-400';
    if (status === 'degrading') return 'border-amber-500/40 dark:border-amber-500/40 light:border-amber-300 shadow-glow-amber hover:border-amber-400';
    if (status === 'healthy') return 'border-emerald-500/30 dark:border-emerald-500/30 light:border-emerald-300 hover:border-emerald-400';
    return 'border-cyan-500/30 dark:border-cyan-500/30 light:border-slate-300 shadow-glow-cyan hover:border-cyan-400';
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl bg-slate-900/85 dark:bg-slate-900/85 light:bg-white/95 border ${getBorderColor()} backdrop-blur-md transition-all ${
        isClickable ? 'cursor-pointer hover:translate-y-[-2px]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${accentColor || 'bg-slate-800 dark:bg-slate-800 light:bg-slate-100 text-cyan-400 dark:text-cyan-400 light:text-cyan-700'}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold font-mono text-white dark:text-white light:text-slate-900 tracking-tight">{value}</span>
        {isActive && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 border border-cyan-500/40 font-bold uppercase">
            FILTER ACTIVE
          </span>
        )}
        {!isActive && trend && (
          <span className={`text-xs font-mono px-2 py-0.5 rounded ${
            trend.startsWith('+') && status === 'critical' 
              ? 'bg-rose-500/20 text-rose-300 dark:text-rose-300 light:text-rose-800 border border-rose-500/30' 
              : 'bg-emerald-500/20 text-emerald-300 dark:text-emerald-300 light:text-emerald-800 border border-emerald-500/30'
          }`}>
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono flex items-center justify-between">
          <span>{subtext}</span>
          {isClickable && <span className="text-[10px] text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-mono opacity-80 hover:opacity-100">Filter &rarr;</span>}
        </p>
      )}
    </div>
  );
}
