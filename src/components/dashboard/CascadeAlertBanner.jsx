import React from 'react';
import { useIncident } from '../../context/IncidentContext';
import { ShieldAlert, ArrowRight, Bot, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CascadeAlertBanner() {
  const { incident } = useIncident();

  if (!incident || incident.incidentStatus === "NORMAL") {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-emerald-300 dark:text-emerald-300 light:text-emerald-700 uppercase tracking-wider">System Baseline Nominal</h4>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">All microservices operating within ±1.5σ baseline standard deviation.</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Cascade Risk: 0%
        </span>
      </div>
    );
  }

  const isCritical = incident.incidentStatus === "CRITICAL_CASCADE";

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
      isCritical 
        ? 'bg-rose-950/40 dark:bg-rose-950/40 light:bg-rose-50/90 border-rose-500/50 shadow-glow-rose' 
        : 'bg-amber-950/40 dark:bg-amber-950/40 light:bg-amber-50/90 border-amber-500/50 shadow-glow-amber'
    }`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${
            isCritical ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-amber-500/20 text-amber-400'
          }`}>
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                isCritical ? 'bg-rose-500/20 text-rose-300 dark:text-rose-300 light:text-rose-800 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 dark:text-amber-300 light:text-amber-800 border-amber-500/40'
              }`}>
                {incident.incidentStatus.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">
                Confidence: <strong className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700">{incident.rootCause?.confidenceScore}%</strong>
              </span>

              {/* Sabotage Decoy Rejection Pill Badge */}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 dark:text-indigo-300 light:text-indigo-800 border border-indigo-500/30 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                DECOY REJECTED: cfg-2001
              </span>
            </div>

            <h3 className="text-sm font-semibold text-white dark:text-white light:text-slate-900 mt-1">
              Propagating Cascade Rooted at <span className="font-mono text-cyan-300 dark:text-cyan-300 light:text-cyan-700">{incident.rootCause?.serviceName}</span>
            </h3>

            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 mt-1 max-w-3xl leading-relaxed">
              Subtle latency drift began at <strong className="font-mono text-cyan-300 dark:text-cyan-300 light:text-cyan-700">{incident.rootCause?.firstAnomalyFormatted}</strong> following configuration change <strong className="font-mono text-slate-200 dark:text-slate-200 light:text-slate-800">{incident.rootCause?.probableConfigChange?.id}</strong>. SRE intervention window recommended at <span className="font-mono text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-semibold">{incident.interventionWindow?.formatted}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <Link
            to="/ai-copilot"
            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/10"
          >
            <Bot className="w-4 h-4" />
            <span>AI Copilot Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
