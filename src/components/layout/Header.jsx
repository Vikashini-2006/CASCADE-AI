import React from 'react';
import { useIncident } from '../../context/IncidentContext';
import { Activity, Search, Bell, Shield, User, Clock, ChevronDown, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const { currentMinute, searchQuery, setSearchQuery, user, incident, logout, theme, toggleTheme } = useIncident();

  const formattedHours = String(Math.floor(currentMinute / 60)).padStart(2, '0');
  const formattedMins = String(currentMinute % 60).padStart(2, '0');
  const simulatedTimeStr = `2026-09-25 ${String(4 + Math.floor(currentMinute / 60)).padStart(2, '0')}:${formattedMins}:00 UTC`;

  return (
    <header className="h-16 border-b border-white/10 dark:border-white/10 light:border-slate-200 bg-[#0B0F17]/90 dark:bg-[#0B0F17]/90 light:bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
      {/* Brand & Live Ticker Status */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg tracking-wider text-slate-100 dark:text-slate-100 light:text-slate-900">CASCADE</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-mono border border-cyan-500/30">AI // SRE</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono tracking-widest uppercase">Observability Command Center</p>
          </div>
        </Link>

        <div className="h-6 w-px bg-white/10 dark:bg-white/10 light:bg-slate-200 hidden md:block" />

        {/* Live Incident Status Pill */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              incident?.cascadeRisk > 75 ? 'bg-rose-400' : incident?.cascadeRisk > 30 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              incident?.cascadeRisk > 75 ? 'bg-rose-500' : incident?.cascadeRisk > 30 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}></span>
          </span>
          <span className="text-xs font-mono font-medium text-slate-200 dark:text-slate-200 light:text-slate-800">
            {incident?.incidentStatus === "CRITICAL_CASCADE" && "SEV-1 CASCADING OUTAGE DETECTED"}
            {incident?.incidentStatus === "SUBTLE_DEGRADATION" && "SEV-2 PROPAGATING ANOMALY"}
            {incident?.incidentStatus === "EARLY_ANOMALY" && "EARLY ANOMALY DRIFT (+2.1σ)"}
            {incident?.incidentStatus === "NORMAL" && "SYSTEM BASELINE NOMINAL"}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 dark:bg-white/5 light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 font-mono">
            Risk: {incident?.cascadeRisk || 0}%
          </span>
        </div>
      </div>

      {/* Center Simulated Time Badge */}
      <div className="hidden xl:flex items-center gap-2 bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100 border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-600/30 px-3.5 py-1.5 rounded-lg shadow-inner">
        <Clock className="w-4 h-4 text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />
        <span className="text-xs font-mono text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-semibold">
          T+{formattedHours}:{formattedMins}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 border-l border-white/10 dark:border-white/10 light:border-slate-300 pl-2">
          {simulatedTimeStr}
        </span>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative w-40 md:w-56">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 rounded-lg text-xs text-slate-200 dark:text-slate-200 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
          />
        </div>

        {/* Theme Toggle Button (Dark ↔ Light) */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-cyan-400 dark:hover:text-cyan-400 light:hover:text-cyan-600 transition-all flex items-center justify-center"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        <button 
          title="Notifications"
          className="relative p-2 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-all"
        >
          <Bell className="w-4 h-4" />
          {incident?.counts?.critical > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-[#0B0F17] dark:ring-[#0B0F17] light:ring-white" />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3 border-l border-white/10 dark:border-white/10 light:border-slate-200 pl-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover"
          />
          <div className="hidden md:block">
            <p className="text-xs font-medium text-slate-200 dark:text-slate-200 light:text-slate-800">{user.name}</p>
            <p className="text-[10px] text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-mono">{user.role}</p>
          </div>
          <button 
            onClick={logout}
            title="Sign out"
            className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 hover:text-rose-400 transition-colors ml-1"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
