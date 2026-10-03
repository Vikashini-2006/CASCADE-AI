import React, { useState } from 'react';
import { useIncident } from '../../context/IncidentContext';
import { Bot, Send, Sparkles, ShieldCheck, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';

export default function CopilotChat() {
  const { incident, aiAnalysis } = useIncident();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: aiAnalysis?.copilotBriefing?.whatHappened || "CASCADE // AI Copilot initialized. Official Sabotage Decoy Rejection Engine ready.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const samplePrompts = [
    "Why was cfg-2001 (payments-service) rejected as a decoy?",
    "Show evidence confirming network-gateway cfg-1003 is root cause.",
    "What is the recommended SRE remediation action?",
    "What is the early intervention window available?"
  ];

  const handleSend = (textToSend) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Dynamic AI Response Logic
    setTimeout(() => {
      let aiText = "";

      if (q.toLowerCase().includes("decoy") || q.toLowerCase().includes("cfg-2001") || q.toLowerCase().includes("payments-service")) {
        aiText = `[SABOTAGE DECOY REJECTION PROOF]\nConfig change cfg-2001 on payments-service (minute 95) was evaluated and REJECTED as a decoy.\n\nEVIDENCE:\n1. TEMPORAL VIOLATION: cfg-2001 occurred at min 95 (05:35 UTC), which is 47 minutes AFTER the cascade already originated upstream at network-gateway (min 48).\n2. DEPENDENCY ANCESTRY: payments-service depends on auth-service and session-store, both of which were ALREADY degrading at min 63 & 75.\n3. DOWNSTREAM SYMPTOM: Elevated latency on payments-service around min 90-100 was caused by request queue backup from auth-service, NOT cfg-2001.`;
      } else if (q.toLowerCase().includes("network-gateway") || q.toLowerCase().includes("root cause") || q.toLowerCase().includes("cfg-1003")) {
        aiText = `[CONFIRMED ROOT CAUSE EVIDENCE: cfg-1003]\nService: network-gateway\nChange ID: cfg-1003 (T+00:42 / 04:42 UTC)\nDescription: Updated internal routing table for backbone service mesh v4.7 rollout.\nConfidence Score: 98.6%\n\nPROOF:\n1. Occurred 6 minutes BEFORE persistent anomaly onset on network-gateway (min 48).\n2. network-gateway has 0 upstream dependencies in dependency_map.json (Root entrypoint).\n3. All downstream service degradations propagated strictly along directed DAG edges originating from network-gateway.`;
      } else if (q.toLowerCase().includes("remediation") || q.toLowerCase().includes("action")) {
        aiText = `[RECOMMENDED REMEDIATION]\nExecute 1-click rollback:\n$ kubectl rollout undo deployment/network-gateway\n\nDo NOT waste time investigating payments-service cfg-2001; telemetry proves payments-service is a downstream symptom.`;
      } else if (q.toLowerCase().includes("intervention") || q.toLowerCase().includes("window")) {
        aiText = `[INTERVENTION WINDOW ANALYSIS]\nHuman intervention recommended: T+01:15 (10:42 AM).\nCritical degradation state: T+03:00 (11:17 AM).\nAvailable response buffer: 93 minutes before critical state.\nSimulated early intervention at 10:42 AM saves 285 minutes (4.75 hours) of platform outage!`;
      } else {
        aiText = aiAnalysis?.copilotBriefing?.whatHappened || "CASCADE AI telemetry engine confirmed correlation with cfg-1003 on network-gateway with 98.6% confidence.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  return (
    <div className="bg-[#0F172A] dark:bg-[#0F172A] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-2xl transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              CASCADE // AI Copilot
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 border border-cyan-500/30">
                SABOTAGE DECOY ENGINE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono">Autonomous Root-Cause & Telemetry Reasoning Agent</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-cyan-500/20 text-cyan-400 dark:text-cyan-400 light:text-cyan-700 border border-cyan-500/30'
            }`}>
              {m.sender === 'user' ? 'YOU' : <Sparkles className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] p-3.5 rounded-xl text-xs font-mono leading-relaxed whitespace-pre-wrap ${
              m.sender === 'user' 
                ? 'bg-indigo-600/30 border border-indigo-500/40 text-slate-100 dark:text-slate-100 light:text-slate-900' 
                : 'bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 text-cyan-100 dark:text-cyan-100 light:text-slate-800 shadow-sm'
            }`}>
              {m.text}
              <div className="mt-2 text-[9px] text-slate-500 dark:text-slate-500 light:text-slate-500 text-right">
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-white/5 dark:border-white/5 light:border-slate-200 bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-mono text-slate-500 shrink-0">Prompts:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[10px] font-mono whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 dark:bg-white/5 light:bg-white hover:bg-cyan-500/20 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-300 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-50 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask Copilot about telemetry evidence, decoy rejection, or root cause reasoning..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-950 dark:bg-slate-950 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
