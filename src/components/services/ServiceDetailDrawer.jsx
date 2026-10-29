import React, { useState, useEffect } from 'react';
import { useIncident } from '../../context/IncidentContext';
import { apiService } from '../../services/api';
import { getServiceStatus, getServiceLatency, getServiceZScore, getServiceErrorRate, getServiceQueueDepth } from '../../utils/formatters';
import { X, Server, Activity, AlertCircle, ArrowUpRight, ArrowDownRight, Layers, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function ServiceDetailDrawer({ serviceId, onClose, onOpenAdvisor }) {
  const { currentMinute, services } = useIncident();
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const service = services.find(s => (s.id === serviceId || s.serviceId === serviceId));

  useEffect(() => {
    if (!serviceId) return;
    let isMounted = true;
    setLoading(true);
    apiService.getMetrics(currentMinute, serviceId).then((data) => {
      if (!isMounted) return;
      setMetricsHistory(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => {
      if (!isMounted) return;
      setMetricsHistory([]);
      setLoading(false);
    });
    return () => { isMounted = false; };
  }, [serviceId, currentMinute]);

  if (!service) return null;

  const status = getServiceStatus(service);
  const latency = getServiceLatency(service);
  const zScore = getServiceZScore(service);
  const errorRate = getServiceErrorRate(service);
  const queueDepth = getServiceQueueDepth(service);
  const rps = service.requestVolume || service.rps || 1000;
  const effectiveId = service.serviceId || service.id;

  const statusColor = 
    status === 'critical' ? 'text-rose-400 bg-rose-500/20 border-rose-500/30' :
    status === 'degrading' ? 'text-amber-400 bg-amber-500/20 border-amber-500/30' :
    'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#0F172A] border-l border-white/10 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto backdrop-blur-xl animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/60 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{service.name}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${statusColor}`}>
                {status}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">{effectiveId} • {service.type || 'Microservice'} • {service.tier || 'Tier-1 Core'}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-6 space-y-6 flex-1">
        {/* Key Metrics Matrix */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Current Latency</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-mono font-bold text-white">{latency} ms</span>
              <span className="text-xs font-mono text-slate-400">(base {service.baselineLatency || 25}ms)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Latency Z-Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-xl font-mono font-bold ${
                zScore > 3 ? 'text-rose-400' : zScore > 2 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                +{zScore}σ
              </span>
              <span className="text-xs text-slate-400 font-mono">dev</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Error Rate</span>
            <p className="text-xl font-mono font-bold text-white mt-1">{errorRate}%</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Request Queue Depth</span>
            <p className="text-xl font-mono font-bold text-white mt-1">{queueDepth} reqs</p>
          </div>
        </div>

        {/* 6-Hour Latency Trend Recharts Chart */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-200">6-Hour Latency Telemetry (ms)</span>
            <span className="text-[10px] font-mono text-cyan-400">Baseline: {service.baselineLatency || 25}ms</span>
          </div>

          <div className="h-44 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">Loading telemetry...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsHistory}>
                  <XAxis dataKey="timeFormatted" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    itemStyle={{ color: '#06B6D4' }}
                  />
                  <ReferenceLine y={service.baselineLatency || 25} stroke="#10B981" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="latency" stroke="#06B6D4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Service Metadata & Owner */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Service Specifications</h4>
          <p className="text-xs text-slate-400 leading-relaxed">{service.description || 'Standard microservice component in CASCADE telemetry architecture.'}</p>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Owner: <strong className="text-slate-200">{service.owner || 'Platform SRE'}</strong></span>
            <span>RPS: <strong className="text-cyan-400">{rps} req/s</strong></span>
          </div>
        </div>

        {/* Upstream & Downstream Dependencies */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Dependency Topography</h4>
          
          <div>
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" /> Upstream Callers (Depends on this service):
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {Array.isArray(service.upstream) && service.upstream.length > 0 ? (
                service.upstream.map(u => (
                  <span key={u} className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-mono text-xs border border-white/10">
                    {u}
                  </span>
                ))
              ) : (
                <span className="text-xs font-mono text-slate-500 italic">None (Edge Entrypoint)</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-indigo-400" /> Downstream Dependencies (This service calls):
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {Array.isArray(service.downstream) && service.downstream.length > 0 ? (
                service.downstream.map(d => (
                  <span key={d} className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-cyan-500/20">
                    {d}
                  </span>
                ))
              ) : (
                <span className="text-xs font-mono text-slate-500 italic">None (Leaf Datastore/Partner)</span>
              )}
            </div>
          </div>
        </div>

        {/* AI Recovery Advisor Trigger Button */}
        {onOpenAdvisor && (
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                onClose();
                onOpenAdvisor(effectiveId);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Activity className="w-4 h-4 text-slate-950" />
              <span>LAUNCH AI RECOVERY ADVISOR &rarr;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
