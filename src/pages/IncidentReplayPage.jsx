import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import TimeScrubber from '../components/layout/TimeScrubber';
import VisualTimeline from '../components/timeline/VisualTimeline';
import InteractiveDependencyGraph from '../components/topology/InteractiveDependencyGraph';
import { RotateCcw, Play, Pause, FastForward, Clock, ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function IncidentReplayPage() {
  const { currentMinute, isPlaying, setIsPlaying, incident } = useIncident();
  const [showEarlyIntervention, setShowEarlyIntervention] = useState(false);

  const simulation = incident?.earlyInterventionSimulation || {
    withoutIntervention: {
      totalDowntimeMinutes: 360,
      servicesAffected: 14
    },
    withIntervention: {
      interventionTime: "T+01:15 (10:42 AM)",
      action: "Revert backbone routing table cfg-1003 on network-gateway",
      simulatedRecoveryMinutes: 20,
      avoidedDowntimeMinutes: 285,
      servicesSaved: 10
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
            6-HOUR INCIDENT REPLAY & EARLY INTERVENTION SIMULATOR
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              REPLAY PLAYER
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Step through real metrics telemetry from T+00:00 to T+06:00 and simulate SRE early containment scenarios.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEarlyIntervention(!showEarlyIntervention)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              showEarlyIntervention 
                ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald' 
                : 'bg-slate-900 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{showEarlyIntervention ? 'HIDE SIMULATION' : 'SIMULATE EARLY INTERVENTION'}</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'PAUSE REPLAY' : 'START REPLAY'}</span>
          </button>
        </div>
      </div>

      {/* Early Intervention Simulation Panel */}
      {showEarlyIntervention && (
        <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-4 backdrop-blur-md shadow-glow-emerald">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Counterfactual Early Intervention Analysis
              </h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              COUNTERFACTUAL SIMULATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scenario 1: Without Intervention */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/40 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-rose-400 font-bold border-b border-white/10 pb-2">
                <span>SCENARIO A: WITHOUT INTERVENTION</span>
                <span className="text-[10px] uppercase">ACTUAL HISTORICAL OUTAGE</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <p>• T+00:42 — Config change cfg-1003 on network-gateway</p>
                <p>• T+00:48 — First subtle latency drift (+2.4σ)</p>
                <p>• T+01:45 — Cascading queue saturation across dependents</p>
                <p>• T+03:00 — Critical platform degradation</p>
                <p>• T+06:00 — Total platform outage (360 mins downtime)</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between text-rose-400 font-bold">
                <span>Services Affected: 14 / 17</span>
                <span>Total Downtime: 360 mins</span>
              </div>
            </div>

            {/* Scenario 2: With Early Intervention */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/50 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-white/10 pb-2">
                <span>SCENARIO B: WITH EARLY INTERVENTION</span>
                <span className="text-[10px] uppercase">CASCADE // AI RECOMMENDED</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <p>• T+00:48 — Detection of earliest +2.4σ anomaly on network-gateway</p>
                <p>• T+01:15 (10:42 AM) — SRE intervention trigger & rollback cfg-1003</p>
                <p>• T+01:35 — 20-minute simulated connection pool drain & recovery</p>
                <p className="text-emerald-300 font-bold">✓ Prevented downstream cascade to checkout-service & notifications-service</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between text-emerald-400 font-bold">
                <span>Avoided Downtime: 285 mins (4.75h)</span>
                <span>Services Saved: 10 Services</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Replay Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveDependencyGraph />
        <VisualTimeline />
      </div>
    </div>
  );
}
