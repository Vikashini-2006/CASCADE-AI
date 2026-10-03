import React from 'react';
import { useIncident } from '../context/IncidentContext';
import CopilotChat from '../components/copilot/CopilotChat';
import { Bot, Sparkles, ShieldCheck, FileCode2, Zap, CheckCircle2, Terminal } from 'lucide-react';

export default function AICopilotPage() {
  const { incident, aiAnalysis } = useIncident();

  const briefing = aiAnalysis?.copilotBriefing || {};
  const root = incident?.rootCause || {};
  const intervention = incident?.interventionWindow || {};

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
          AI INCIDENT COPILOT & DIAGNOSTIC REASONING
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            NEURAL ENGINE
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Autonomous root-cause identification, statistical evidence breakdown, and remediation playbook generation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: AI Reasoning & Evidence Dossier */}
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  AI Executive Incident Briefing
                </h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                {root.confidenceScore}% Root-Cause Confidence
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950/80 p-4 rounded-xl border border-white/10">
              {briefing.summary || "System operating within nominal baseline parameters."}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Statistical Telemetry Evidence</h4>
              <div className="space-y-2">
                {briefing.evidence?.map((ev, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs font-mono text-slate-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Playbook Command */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                <Terminal className="w-4 h-4" /> Recommended Remediation Playbook
              </div>
              <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-emerald-300 border border-white/10 select-all">
                $ kubectl set env deployment/db-proxy-primary PGBOUNCER_MAX_CLIENT_CONN=5000
              </div>
              <p className="text-[11px] text-slate-300">
                Recommended intervention window was <strong className="text-emerald-300">{intervention.formatted}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat Interface */}
        <CopilotChat />
      </div>
    </div>
  );
}
