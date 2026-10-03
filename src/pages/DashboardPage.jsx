import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import KPICard from '../components/dashboard/KPICard';
import CascadeAlertBanner from '../components/dashboard/CascadeAlertBanner';
import ServiceDetailDrawer from '../components/services/ServiceDetailDrawer';
import { getServiceStatus, getServiceLatency, getServiceZScore, getServiceQueueDepth } from '../utils/formatters';
import { 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  FileCode2, 
  ChevronRight,
  TrendingUp,
  Search,
  RotateCcw,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { 
    services, 
    incident, 
    configChanges, 
    selectedServiceId, 
    setSelectedServiceId,
    healthFilter,
    setHealthFilter,
    searchQuery,
    setSearchQuery
  } = useIncident();
  
  const [drawerServiceId, setDrawerServiceId] = useState(null);
  const navigate = useNavigate();

  // Single Source of Truth for Status Counts derived from real datasets
  const healthyCount = services.filter(s => getServiceStatus(s) === 'healthy').length;
  const degradingCount = services.filter(s => getServiceStatus(s) === 'degrading').length;
  const criticalCount = services.filter(s => getServiceStatus(s) === 'critical').length;
  const totalCount = services.length;

  const rootCause = incident?.rootCause || {};

  // Handle KPI card click: toggles filter or resets to 'all'
  const handleKpiFilterClick = (targetFilter) => {
    if (healthFilter === targetFilter) {
      setHealthFilter('all'); // Toggle off
    } else {
      setHealthFilter(targetFilter);
    }
  };

  // Filter services combining healthFilter and global searchQuery
  const filteredServices = services.filter((svc) => {
    const status = getServiceStatus(svc);
    const matchesStatus = healthFilter === 'all' || status === healthFilter;
    const matchesSearch = !searchQuery || 
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (svc.id && svc.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (svc.serviceId && svc.serviceId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleSelectService = (svc) => {
    const id = svc.serviceId || svc.id;
    setDrawerServiceId(id);
    setSelectedServiceId(id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
            SRE COMMAND CENTER OVERVIEW
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              LIVE TELEMETRY
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time latency drift correlation & non-crashing propagating incident detection.
          </p>
        </div>

        <Link
          to="/ai-copilot"
          className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-2 hover:bg-cyan-500/10 transition-colors shadow-lg shadow-cyan-500/10"
        >
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Launch AI Copilot Engine</span>
        </Link>
      </div>

      {/* Primary Cascade Alert Banner */}
      <CascadeAlertBanner />

      {/* 6 Key Performance Indicator Cards (Clickable for Status Filtering) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Services"
          value={totalCount}
          subtext="Click to show all"
          icon={Server}
          accentColor="bg-slate-800 text-cyan-400"
          isActive={healthFilter === 'all'}
          onClick={() => setHealthFilter('all')}
        />
        <KPICard
          title="Healthy"
          value={healthyCount}
          subtext="Click to filter"
          icon={CheckCircle2}
          status="healthy"
          accentColor="bg-emerald-500/20 text-emerald-400"
          isActive={healthFilter === 'healthy'}
          onClick={() => handleKpiFilterClick('healthy')}
        />
        <KPICard
          title="Degrading"
          value={degradingCount}
          subtext="Click to filter"
          icon={AlertTriangle}
          status={degradingCount > 0 ? "degrading" : "healthy"}
          accentColor="bg-amber-500/20 text-amber-400"
          isActive={healthFilter === 'degrading'}
          onClick={() => handleKpiFilterClick('degrading')}
        />
        <KPICard
          title="Critical Outage"
          value={criticalCount}
          subtext="Click to filter"
          icon={ShieldAlert}
          status={criticalCount > 0 ? "critical" : "healthy"}
          accentColor="bg-rose-500/20 text-rose-400"
          isActive={healthFilter === 'critical'}
          onClick={() => handleKpiFilterClick('critical')}
        />
        <KPICard
          title="Cascade Risk"
          value={`${incident?.cascadeRisk || 0}%`}
          subtext="Propagating risk index"
          icon={TrendingUp}
          status={incident?.cascadeRisk > 75 ? "critical" : incident?.cascadeRisk > 30 ? "degrading" : "healthy"}
          accentColor="bg-indigo-500/20 text-indigo-400"
          isClickable={false}
        />
        <KPICard
          title="Active Incidents"
          value={incident?.incidentStatus !== "NORMAL" ? "1" : "0"}
          subtext="SEV-1 Propagating"
          icon={Activity}
          status={incident?.incidentStatus !== "NORMAL" ? "critical" : "healthy"}
          accentColor="bg-rose-500/20 text-rose-400"
          isClickable={false}
        />
      </div>

      {/* Main Grid: Live Health Summary + Config Event Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Service Health Table (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-md">
          {/* Table Header & Status Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Live Microservice Telemetry Summary
              </h3>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                Showing <span className="text-cyan-300 font-bold">{filteredServices.length}</span> of {totalCount} Services
                {healthFilter !== 'all' && (
                  <span className="ml-1 text-amber-300">
                    (Filtered by: <strong className="uppercase">{healthFilter}</strong>)
                  </span>
                )}
              </p>
            </div>

            {/* Status Filter Tab Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs font-mono">
              {[
                { id: 'all', label: `ALL (${totalCount})` },
                { id: 'healthy', label: `HEALTHY (${healthyCount})` },
                { id: 'degrading', label: `DEGRADING (${degradingCount})` },
                { id: 'critical', label: `CRITICAL (${criticalCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleKpiFilterClick(tab.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                    healthFilter === tab.id
                      ? tab.id === 'critical'
                        ? 'bg-rose-500 text-slate-950 font-bold shadow-md shadow-rose-500/20'
                        : tab.id === 'degrading'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : tab.id === 'healthy'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
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

          {/* Service Table */}
          <div className="overflow-x-auto">
            {filteredServices.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-slate-400 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <p>No microservices matching filter status "<strong className="uppercase text-amber-300">{healthFilter}</strong>"</p>
                {searchQuery && <p className="text-[11px] text-slate-500">Search query: "{searchQuery}"</p>}
                <button
                  onClick={() => { setHealthFilter('all'); setSearchQuery(''); }}
                  className="px-3 py-1 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10 uppercase text-[10px]">
                    <th className="pb-2">Service Name</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Latency</th>
                    <th className="pb-2 text-right">Z-Score</th>
                    <th className="pb-2 text-right">Queue Depth</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredServices.map((svc) => {
                    const id = svc.serviceId || svc.id;
                    const status = getServiceStatus(svc);
                    const latency = getServiceLatency(svc);
                    const zScore = getServiceZScore(svc);
                    const queueDepth = getServiceQueueDepth(svc);
                    const isRoot = rootCause.serviceId === id;

                    return (
                      <tr 
                        key={id} 
                        onClick={() => handleSelectService(svc)}
                        className="hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <td className="py-2.5 font-bold text-slate-200 flex items-center gap-2">
                          <span>{svc.name || id}</span>
                          {isRoot && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              ROOT CAUSE
                            </span>
                          )}
                        </td>
                        <td className="py-2.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${
                            status === 'critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                            status === 'degrading' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-bold text-white">
                          {latency} ms
                        </td>
                        <td className={`py-2.5 text-right font-bold ${
                          zScore > 3 ? 'text-rose-400' : zScore > 2 ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          +{zScore}σ
                        </td>
                        <td className="py-2.5 text-right text-slate-300">
                          {queueDepth} reqs
                        </td>
                        <td className="py-2.5 text-right">
                          <button className="text-[11px] text-cyan-400 hover:underline">Inspect</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <Link 
              to="/services" 
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Open Full Matrix Page with Filter ({healthFilter.toUpperCase()}) &rarr;
            </Link>
          </div>
        </div>

        {/* Configuration Event Audit Ticker (1 Col) */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-cyan-400" />
                Config & Deployment Log
              </h3>
              <Link to="/config-changes" className="text-xs font-mono text-cyan-400 hover:underline">
                Audit Stream
              </Link>
            </div>

            <div className="mt-3 space-y-3">
              {configChanges.slice(0, 4).map((cfg) => {
                const isCorrelated = rootCause.probableConfigChange?.id === cfg.id;

                return (
                  <div
                    key={cfg.id}
                    className={`p-3 rounded-xl border text-xs font-mono transition-all ${
                      isCorrelated
                        ? 'bg-rose-950/30 border-rose-500/40 shadow-glow-rose'
                        : 'bg-slate-950/60 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300">{cfg.service}</span>
                      <span className="text-[10px] text-slate-500">{cfg.timeFormatted}</span>
                    </div>

                    <p className="text-slate-300 mt-1 line-clamp-2 text-[11px] leading-relaxed">
                      {cfg.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">By {cfg.author}</span>
                      {isCorrelated && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                          98.6% AI CORRELATED
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            to="/config-changes"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors mt-4"
          >
            <span>VIEW FULL CONFIG AUDIT LOG</span>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
          </Link>
        </div>
      </div>

      {/* Service Detail Side Drawer */}
      {drawerServiceId && (
        <ServiceDetailDrawer
          serviceId={drawerServiceId}
          onClose={() => setDrawerServiceId(null)}
        />
      )}
    </div>
  );
}
