import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import ServiceDetailDrawer from '../components/services/ServiceDetailDrawer';
import AIRecoveryAdvisorDrawer from '../components/remediation/AIRecoveryAdvisorDrawer';
import { getServiceStatus, getServiceLatency, getServiceZScore, getServiceQueueDepth } from '../utils/formatters';
import { Server, Search, Filter, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight, Activity, Bot, X } from 'lucide-react';

export default function ServiceHealthPage() {
  const { services, healthFilter, setHealthFilter, searchQuery, setSearchQuery, incident } = useIncident();
  const [selectedDrawerServiceId, setSelectedDrawerServiceId] = useState(null);
  const [advisorServiceId, setAdvisorServiceId] = useState(null);

  const healthyCount = services.filter(s => getServiceStatus(s) === 'healthy').length;
  const degradingCount = services.filter(s => getServiceStatus(s) === 'degrading').length;
  const criticalCount = services.filter(s => getServiceStatus(s) === 'critical').length;
  const totalCount = services.length;

  const filteredServices = services.filter((svc) => {
    const status = getServiceStatus(svc);
    const matchesFilter = healthFilter === 'all' || status === healthFilter;
    const matchesSearch = !searchQuery || 
      (svc.name && svc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (svc.id && svc.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (svc.serviceId && svc.serviceId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Title & Filter Controls Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
            LIVE SERVICE HEALTH MATRIX
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {totalCount} MICROSERVICES
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Real-time telemetry drift, baseline standard deviations, and connection queue depth per node.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs font-mono">
          {[
            { id: 'all', label: `ALL (${totalCount})` },
            { id: 'healthy', label: `HEALTHY (${healthyCount})` },
            { id: 'degrading', label: `DEGRADING (${degradingCount})` },
            { id: 'critical', label: `CRITICAL (${criticalCount})` }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setHealthFilter(healthFilter === f.id ? 'all' : f.id)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                healthFilter === f.id 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
          {healthFilter !== 'all' && (
            <button
              onClick={() => setHealthFilter('all')}
              title="Clear Filter"
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Microservices Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredServices.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs font-mono text-slate-400 space-y-3 bg-slate-900/60 border border-white/10 rounded-2xl">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-sm font-bold text-white">No services matching filter status "<strong className="uppercase text-amber-300">{healthFilter}</strong>"</p>
            {searchQuery && <p className="text-xs text-slate-500">Search query: "{searchQuery}"</p>}
            <button
              onClick={() => { setHealthFilter('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-300 hover:bg-slate-700 transition-colors font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredServices.map((svc) => {
            const id = svc.serviceId || svc.id;
            const status = getServiceStatus(svc);
            const latency = getServiceLatency(svc);
            const zScore = getServiceZScore(svc);
            const queueDepth = getServiceQueueDepth(svc);

            const isRootCause = incident?.rootCause?.serviceId === id;

            const getStatusBadge = () => {
              if (isRootCause) return 'bg-rose-500 text-slate-950 font-bold shadow-glow-rose';
              if (status === 'critical') return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
              if (status === 'degrading') return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
            };

            return (
              <div
                key={id}
                className={`p-5 rounded-2xl border bg-slate-900/80 backdrop-blur-md transition-all space-y-3 ${
                  isRootCause 
                    ? 'border-rose-500/50 shadow-glow-rose bg-rose-950/20' 
                    : status === 'critical'
                    ? 'border-rose-500/30'
                    : status === 'degrading'
                    ? 'border-amber-500/30'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div 
                    onClick={() => setSelectedDrawerServiceId(id)}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 border border-white/10 group-hover:border-cyan-500/40">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors">{svc.name || id}</h3>
                      <span className="text-[10px] font-mono text-slate-400">{id}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase ${getStatusBadge()}`}>
                    {isRootCause ? 'ROOT CAUSE' : status}
                  </span>
                </div>

                {/* Core Telemetry Stats */}
                <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-white/5 text-center font-mono">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase">Latency</span>
                    <p className="text-xs font-bold text-white mt-0.5">{latency} ms</p>
                    <span className="text-[9px] text-slate-500">base {svc.baselineLatency || 25}ms</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase">Dev Z-Score</span>
                    <p className={`text-xs font-bold mt-0.5 ${
                      zScore > 3 ? 'text-rose-400' : zScore > 2 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      +{zScore}σ
                    </p>
                    <span className="text-[9px] text-slate-500">standard dev</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase">Queue Depth</span>
                    <p className="text-xs font-bold text-white mt-0.5">{queueDepth} reqs</p>
                    <span className="text-[9px] text-slate-500">thread pool</span>
                  </div>
                </div>

                {/* Action Controls & AI Recovery Advisor Button */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 font-mono text-xs">
                  <button
                    onClick={() => setAdvisorServiceId(id)}
                    className={`flex-1 py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      status !== 'healthy' 
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 hover:scale-[1.02]' 
                        : 'bg-slate-800 text-cyan-300 border-white/10 hover:bg-slate-700'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5 text-slate-950" />
                    <span>AI RECOVERY ADVISOR</span>
                  </button>

                  <button
                    onClick={() => setSelectedDrawerServiceId(id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10"
                    title="View Telemetry Specs"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Service Detail Side Drawer */}
      {selectedDrawerServiceId && (
        <ServiceDetailDrawer
          serviceId={selectedDrawerServiceId}
          onClose={() => setSelectedDrawerServiceId(null)}
          onOpenAdvisor={(id) => setAdvisorServiceId(id)}
        />
      )}

      {/* AI Recovery Advisor Drawer */}
      {advisorServiceId && (
        <AIRecoveryAdvisorDrawer
          serviceId={advisorServiceId}
          onClose={() => setAdvisorServiceId(null)}
        />
      )}
    </div>
  );
}
