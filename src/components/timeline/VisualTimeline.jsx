import React from 'react';
import { useIncident } from '../../context/IncidentContext';
import { Clock, ShieldAlert, FileCode2, CheckCircle2, AlertTriangle, ArrowRight, Zap } from 'lucide-react';

export default function VisualTimeline() {
  const { currentMinute, setCurrentMinute, incident } = useIncident();

  const timelineEvents = [
    {
      minute: 0,
      formattedTime: "T+00:00 (04:00 UTC)",
      title: "System Baseline Nominal",
      description: "All 18 microservices operating within nominal baseline parameters (p50 latency 8ms-45ms).",
      type: "normal",
      icon: CheckCircle2,
      service: "All Services"
    },
    {
      minute: 15,
      formattedTime: "T+00:15 (04:15 UTC)",
      title: "Routine Config Change Deployed (cfg-8842)",
      description: "PgBouncer pooler connection limit reduced from 5000 to 1200 on db-proxy-primary by db-reliability team.",
      type: "config",
      icon: FileCode2,
      service: "db-proxy-primary",
      highlight: true
    },
    {
      minute: 25,
      formattedTime: "T+00:25 (04:25 UTC)",
      title: "First Anomaly Drift Detected (+2.4σ)",
      description: "db-proxy-primary latency drifts from 8ms to 35ms. No hard error logs. Quiet connection queueing begins.",
      type: "anomaly",
      icon: Zap,
      service: "db-proxy-primary"
    },
    {
      minute: 75,
      formattedTime: "T+01:15 (05:15 UTC)",
      title: "Optimal SRE Intervention Window",
      description: "CASCADE // AI triggers high-confidence root-cause correlation. Intervening now prevents 4.5h of compounding cascade.",
      type: "intervention",
      icon: ShieldAlert,
      service: "CASCADE AI Engine",
      recommended: true
    },
    {
      minute: 150,
      formattedTime: "T+02:30 (06:30 UTC)",
      title: "Upstream Dependency Cascade (Order & Inventory)",
      description: "inventory-service and order-service thread pools exhaust waiting for db-proxy connections. Latency reaches 350ms.",
      type: "cascade",
      icon: AlertTriangle,
      service: "order-service"
    },
    {
      minute: 330,
      formattedTime: "T+05:30 (09:30 UTC)",
      title: "Edge Victim Saturation (API Gateway)",
      description: "API Gateway HTTP connection queues lock up (100% queue depth). Error rates surge to 42%.",
      type: "critical",
      icon: AlertTriangle,
      service: "api-gateway"
    },
    {
      minute: 360,
      formattedTime: "T+06:00 (10:00 UTC)",
      title: "Platform Unusable / Severe Outage",
      description: "Full cascading outage across commerce and payment pipelines. Traditional monitoring finally triggers hard alerts.",
      type: "outage",
      icon: AlertTriangle,
      service: "Entire Platform"
    }
  ];

  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            6-Hour Incident Propagation Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological reconstruction of telemetry drift from initial config commit to full platform outage.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Scrub Time: T+{String(Math.floor(currentMinute / 60)).padStart(2, '0')}:{String(currentMinute % 60).padStart(2, '0')}
        </span>
      </div>

      {/* Vertical Step Timeline */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {timelineEvents.map((evt) => {
          const Icon = evt.icon;
          const isPassed = currentMinute >= evt.minute;
          const isCurrent = currentMinute >= evt.minute && (evt.minute === 360 ? currentMinute === 360 : currentMinute < (timelineEvents[timelineEvents.indexOf(evt) + 1]?.minute || 361));

          return (
            <div
              key={evt.minute}
              onClick={() => setCurrentMinute(evt.minute)}
              className={`relative cursor-pointer transition-all group ${
                isCurrent ? 'scale-[1.01]' : ''
              }`}
            >
              {/* Node Icon Circle */}
              <div className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                evt.recommended
                  ? 'bg-emerald-500 ring-4 ring-emerald-500/30 text-slate-950 font-bold'
                  : evt.type === 'config'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : evt.type === 'outage' || evt.type === 'critical'
                  ? 'bg-rose-500 text-slate-950 font-bold'
                  : isPassed
                  ? 'bg-slate-700 text-cyan-400'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Card Container */}
              <div className={`p-4 rounded-xl border transition-all ${
                evt.recommended
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-glow-emerald'
                  : isCurrent
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-glow-cyan'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">{evt.formattedTime}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                      {evt.service}
                    </span>
                    {evt.recommended && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                        RECOMMENDED INTERVENTION
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    Minute {evt.minute} / 360
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-1.5">{evt.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{evt.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
