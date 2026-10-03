import React from 'react';
import { useIncident } from '../context/IncidentContext';
import VisualTimeline from '../components/timeline/VisualTimeline';
import { ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, Server, FileCode2, Clock, Bot, ShieldCheck, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IncidentOverviewPage() {
  const { incident } = useIncident();

  if (!incident || incident.incidentStatus === "NORMAL") {
    return (
      <div className="p-12 text-center bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-2xl space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <h2 className="text-lg font-mono font-bold text-white dark:text-white light:text-slate-900">No Active Incidents Detected</h2>
        <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-md mx-auto">
          System telemetry is operating within nominal standard deviation bounds. Use the bottom timeline scrubber to simulate the 6-hour cascading incident.
        </p>
      </div>
    );
  }

  const root = incident.rootCause || {};
  const victim = incident.victimService || {};
  const intervention = incident.interventionWindow || {};
  const decoy = incident.sabotageDecoy || {};

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Status Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 dark:text-rose-300 light:text-rose-800 border border-rose-500/40 uppercase">
              SEV-1 CASCADING INCIDENT
            </span>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">INC-2026-HACKONEX</span>
          </div>
          <h1 className="text-xl font-mono font-bold text-white dark:text-white light:text-slate-900 tracking-tight mt-1">
            Propagating Backbone Network Routing Cascade
          </h1>
        </div>

        <Link
          to="/ai-copilot"
          className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/10"
        >
          <Bot className="w-4 h-4" />
          <span>Launch AI Copilot Deep Diagnostic</span>
        </Link>
      </div>

      {/* Primary Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Root Cause vs Downstream Victim vs Sabotage Decoy (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Root Cause Card */}
            <div className="p-5 rounded-2xl bg-rose-950/30 dark:bg-rose-950/30 light:bg-rose-50/90 border border-rose-500/40 space-y-3 shadow-glow-rose">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400 dark:text-rose-400 light:text-rose-700 uppercase tracking-wider">
                  CONFIRMED ORIGINATING ROOT CAUSE
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 dark:text-rose-300 light:text-rose-800">
                  {root.confidenceScore}% CONFIDENCE
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">{root.serviceName}</h3>
                <span className="text-xs font-mono text-cyan-300 dark:text-cyan-300 light:text-cyan-800">First Anomaly: {root.firstAnomalyFormatted} (+2.4σ)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 space-y-1 font-mono text-xs">
                <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-[10px] uppercase">Originating Config Change:</span>
                <p className="text-slate-200 dark:text-slate-200 light:text-slate-900 font-bold">{root.probableConfigChange?.id} — {root.probableConfigChange?.service}</p>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 text-[11px] leading-relaxed">{root.probableConfigChange?.description}</p>
              </div>
            </div>

            {/* Official Sabotage Decoy Rejection Card */}
            <div className="p-5 rounded-2xl bg-indigo-950/30 dark:bg-indigo-950/30 light:bg-indigo-50/90 border border-indigo-500/40 space-y-3 shadow-glow-cyan">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 dark:text-indigo-400 light:text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-indigo-400" /> REJECTED SABOTAGE DECOY
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 dark:text-indigo-300 light:text-indigo-800">
                  REJECTED
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">Payments Service</h3>
                <span className="text-xs font-mono text-indigo-300 dark:text-indigo-300 light:text-indigo-700">Decoy Config: {decoy.decoyConfig?.id} (T+01:35 / Min 95)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 space-y-1 font-mono text-xs">
                <span className="text-rose-400 font-bold text-[10px] uppercase">Decoy Rejection Evidence:</span>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 text-[11px] leading-relaxed">
                  cfg-2001 occurred 47 mins AFTER cascade started upstream at network-gateway. payments-service is a downstream symptom node.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Intervention Window Card */}
          <div className="p-5 rounded-2xl bg-emerald-950/30 dark:bg-emerald-950/30 light:bg-emerald-50/90 border border-emerald-500/40 space-y-2 shadow-glow-emerald">
            <div className="flex items-center gap-2 text-emerald-400 dark:text-emerald-400 light:text-emerald-700">
              <Clock className="w-5 h-5" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">Recommended Human Intervention Window</h3>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-mono font-bold text-emerald-300 dark:text-emerald-300 light:text-emerald-800">{intervention.formatted}</span>
              <span className="text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">({intervention.responseWindowMinutes} minutes buffer before critical state at {intervention.criticalTimeFormatted})</span>
            </div>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed pt-1">
              {intervention.benefit}
            </p>
          </div>

          {/* Incident Timeline */}
          <VisualTimeline />
        </div>

        {/* Right Column: Propagation Path Tree (1 Col) */}
        <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white/90 border border-white/10 dark:border-white/10 light:border-slate-200 rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <h3 className="text-xs font-mono font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 dark:border-white/10 light:border-slate-200 pb-3">
            <Server className="w-4 h-4 text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />
            Cascading Propagation Trajectory
          </h3>

          <div className="space-y-3 font-mono">
            {incident.cascadePath?.map((item) => (
              <div
                key={item.serviceId}
                className="p-3 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 space-y-1 relative"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white dark:text-white light:text-slate-900">{item.name}</span>
                  <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-bold">{item.onsetFormatted}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600">
                  <span>Drift: +{item.zScore}σ</span>
                  <span className="uppercase text-[10px] text-rose-400 dark:text-rose-400 light:text-rose-700 font-bold">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
