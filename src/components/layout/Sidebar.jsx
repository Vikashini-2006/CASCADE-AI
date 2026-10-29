import React from 'react';
import { NavLink } from 'react-router-dom';
import { useIncident } from '../../context/IncidentContext';
import { 
  LayoutDashboard, 
  Server, 
  GitFork, 
  AlertTriangle, 
  RotateCcw, 
  FileCode2, 
  Bot, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const { incident } = useIncident();

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Service Health', path: '/services', icon: Server, badge: ((incident?.counts?.degrading || 0) + (incident?.counts?.critical || 0)) || null },
    { name: 'Dependency Map', path: '/dependencies', icon: GitFork },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle, badge: incident?.incidentStatus !== "NORMAL" ? "1" : null, badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
    { name: 'Incident Replay', path: '/replay', icon: RotateCcw },
    { name: 'Config Changes', path: '/config-changes', icon: FileCode2 },
    { name: 'AI Incident Copilot', path: '/ai-copilot', icon: Bot, highlight: true }
  ];

  return (
    <aside className="w-64 border-r border-white/10 dark:border-white/10 light:border-slate-200 bg-[#0B0F17]/95 dark:bg-[#0B0F17]/95 light:bg-white/95 flex flex-col justify-between shrink-0 hidden md:flex transition-colors">
      <div className="p-4 space-y-6">
        {/* Navigation Header */}
        <div className="px-3 pt-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-500 light:text-slate-600 font-semibold">
            Command Navigation
          </p>
        </div>

        {/* Links list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-semibold shadow-sm'
                        : 'bg-slate-800/90 dark:bg-slate-800/90 light:bg-slate-100 border border-white/15 dark:border-white/15 light:border-slate-300 text-white dark:text-white light:text-slate-900 font-semibold shadow-sm'
                      : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-900/60 dark:hover:bg-slate-900/60 light:hover:bg-slate-100 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    item.highlight ? 'text-cyan-400 dark:text-cyan-400 light:text-cyan-700' : 'text-slate-400 dark:text-slate-400 light:text-slate-500 group-hover:text-slate-200'
                  }`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    item.badgeColor || 'bg-amber-500/20 text-amber-300 dark:text-amber-300 light:text-amber-800 border-amber-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Root Cause Card Quick Glance */}
      <div className="p-4 m-3 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100 border border-cyan-500/20 dark:border-cyan-500/20 light:border-cyan-600/20 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />
          <span className="text-xs font-mono font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">Root Cause Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
          Propagating cascade origin correlated with <span className="font-mono text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-bold">{incident?.rootCause?.probableConfigChange?.id || 'cfg-1003'}</span> on <span className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-semibold">{incident?.rootCause?.serviceName || 'network-gateway'}</span>.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 border-t border-white/5 dark:border-white/5 light:border-slate-200">
          <span>Confidence</span>
          <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-bold">{incident?.rootCause?.confidenceScore || 98.6}%</span>
        </div>
      </div>
    </aside>
  );
}
