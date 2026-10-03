import React, { useState } from 'react';
import { useIncident } from '../../context/IncidentContext';
import { GitFork, Activity, Server, AlertCircle, ArrowRight, Eye, ShieldAlert, Zap } from 'lucide-react';

export default function InteractiveDependencyGraph({ onSelectService }) {
  const { services, dependencies, incident, setSelectedServiceId } = useIncident();
  const [selectedNode, setSelectedNode] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isTracingPath, setIsTracingPath] = useState(false);

  // 2D layout mapping for the 17 actual services from dependency_map.json
  const layout = {
    "cdn-edge": { x: 70, y: 70 },
    "cache-gateway": { x: 70, y: 530 },

    "network-gateway": { x: 140, y: 300 }, // Root Backbone Router

    "auth-service": { x: 340, y: 130 },
    "session-store": { x: 340, y: 230 },
    "inventory-service": { x: 340, y: 330 },
    "search-service": { x: 340, y: 430 },
    "media-upload": { x: 340, y: 530 },

    "payments-service": { x: 540, y: 180 },
    "profile-service": { x: 540, y: 70 },
    "chat-support": { x: 540, y: 280 },
    "recommendation-engine": { x: 540, y: 450 },

    "checkout-service": { x: 730, y: 260 },
    "billing-service": { x: 730, y: 140 },

    "notifications-service": { x: 920, y: 180 },
    "shipping-service": { x: 920, y: 280 },
    "analytics-ingest": { x: 920, y: 400 }
  };

  const cascadePathServiceIds = incident?.cascadePath?.map(c => c.serviceId) || [
    "network-gateway", "auth-service", "payments-service", "checkout-service", "notifications-service"
  ];

  const handleNodeClick = (svcId) => {
    setSelectedNode(svcId);
    setSelectedServiceId(svcId);
    if (onSelectService) onSelectService(svcId);
  };

  const getServiceStatus = (svcId) => {
    const s = services.find(item => item.serviceId === svcId || item.id === svcId);
    return s?.status || 'healthy';
  };

  const getServiceZScore = (svcId) => {
    const s = services.find(item => item.serviceId === svcId || item.id === svcId);
    return s?.zScore || 0;
  };

  const getNodeColor = (status, isRootCause, isHighlighted) => {
    if (isRootCause) return 'fill-rose-950 stroke-rose-500 shadow-glow-rose';
    if (isHighlighted) return 'fill-amber-950/90 stroke-amber-400 stroke-2';
    if (status === 'critical') return 'fill-rose-950/80 stroke-rose-500';
    if (status === 'degrading') return 'fill-amber-950/80 stroke-amber-500';
    return 'fill-slate-900 stroke-cyan-500/40';
  };

  const edges = dependencies.edges || [];

  return (
    <div className="w-full bg-[#080C14] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[640px]">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              REAL DATASET DEPENDENCY MAP (17 SERVICES)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Parsed from <code className="text-cyan-300">dependency_map.json</code>. Click nodes to inspect baseline deviations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Trace Incident Path Toggle Button */}
          <button
            onClick={() => setIsTracingPath(!isTracingPath)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              isTracingPath 
                ? 'bg-rose-500 text-slate-950 border border-rose-400 shadow-glow-rose' 
                : 'bg-slate-900 text-rose-300 border border-rose-500/40 hover:bg-rose-500/20'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isTracingPath ? 'TRACING CASCADE PATH' : 'TRACE INCIDENT PATH'}</span>
          </button>

          {/* Filter Controls */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-white/10 text-xs font-mono">
            {['all', 'healthy', 'degrading', 'critical'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded capitalize transition-all ${
                  filter === tab 
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Canvas Topology Render */}
      <div className="relative w-full h-[520px] my-4 overflow-x-auto bg-grid-pattern rounded-xl border border-white/5 flex items-center justify-center">
        <svg className="w-[1080px] h-[580px] shrink-0" viewBox="0 0 1080 620">
          <defs>
            <marker id="arrow-healthy" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06B6D4" opacity="0.6" />
            </marker>
            <marker id="arrow-critical" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" opacity="0.9" />
            </marker>
            <marker id="arrow-highlight" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" opacity="1" />
            </marker>
          </defs>

          {/* Render Edge Connections */}
          {edges.map((edge, idx) => {
            const src = layout[edge.source];
            const tgt = layout[edge.target];
            if (!src || !tgt) return null;

            const srcStatus = getServiceStatus(edge.source);
            const tgtStatus = getServiceStatus(edge.target);

            const isPathEdge = isTracingPath && cascadePathServiceIds.includes(edge.source) && cascadePathServiceIds.includes(edge.target);
            const isDegradedEdge = srcStatus !== 'healthy' || tgtStatus !== 'healthy';
            const edgeColor = isPathEdge ? '#F59E0B' : (srcStatus === 'critical' || tgtStatus === 'critical') ? '#EF4444' : '#06B6D4';
            const markerId = isPathEdge ? 'url(#arrow-highlight)' : (srcStatus === 'critical' || tgtStatus === 'critical') ? 'url(#arrow-critical)' : 'url(#arrow-healthy)';

            return (
              <g key={`${edge.source}-${edge.target}-${idx}`}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={edgeColor}
                  strokeWidth={isPathEdge ? 3.5 : isDegradedEdge ? 2.2 : 1.2}
                  strokeOpacity={isPathEdge ? 1.0 : isDegradedEdge ? 0.8 : 0.3}
                  strokeDasharray={isPathEdge ? "8 4" : "none"}
                  markerEnd={markerId}
                  className={isPathEdge ? "animate-pulse" : ""}
                />
              </g>
            );
          })}

          {/* Render Service Nodes */}
          {Object.keys(layout).map((svcId) => {
            const pos = layout[svcId];
            if (!pos) return null;

            const status = getServiceStatus(svcId);
            const zScore = getServiceZScore(svcId);
            const isRootCause = incident?.rootCause?.serviceId === svcId || svcId === 'network-gateway';
            const isHighlighted = isTracingPath && cascadePathServiceIds.includes(svcId);
            const isSelected = selectedNode === svcId;

            if (filter !== 'all' && status !== filter && !(filter === 'critical' && isRootCause)) {
              return null;
            }

            const formattedName = svcId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

            return (
              <g
                key={svcId}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => handleNodeClick(svcId)}
                className="cursor-pointer group"
              >
                {/* Node Outer Pulsing Aura */}
                {(isRootCause || status === 'critical' || isHighlighted) && (
                  <circle
                    r="42"
                    className={`animate-ping opacity-75 ${isRootCause ? 'fill-rose-500/30' : 'fill-amber-500/20'}`}
                  />
                )}

                {/* Main Node Box */}
                <rect
                  x="-65"
                  y="-26"
                  width="130"
                  height="52"
                  rx="10"
                  className={`transition-all duration-200 ${
                    isSelected ? 'stroke-cyan-400 stroke-2 fill-slate-800' : getNodeColor(status, isRootCause, isHighlighted)
                  }`}
                  strokeWidth={isRootCause || isSelected || isHighlighted ? 2.5 : 1.2}
                />

                {/* Service Name */}
                <text
                  x="0"
                  y="-6"
                  textAnchor="middle"
                  className="fill-white font-mono text-[11px] font-bold pointer-events-none"
                >
                  {formattedName.length > 16 ? formattedName.substring(0, 14) + '..' : formattedName}
                </text>

                {/* Latency & Z-Score */}
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  className={`font-mono text-[9px] pointer-events-none ${
                    status === 'critical' ? 'fill-rose-300 font-bold' : status === 'degrading' ? 'fill-amber-300' : 'fill-slate-400'
                  }`}
                >
                  +{zScore}σ std dev
                </text>

                {/* Root Cause Flag */}
                {isRootCause && (
                  <g transform="translate(0, -32)">
                    <rect x="-42" y="-10" width="84" height="16" rx="4" className="fill-rose-500" />
                    <text x="0" y="2" textAnchor="middle" className="fill-slate-950 font-mono text-[9px] font-extrabold uppercase">
                      ROOT CAUSE
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Healthy (&lt;+2.0σ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Degrading (+2.0σ - +5.0σ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/50" />
            <span>Critical Cascade (&gt;+5.0σ)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          Source: <strong className="text-cyan-400">datasets/dependency_map.json</strong> (17 nodes, {edges.length} directed edges)
        </div>
      </div>
    </div>
  );
}
