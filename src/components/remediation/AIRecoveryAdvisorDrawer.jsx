import React, { useState, useEffect } from 'react';
import { useIncident } from '../../context/IncidentContext';
import { apiService } from '../../services/api';
import { 
  Bot, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode2, 
  GitFork, 
  ArrowRight, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  X, 
  ChevronRight,
  Layers,
  Activity
} from 'lucide-react';

export default function AIRecoveryAdvisorDrawer({ serviceId, onClose }) {
  const { currentMinute, setSelectedServiceId } = useIncident();
  const [advisorData, setAdvisorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEvidenceDetail, setShowEvidenceDetail] = useState(false);

  useEffect(() => {
    if (!serviceId) return;
    let isMounted = true;
    setLoading(true);

    apiService.getRecoveryAdvisor(serviceId, currentMinute).then(data => {
      if (!isMounted) return;
      setAdvisorData(data);
      setLoading(false);
    }).catch(err => {
      if (!isMounted) return;
      console.error("Error fetching recovery advisor:", err);
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, [serviceId, currentMinute]);

  if (!serviceId) return null;

  const isHealthy = advisorData?.status === 'HEALTHY';
  const isCritical = advisorData?.status === 'CRITICAL';
  const isRootCause = advisorData?.isRootCause;
  const isDecoy = advisorData?.isDecoy;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-white border-l border-white/10 dark:border-white/10 light:border-slate-300 h-full overflow-y-auto p-6 space-y-6 font-sans shadow-2xl flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 dark:border-white/10 light:border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-mono font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
                    AI RECOVERY ADVISOR
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
                    AUTONOMOUS DIAGNOSTIC ENGINE
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono mt-0.5">
                  Context-aware root-cause correlation & evidence-backed action guidance.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 text-center space-y-3 font-mono">
              <Activity className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-cyan-300">Analyzing service telemetry & dependency propagation...</p>
              <p className="text-xs text-slate-500">Correlating metric baselines, graph topology, and configuration timestamps</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Service Status & Quick Badges */}
              <div className={`p-5 rounded-2xl border backdrop-blur-md space-y-3 ${
                isHealthy
                  ? 'bg-emerald-950/30 dark:bg-emerald-950/30 light:bg-emerald-50/90 border-emerald-500/40 shadow-glow-emerald'
                  : isCritical
                  ? 'bg-rose-950/30 dark:bg-rose-950/30 light:bg-rose-50/90 border-rose-500/40 shadow-glow-rose'
                  : 'bg-amber-950/30 dark:bg-amber-950/30 light:bg-amber-50/90 border-amber-500/40 shadow-glow-amber'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                      isHealthy
                        ? 'bg-emerald-500/20 text-emerald-300 dark:text-emerald-300 light:text-emerald-800 border-emerald-500/40'
                        : isCritical
                        ? 'bg-rose-500/20 text-rose-300 dark:text-rose-300 light:text-rose-800 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 dark:text-amber-300 light:text-amber-800 border-amber-500/40'
                    }`}>
                      {advisorData.status}
                    </span>

                    {isRootCause && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500 text-slate-950 font-bold uppercase">
                        ROOT CAUSE ORIGIN
                      </span>
                    )}

                    {isDecoy && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-indigo-400" />
                        REJECTED DECOY (cfg-2001)
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-bold">
                    Confidence: {advisorData.confidence}%
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-mono text-white dark:text-white light:text-slate-900">{advisorData.serviceName}</h3>
                  <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 mt-1 leading-relaxed font-mono">
                    {advisorData.summary}
                  </p>
                </div>
              </div>

              {/* "WHERE DID IT FAIL?" Dependency Path Visualization */}
              {advisorData.dependencyPath && advisorData.dependencyPath.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100 border border-cyan-500/30 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <GitFork className="w-4 h-4" />
                      WHERE DID IT FAIL? (CAUSAL TOPOLOGY TRAJECTORY)
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">Ingress &rarr; Failure</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                    {advisorData.dependencyPath.map((nodeId, idx) => {
                      const isTarget = nodeId === serviceId;
                      const isOrigin = idx === 0;
                      return (
                        <React.Fragment key={nodeId}>
                          <button
                            onClick={() => setSelectedServiceId(nodeId)}
                            className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                              isTarget
                                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/30'
                                : isOrigin
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                                : 'bg-slate-800 text-slate-300 border-white/10 hover:border-cyan-500/40'
                            }`}
                          >
                            <span>{nodeId}</span>
                            {isOrigin && <span className="ml-1 text-[9px] text-rose-400 font-bold">(ROOT)</span>}
                            {isTarget && <span className="ml-1 text-[9px] text-slate-950 font-bold">(SELECTED)</span>}
                          </button>
                          {idx < advisorData.dependencyPath.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-cyan-400" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empirical Telemetry Evidence Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Empirical Telemetry & Context Evidence
                  </span>
                  <button
                    onClick={() => setShowEvidenceDetail(!showEvidenceDetail)}
                    className="text-[10px] text-slate-400 hover:text-white underline"
                  >
                    {showEvidenceDetail ? "Collapse Evidence" : "Expand All Signals"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {advisorData.evidence.map((ev, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-white/5 dark:border-white/5 light:border-slate-200 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">{ev.label}</span>
                      <p className="text-slate-200 dark:text-slate-200 light:text-slate-900 font-semibold">{ev.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* WHY THIS IS HAPPENING (Likely Cause) */}
              <div className="p-5 rounded-2xl bg-indigo-950/30 dark:bg-indigo-950/30 light:bg-indigo-50/90 border border-indigo-500/40 space-y-2 font-mono text-xs">
                <span className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  WHY THIS IS HAPPENING (CAUSAL INFERENCE)
                </span>
                <p className="text-slate-200 dark:text-slate-200 light:text-slate-900 leading-relaxed pt-1">
                  {advisorData.likelyCause}
                </p>
              </div>

              {/* RECOMMENDED AI RECOVERY ACTION */}
              <div className="p-5 rounded-2xl bg-cyan-950/40 dark:bg-cyan-950/40 light:bg-cyan-50/90 border border-cyan-500/50 space-y-3 font-mono shadow-glow-cyan">
                <span className="text-xs font-bold text-cyan-300 dark:text-cyan-300 light:text-cyan-800 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  RECOMMENDED ACTION FOR {advisorData.serviceName}
                </span>
                <p className="text-xs text-white dark:text-white light:text-slate-900 leading-relaxed font-medium">
                  {advisorData.recommendation}
                </p>
              </div>

              {/* ORDERED NEXT STEPS */}
              <div className="p-5 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 space-y-3 font-mono text-xs">
                <span className="font-bold text-slate-300 dark:text-slate-300 light:text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  GUIDED RECOVERY STEPS
                </span>

                <ol className="space-y-2">
                  {advisorData.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px] shrink-0">
                        0{idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          )}
        </div>

        {/* Footer Action Bar (Human-in-the-Loop) */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 font-mono text-xs shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold transition-colors"
          >
            Close Advisor
          </button>

          {!loading && !isHealthy && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedServiceId(advisorData.dependencyPath?.[0] || 'network-gateway')}
                className="px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 font-bold transition-all flex items-center gap-1.5"
              >
                <span>TRACE TO ROOT CAUSE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
